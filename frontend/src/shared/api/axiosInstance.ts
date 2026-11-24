import axios, { type AxiosError } from "axios"
import { useAuthStore } from "@/store/authStore"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
})

const CUENTA_DESACTIVADA = "Cuenta de usuario desactivada"

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    const url = error.config?.url ?? ""
    const estado = error.response?.status
    const esLoginOPerfil = url.includes("/auth/token") || url.includes("/auth/me")
    const cuentaDesactivada =
      estado === 400 &&
      error.response?.data?.detail === CUENTA_DESACTIVADA &&
      !url.includes("/auth/token")

    if ((estado === 401 && !esLoginOPerfil) || cuentaDesactivada) {
      useAuthStore.getState().limpiarSesion()
    }
    return Promise.reject(error)
  },
)
