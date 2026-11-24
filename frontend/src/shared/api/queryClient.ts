import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (intentos, error) => {
        const estado = axios.isAxiosError(error) ? error.response?.status : undefined
        if (estado !== undefined && estado < 500) return false
        return intentos < 2
      },
    },
  },
})
