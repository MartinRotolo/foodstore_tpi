import axios from "axios"

interface ErrorDeValidacion {
  msg: string
}

export const handleApiError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return "Ocurrió un error inesperado."
  if (!error.response) return "No se pudo conectar con el servidor."

  const detail = (error.response.data as { detail?: unknown } | undefined)?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    return (detail as ErrorDeValidacion[]).map((item) => item.msg).join(". ")
  }

  switch (error.response.status) {
    case 401:
      return "Tu sesión venció. Volvé a iniciar sesión."
    case 403:
      return "No tenés permisos para realizar esta acción."
    case 404:
      return "El recurso solicitado no existe."
    default:
      return "Ocurrió un error en el servidor."
  }
}
