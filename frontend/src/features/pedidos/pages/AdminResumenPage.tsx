import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import { formatearPrecio } from "@/shared/utils/formato"
import TarjetaResumen from "../components/TarjetaResumen"
import { useResumenPedidos } from "../hooks/useResumenPedidos"

const AdminResumenPage = () => {
  const { data, isPending, error, refetch } = useResumenPedidos()

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-800">Resumen del negocio</h1>
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton cantidad={6} className="h-28" />
        </div>
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} color="border-brand" />
          <TarjetaResumen titulo="Pendientes" valor={data.pendientes} color="border-amber-400" />
          <TarjetaResumen
            titulo="En preparación"
            valor={data.en_preparacion}
            color="border-blue-500"
          />
          <TarjetaResumen titulo="Entregados" valor={data.entregados} color="border-green-500" />
          <TarjetaResumen titulo="Cancelados" valor={data.cancelados} color="border-slate-400" />
          <TarjetaResumen
            titulo="Ingresos de pedidos entregados"
            valor={formatearPrecio(data.ingresos_entregados)}
            color="border-emerald-600"
          />
        </div>
      )}
    </section>
  )
}

export default AdminResumenPage
