import { useMutation } from "@tanstack/react-query"
import { crearPedido } from "../api/pedidos"
import { useInvalidarPedidos } from "./useInvalidarPedidos"

export const useCrearPedido = () => {
  const invalidar = useInvalidarPedidos()
  return useMutation({ mutationFn: crearPedido, onSuccess: invalidar })
}
