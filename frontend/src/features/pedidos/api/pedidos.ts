import { api } from "@/shared/api/axiosInstance"
import type {
  EstadoPedido,
  FiltrosPedidos,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "../types/pedido.types"

export const listarPedidos = async (filtros: FiltrosPedidos): Promise<PedidosPaginados> =>
  (await api.get<PedidosPaginados>("/pedidos", { params: filtros })).data

export const obtenerPedido = async (id: number): Promise<Pedido> =>
  (await api.get<Pedido>(`/pedidos/${id}`)).data

export const crearPedido = async (datos: PedidoCreate): Promise<Pedido> =>
  (await api.post<Pedido>("/pedidos", datos)).data

export const cambiarEstadoPedido = async ({
  id,
  estado,
}: {
  id: number
  estado: EstadoPedido
}): Promise<Pedido> => (await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })).data

export const cancelarPedido = async (id: number): Promise<Pedido> =>
  (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data

export const obtenerResumen = async (): Promise<ResumenPedidos> =>
  (await api.get<ResumenPedidos>("/pedidos/resumen")).data
