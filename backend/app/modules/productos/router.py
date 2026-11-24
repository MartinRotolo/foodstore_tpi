from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import AdminActual
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductoStockUpdate,
    ProductosPaginados,
    ProductoUpdate,
)
from app.modules.productos.service import CategoriaNoEncontrada, ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["productos"])


def no_encontrado() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")


def categoria_no_encontrada() -> HTTPException:
    return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


ProductoServiceDep = Annotated[ProductoService, Depends(get_producto_service)]


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    service: ProductoServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, service: ProductoServiceDep):
    try:
        return service.obtener(producto_id)
    except ProductoNoEncontrado:
        raise no_encontrado()


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(datos: ProductoCreate, admin: AdminActual, service: ProductoServiceDep):
    try:
        return service.crear(datos)
    except CategoriaNoEncontrada:
        raise categoria_no_encontrada()


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, admin: AdminActual, service: ProductoServiceDep
):
    try:
        return service.actualizar(producto_id, datos)
    except ProductoNoEncontrado:
        raise no_encontrado()
    except CategoriaNoEncontrada:
        raise categoria_no_encontrada()


@router.patch("/{producto_id}/stock", response_model=ProductoRead)
def actualizar_stock(
    producto_id: int, datos: ProductoStockUpdate, admin: AdminActual, service: ProductoServiceDep
):
    try:
        return service.actualizar_stock(producto_id, datos)
    except ProductoNoEncontrado:
        raise no_encontrado()


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, admin: AdminActual, service: ProductoServiceDep):
    try:
        service.eliminar(producto_id)
    except ProductoNoEncontrado:
        raise no_encontrado()
