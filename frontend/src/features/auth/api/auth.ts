import { api } from "@/shared/api/axiosInstance"
import type { LoginData, MensajeRespuesta, RegisterData, UserPublic } from "../types/auth.types"

export const login = async ({ username, password }: LoginData): Promise<MensajeRespuesta> =>
  (await api.post<MensajeRespuesta>("/auth/token", new URLSearchParams({ username, password })))
    .data

export const logout = async (): Promise<MensajeRespuesta> =>
  (await api.post<MensajeRespuesta>("/auth/logout")).data

export const obtenerPerfil = async (): Promise<UserPublic> =>
  (await api.get<UserPublic>("/auth/me")).data

export const registrar = async (datos: RegisterData): Promise<UserPublic> =>
  (await api.post<UserPublic>("/auth/register", datos)).data
