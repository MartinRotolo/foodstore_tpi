import { useQueryClient } from "@tanstack/react-query"

export const useInvalidarPedidos = () => {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["pedidos"] })
    queryClient.invalidateQueries({ queryKey: ["productos"] })
    queryClient.invalidateQueries({ queryKey: ["resumen"] })
  }
}
