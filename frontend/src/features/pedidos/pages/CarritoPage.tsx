import { Link, useNavigate } from "react-router-dom"
import EstadoVacio from "@/shared/components/EstadoVacio"
import Button from "@/shared/ui/Button"
import Card from "@/shared/ui/Card"
import { formatearPrecio } from "@/shared/utils/formato"
import { useCartStore } from "@/store/cartStore"
import ItemCarritoFila from "../components/ItemCarritoFila"

const CarritoPage = () => {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total())
  const vaciar = useCartStore((state) => state.vaciar)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <EstadoVacio mensaje="Tu carrito está vacío.">
        <Link to="/" className="font-semibold text-brand hover:underline">
          Ir al catálogo
        </Link>
      </EstadoVacio>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-800">Carrito</h1>
      <Card>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <ItemCarritoFila key={item.producto_id} item={item} />
          ))}
        </ul>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variante="outline" onClick={vaciar}>
          Vaciar carrito
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-slate-800">Total: {formatearPrecio(total)}</span>
          <Button onClick={() => navigate("/checkout")}>Continuar con el pedido</Button>
        </div>
      </div>
    </section>
  )
}

export default CarritoPage
