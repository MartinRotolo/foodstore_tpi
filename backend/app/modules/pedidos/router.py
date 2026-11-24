from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import AdminActual, UsuarioActual
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")


def ajeno() -> HTTPException:
    return HTTPException(status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario")


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


PedidoServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(datos: PedidoCreate, usuario: UsuarioActual, service: PedidoServiceDep):
    try:
        return service.crear(datos, usuario)
    except ProductoNoEncontrado as error:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(error))
    except (StockInsuficiente, ProductoNoDisponible, ProductoRepetido) as error:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: UsuarioActual,
    service: PedidoServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
):
    return service.listar(usuario, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(admin: AdminActual, service: PedidoServiceDep):
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(pedido_id: int, usuario: UsuarioActual, service: PedidoServiceDep):
    try:
        return service.obtener(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise no_encontrado()
    except PedidoAjeno:
        raise ajeno()


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado_pedido(
    pedido_id: int, datos: CambioEstado, admin: AdminActual, service: PedidoServiceDep
):
    try:
        return service.cambiar_estado(pedido_id, datos)
    except PedidoNoEncontrado:
        raise no_encontrado()
    except TransicionInvalida as error:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(pedido_id: int, usuario: UsuarioActual, service: PedidoServiceDep):
    try:
        return service.cancelar(pedido_id, usuario)
    except PedidoNoEncontrado:
        raise no_encontrado()
    except PedidoAjeno:
        raise ajeno()
    except TransicionInvalida:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, detail="Solo se puede cancelar un pedido PENDIENTE"
        )
