import { api } from "@/shared/api/axiosInstance"
import type {
  FiltrosProductos,
  Producto,
  ProductoCreate,
  ProductoStockUpdate,
  ProductosPaginados,
  ProductoUpdate,
} from "../types/producto.types"

export const listarProductos = async (filtros: FiltrosProductos): Promise<ProductosPaginados> =>
  (await api.get<ProductosPaginados>("/productos", { params: filtros })).data

export const crearProducto = async (datos: ProductoCreate): Promise<Producto> =>
  (await api.post<Producto>("/productos", datos)).data

export const actualizarProducto = async ({
  id,
  datos,
}: {
  id: number
  datos: ProductoUpdate
}): Promise<Producto> => (await api.put<Producto>(`/productos/${id}`, datos)).data

export const actualizarStock = async ({
  id,
  datos,
}: {
  id: number
  datos: ProductoStockUpdate
}): Promise<Producto> => (await api.patch<Producto>(`/productos/${id}/stock`, datos)).data

export const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
