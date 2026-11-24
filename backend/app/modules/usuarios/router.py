from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import AdminActual
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import AutoDesactivacion, UsuarioNoEncontrado, UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


UsuarioServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


def _cambiar_estado(
    service: UsuarioService, usuario_id: int, disabled: bool, admin: UserPublic
) -> UserPublic:
    try:
        return service.cambiar_estado(usuario_id, disabled, admin.id)
    except UsuarioNoEncontrado:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    except AutoDesactivacion:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, detail="No podés desactivar tu propia cuenta"
        )


@router.get("", response_model=list[UserPublic])
def listar_usuarios(admin: AdminActual, service: UsuarioServiceDep):
    return service.listar()


@router.post("/{usuario_id}/activar", response_model=UserPublic)
def activar_usuario(usuario_id: int, admin: AdminActual, service: UsuarioServiceDep):
    return _cambiar_estado(service, usuario_id, False, admin)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(usuario_id: int, admin: AdminActual, service: UsuarioServiceDep):
    return _cambiar_estado(service, usuario_id, True, admin)
