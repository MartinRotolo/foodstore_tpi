import { useMutation } from "@tanstack/react-query"
import { cambiarEstadoPedido } from "../api/pedidos"
import { useInvalidarPedidos } from "./useInvalidarPedidos"

export const useCambiarEstadoPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({ mutationFn: cambiarEstadoPedido, onSuccess: invalidar })
}
