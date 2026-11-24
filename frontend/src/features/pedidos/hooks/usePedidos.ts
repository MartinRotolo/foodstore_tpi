import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listarPedidos, obtenerPedido } from "../api/pedidos"
import type { FiltrosPedidos } from "../types/pedido.types"

export const usePedidos = (filtros: FiltrosPedidos) =>
  useQuery({
    queryKey: ["pedidos", filtros],
    queryFn: () => listarPedidos(filtros),
    placeholderData: keepPreviousData,
  })

export const usePedido = (id: number | null) =>
  useQuery({
    queryKey: ["pedidos", "detalle", id],
    queryFn: () => obtenerPedido(id ?? 0),
    enabled: id !== null,
  })
