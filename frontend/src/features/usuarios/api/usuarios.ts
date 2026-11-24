import { api } from "@/shared/api/axiosInstance"
import type { UserPublic } from "../types/usuario.types"

export const listarUsuarios = async (): Promise<UserPublic[]> =>
  (await api.get<UserPublic[]>("/admin/usuarios")).data

export const activarUsuario = async (id: number): Promise<UserPublic> =>
  (await api.post<UserPublic>(`/admin/usuarios/${id}/activar`)).data

export const desactivarUsuario = async (id: number): Promise<UserPublic> =>
  (await api.post<UserPublic>(`/admin/usuarios/${id}/desactivar`)).data
