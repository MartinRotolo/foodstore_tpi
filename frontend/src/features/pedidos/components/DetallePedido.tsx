import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import BadgeEstado from "@/shared/ui/BadgeEstado"
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato"
import { usePedido } from "../hooks/usePedidos"

const formasDePago = { EFECTIVO: "Efectivo", TRANSFERENCIA: "Transferencia" }

const DetallePedido = ({ pedidoId }: { pedidoId: number }) => {
  const { data: pedido, isPending, error } = usePedido(pedidoId)

  if (isPending) return <Skeleton cantidad={3} className="h-10" />
  if (error) return <EstadoError mensaje={handleApiError(error)} />

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-700">
      <div className="flex items-center justify-between">
        <span>{formatearFecha(pedido.created_at)}</span>
        <BadgeEstado estado={pedido.estado} />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-semibold">Dirección</dt>
        <dd>{pedido.direccion_entrega}</dd>
        <dt className="font-semibold">Forma de pago</dt>
        <dd>{formasDePago[pedido.forma_pago]}</dd>
        {pedido.notas && (
          <>
            <dt className="font-semibold">Notas</dt>
            <dd>{pedido.notas}</dd>
          </>
        )}
      </dl>
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="py-2">Producto</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pedido.items.map((item) => (
            <tr key={item.producto_id}>
              <td className="py-2">{item.nombre_producto}</td>
              <td className="py-2 text-right">{item.cantidad}</td>
              <td className="py-2 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-2 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-right text-lg font-bold text-slate-800">
        Total: {formatearPrecio(pedido.total)}
      </p>
    </div>
  )
}

export default DetallePedido
