from datetime import datetime

from app.core.database import ahora
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic

TRANSICIONES: dict[str, set[str]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        super().__init__(f"El producto {producto_id} no existe")


class ProductoNoDisponible(Exception):
    def __init__(self, nombre: str):
        super().__init__(f"El producto {nombre} no está disponible")


class StockInsuficiente(Exception):
    def __init__(self, nombre: str, stock: int):
        super().__init__(f"Stock insuficiente para {nombre}: quedan {stock} unidades")


class ProductoRepetido(Exception):
    def __init__(self):
        super().__init__("Un producto no puede repetirse en el pedido")


class TransicionInvalida(Exception):
    def __init__(self, actual: str, nuevo: str):
        super().__init__(f"No se puede pasar un pedido de {actual} a {nuevo}")


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def _obtener(self, uow: PedidoUnitOfWork, pedido_id: int) -> Pedido:
        pedido = uow.pedidos.get_by_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontrado()
        return pedido

    def _verificar_acceso(self, pedido: Pedido, usuario: UserPublic) -> None:
        if usuario.role != "admin" and pedido.usuario_id != usuario.id:
            raise PedidoAjeno()

    def _aplicar_transicion(self, uow: PedidoUnitOfWork, pedido: Pedido, nuevo: str) -> None:
        if nuevo not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(pedido.estado, nuevo)
        if nuevo == "CANCELADO":
            for item in pedido.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is not None:
                    producto.stock += item.cantidad
                    uow.productos.add(producto)
        pedido.estado = nuevo
        pedido.updated_at = ahora()
        uow.pedidos.add(pedido)

    def crear(self, datos: PedidoCreate, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            ids = [item.producto_id for item in datos.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido()

            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario.id,
                    forma_pago=datos.forma_pago,
                    direccion_entrega=datos.direccion_entrega,
                    notas=datos.notas,
                    total=0,
                )
            )

            total = 0.0
            for item in datos.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(producto.nombre, producto.stock)

                producto.stock -= item.cantidad
                uow.productos.add(producto)

                subtotal = round(producto.precio_base * item.cantidad, 2)
                uow.detalles.add(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(
        self, usuario: UserPublic, skip: int, limit: int, estado: str | None
    ) -> PedidosPaginados:
        with self.uow as uow:
            if usuario.role == "admin":
                total, pedidos = uow.pedidos.list_all(skip, limit, estado)
            else:
                total, pedidos = uow.pedidos.list_by_usuario(usuario.id, skip, limit, estado)
            return PedidosPaginados(
                total=total, items=[PedidoRead.model_validate(p) for p in pedidos]
            )

    def obtener(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            self._verificar_acceso(pedido, usuario)
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, datos: CambioEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            self._aplicar_transicion(uow, pedido, datos.estado)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida(pedido.estado, "CANCELADO")
            self._aplicar_transicion(uow, pedido, "CANCELADO")
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            inicio_del_dia = datetime.now().astimezone().replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            return ResumenPedidos(
                pendientes=conteos.get("PENDIENTE", 0),
                en_preparacion=conteos.get("EN_PREPARACION", 0),
                entregados=conteos.get("ENTREGADO", 0),
                cancelados=conteos.get("CANCELADO", 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_del_dia),
                ingresos_entregados=round(uow.pedidos.sum_total_por_estado("ENTREGADO"), 2),
            )
