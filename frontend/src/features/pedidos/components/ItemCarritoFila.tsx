import Button from "@/shared/ui/Button"
import { formatearPrecio } from "@/shared/utils/formato"
import { useCartStore, type ItemCarrito } from "@/store/cartStore"

const ItemCarritoFila = ({ item }: { item: ItemCarrito }) => {
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const quitar = useCartStore((state) => state.quitar)

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{item.nombre}</p>
        <p className="text-sm text-slate-500">{formatearPrecio(item.precio_unitario)} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variante="outline"
          aria-label={`Restar una unidad de ${item.nombre}`}
          disabled={item.cantidad <= 1}
          onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
        >
          −
        </Button>
        <span className="w-8 text-center font-semibold">{item.cantidad}</span>
        <Button
          variante="outline"
          aria-label={`Sumar una unidad de ${item.nombre}`}
          onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
        >
          +
        </Button>
      </div>
      <span className="w-28 text-right font-semibold text-slate-800">
        {formatearPrecio(item.precio_unitario * item.cantidad)}
      </span>
      <Button variante="danger" onClick={() => quitar(item.producto_id)}>
        Quitar
      </Button>
    </li>
  )
}

export default ItemCarritoFila
