from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import AdminActual
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["categorias"])


def no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


def duplicada() -> HTTPException:
    return HTTPException(status.HTTP_409_CONFLICT, detail="Ya existe una categoría con ese nombre")


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


CategoriaServiceDep = Annotated[CategoriaService, Depends(get_categoria_service)]


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: CategoriaServiceDep):
    return service.listar()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, service: CategoriaServiceDep):
    try:
        return service.obtener(categoria_id)
    except CategoriaNoEncontrada:
        raise no_encontrada()


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(datos: CategoriaCreate, admin: AdminActual, service: CategoriaServiceDep):
    try:
        return service.crear(datos)
    except NombreDuplicado:
        raise duplicada()


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int, datos: CategoriaUpdate, admin: AdminActual, service: CategoriaServiceDep
):
    try:
        return service.actualizar(categoria_id, datos)
    except CategoriaNoEncontrada:
        raise no_encontrada()
    except NombreDuplicado:
        raise duplicada()


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, admin: AdminActual, service: CategoriaServiceDep):
    try:
        service.eliminar(categoria_id)
    except CategoriaNoEncontrada:
        raise no_encontrada()
