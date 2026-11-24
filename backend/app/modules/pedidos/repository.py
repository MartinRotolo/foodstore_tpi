from datetime import datetime

from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(Pedido, session)

    def _listar(self, filtros: list, skip: int, limit: int) -> tuple[int, list[Pedido]]:
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filtros)).one()
        items = self.session.exec(
            select(Pedido).where(*filtros).order_by(Pedido.id.desc()).offset(skip).limit(limit)
        ).all()
        return total, list(items)

    def list_all(self, skip: int, limit: int, estado: str | None = None) -> tuple[int, list[Pedido]]:
        filtros = [Pedido.estado == estado] if estado else []
        return self._listar(filtros, skip, limit)

    def list_by_usuario(
        self, usuario_id: int, skip: int, limit: int, estado: str | None = None
    ) -> tuple[int, list[Pedido]]:
        filtros = [Pedido.usuario_id == usuario_id]
        if estado:
            filtros.append(Pedido.estado == estado)
        return self._listar(filtros, skip, limit)

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(
            select(Pedido.estado, func.count(Pedido.id)).group_by(Pedido.estado)
        ).all()
        return {estado: cantidad for estado, cantidad in filas}

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(
            select(func.count(Pedido.id)).where(Pedido.created_at >= desde)
        ).one()

    def sum_total_por_estado(self, estado: str) -> float:
        return self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        ).one()
