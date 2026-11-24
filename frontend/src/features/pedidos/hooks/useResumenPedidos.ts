import { useQuery } from "@tanstack/react-query"
import { obtenerResumen } from "../api/pedidos"

export const useResumenPedidos = () => useQuery({ queryKey: ["resumen"], queryFn: obtenerResumen })
