import { useMutation } from "@tanstack/react-query"
import { cancelarPedido } from "../api/pedidos"
import { useInvalidarPedidos } from "./useInvalidarPedidos"

export const useCancelarPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({ mutationFn: cancelarPedido, onSuccess: invalidar })
}
