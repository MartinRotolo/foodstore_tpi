import { createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import TablaDatos from "@/shared/components/TablaDatos"
import BadgeEstado from "@/shared/ui/BadgeEstado"
import Button from "@/shared/ui/Button"
import Modal from "@/shared/ui/Modal"
import { formatearFecha, formatearPrecio } from "@/shared/utils/formato"
import DetallePedido from "../components/DetallePedido"
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido"
import { usePedidos } from "../hooks/usePedidos"
import type { EstadoPedido, Pedido } from "../types/pedido.types"

const columnHelper = createColumnHelper<Pedido>()

const SIGUIENTE: Partial<Record<EstadoPedido, { estado: EstadoPedido; texto: string }>> = {
  PENDIENTE: { estado: "EN_PREPARACION", texto: "Pasar a preparación" },
  EN_PREPARACION: { estado: "ENTREGADO", texto: "Marcar entregado" },
}

const ESTADOS: { valor: EstadoPedido; texto: string }[] = [
  { valor: "PENDIENTE", texto: "Pendiente" },
  { valor: "EN_PREPARACION", texto: "En preparación" },
  { valor: "ENTREGADO", texto: "Entregado" },
  { valor: "CANCELADO", texto: "Cancelado" },
]

const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined)
  const [detalleId, setDetalleId] = useState<number | null>(null)
  const { data, isPending, error, refetch } = usePedidos({ skip: 0, limit: 100, estado })
  const cambiarEstado = useCambiarEstadoPedido()

  const cancelar = (pedido: Pedido) => {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}? El stock se restituye.`)) {
      cambiarEstado.mutate({ id: pedido.id, estado: "CANCELADO" })
    }
  }

  const columnas = [
    columnHelper.accessor("id", { header: "N.º", cell: (info) => `#${info.getValue()}` }),
    columnHelper.accessor("usuario_id", {
      header: "Cliente",
      cell: (info) => `Usuario ${info.getValue()}`,
    }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: (info) => formatearFecha(info.getValue()),
    }),
    columnHelper.accessor("total", {
      header: "Total",
      cell: (info) => formatearPrecio(info.getValue()),
    }),
    columnHelper.accessor("estado", {
      header: "Estado",
      cell: (info) => <BadgeEstado estado={info.getValue()} />,
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const pedido = row.original
        const siguiente = SIGUIENTE[pedido.estado]
        return (
          <div className="flex flex-wrap gap-2">
            <Button variante="outline" onClick={() => setDetalleId(pedido.id)}>
              Detalle
            </Button>
            {siguiente && (
              <Button
                disabled={cambiarEstado.isPending}
                onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: siguiente.estado })}
              >
                {siguiente.texto}
              </Button>
            )}
            {siguiente && (
              <Button
                variante="danger"
                disabled={cambiarEstado.isPending}
                onClick={() => cancelar(pedido)}
              >
                Cancelar
              </Button>
            )}
          </div>
        )
      },
    }),
  ]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-800">Pedidos</h1>
        <select
          aria-label="Filtrar por estado"
          value={estado ?? ""}
          onChange={(e) => setEstado(ESTADOS.find((o) => o.valor === e.target.value)?.valor)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      </div>
      {cambiarEstado.isError && <EstadoError mensaje={handleApiError(cambiarEstado.error)} />}
      {isPending ? (
        <Skeleton cantidad={5} className="h-12" />
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : (
        <TablaDatos datos={data.items} columnas={columnas} conBuscador={false} />
      )}
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

export default AdminPedidosPage
