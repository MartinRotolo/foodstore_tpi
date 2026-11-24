import type { EstadoPedido } from "@/features/pedidos/types/pedido.types"

const estilos: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-slate-200 text-slate-700",
}

const etiquetas: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
}

const BadgeEstado = ({ estado }: { estado: EstadoPedido }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}>
    {etiquetas[estado]}
  </span>
)

export default BadgeEstado
