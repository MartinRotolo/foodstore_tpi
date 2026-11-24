import { Link, useNavigate } from "react-router-dom"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import EstadoVacio from "@/shared/components/EstadoVacio"
import Card from "@/shared/ui/Card"
import { formatearPrecio } from "@/shared/utils/formato"
import { useCartStore } from "@/store/cartStore"
import CheckoutForm, { type DatosCheckout } from "../components/CheckoutForm"
import { useCrearPedido } from "../hooks/useCrearPedido"

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total())
  const vaciar = useCartStore((state) => state.vaciar)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <EstadoVacio mensaje="No hay productos en el carrito para confirmar.">
        <Link to="/" className="font-semibold text-brand hover:underline">
          Ir al catálogo
        </Link>
      </EstadoVacio>
    )
  }

  const confirmar = (datos: DatosCheckout) =>
    crearPedido.mutate(
      {
        items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega,
        notas: datos.notas || null,
      },
      {
        onSuccess: () => {
          vaciar()
          navigate("/mis-pedidos", { replace: true })
        },
      },
    )

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">Confirmar pedido</h1>
        {crearPedido.isError && <EstadoError mensaje={handleApiError(crearPedido.error)} />}
        <CheckoutForm enviando={crearPedido.isPending} onConfirmar={confirmar} />
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Resumen</h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {items.map((item) => (
            <li key={item.producto_id} className="flex justify-between py-2">
              <span>
                {item.cantidad} × {item.nombre}
              </span>
              <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="text-right text-xl font-bold text-slate-800">
          Total: {formatearPrecio(total)}
        </p>
      </Card>
    </section>
  )
}

export default CheckoutPage
