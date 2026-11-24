import { api } from "@/shared/api/axiosInstance"
import type { Categoria, CategoriaCreate, CategoriaUpdate } from "../types/categoria.types"

export const listarCategorias = async (): Promise<Categoria[]> =>
  (await api.get<Categoria[]>("/categorias")).data

export const crearCategoria = async (datos: CategoriaCreate): Promise<Categoria> =>
  (await api.post<Categoria>("/categorias", datos)).data

export const actualizarCategoria = async ({
  id,
  datos,
}: {
  id: number
  datos: CategoriaUpdate
}): Promise<Categoria> => (await api.put<Categoria>(`/categorias/${id}`, datos)).data

export const eliminarCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}
