import { useState } from "react"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import EstadoVacio from "@/shared/components/EstadoVacio"
import Paginacion from "@/shared/components/Paginacion"
import Skeleton from "@/shared/components/Skeleton"
import BadgeEstado from "@/shared/ui/BadgeEstado"
import Button from "@/shared/ui/Button"
import Card from "@/shared/ui/Card"
import Modal from "@/shared/ui/Modal"
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato"
import DetallePedido from "../components/DetallePedido"
import { useCancelarPedido } from "../hooks/useCancelarPedido"
import { usePedidos } from "../hooks/usePedidos"
import type { Pedido } from "../types/pedido.types"

const POR_PAGINA = 5

const MisPedidosPage = () => {
  const [pagina, setPagina] = useState(0)
  const [detalleId, setDetalleId] = useState<number | null>(null)
  const { data, isPending, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
  })
  const cancelar = useCancelarPedido()

  const confirmarCancelacion = (pedido: Pedido) => {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) cancelar.mutate(pedido.id)
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-800">Mis pedidos</h1>
      {cancelar.isError && <EstadoError mensaje={handleApiError(cancelar.error)} />}
      {isPending ? (
        <Skeleton cantidad={3} className="h-24" />
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EstadoVacio mensaje="Todavía no hiciste pedidos." />
      ) : (
        data.items.map((pedido) => (
          <Card key={pedido.id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-800">Pedido #{pedido.id}</span>
                <BadgeEstado estado={pedido.estado} />
              </div>
              <span className="text-sm text-slate-500">
                {formatearFecha(pedido.created_at)} · {pedido.items.length} producto(s)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-slate-800">
                {formatearPrecio(pedido.total)}
              </span>
              <Button variante="outline" onClick={() => setDetalleId(pedido.id)}>
                Ver detalle
              </Button>
              {pedido.estado === "PENDIENTE" && (
                <Button
                  variante="danger"
                  disabled={cancelar.isPending}
                  onClick={() => confirmarCancelacion(pedido)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
      <Paginacion
        pagina={pagina}
        totalPaginas={data ? Math.ceil(data.total / POR_PAGINA) : 0}
        onCambiar={setPagina}
      />
      <Modal
        abierto={detalleId !== null}
        titulo={`Pedido #${detalleId ?? ""}`}
        onClose={() => setDetalleId(null)}
      >
        {detalleId !== null && <DetallePedido pedidoId={detalleId} />}
      </Modal>
    </section>
  )
}

export default MisPedidosPage
