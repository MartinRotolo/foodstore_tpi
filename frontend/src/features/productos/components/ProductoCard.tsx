import { useState } from "react"
import Button from "@/shared/ui/Button"
import { formatearPrecio } from "@/shared/utils/formato"
import { useCartStore } from "@/store/cartStore"
import type { Producto } from "../types/producto.types"

const ProductoCard = ({ producto }: { producto: Producto }) => {
  const agregar = useCartStore((state) => state.agregar)
  const enCarrito = useCartStore(
    (state) => state.items.find((item) => item.producto_id === producto.id)?.cantidad ?? 0,
  )
  const [imagenRota, setImagenRota] = useState(false)

  const sinStock = producto.stock === 0
  const puedeAgregar = producto.disponible && enCarrito < producto.stock

  return (
    <article className="flex flex-col gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-orange-100 px-4 text-center text-lg font-semibold text-brand">
          {producto.nombre}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5">
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {producto.categoria.nombre}
        </span>
        <h2 className="text-lg font-semibold text-slate-800">{producto.nombre}</h2>
        <p className="flex-1 text-sm text-slate-600">{producto.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-800">
            {formatearPrecio(producto.precio_base)}
          </span>
          <span className={`text-xs ${sinStock ? "text-error" : "text-slate-500"}`}>
            {!producto.disponible
              ? "No disponible"
              : sinStock
                ? "Sin stock"
                : `Stock: ${producto.stock}`}
          </span>
        </div>
        <Button
          disabled={!puedeAgregar}
          onClick={() =>
            agregar({
              producto_id: producto.id,
              nombre: producto.nombre,
              precio_unitario: producto.precio_base,
            })
          }
        >
          {enCarrito > 0 ? `Agregar al carrito (${enCarrito})` : "Agregar al carrito"}
        </Button>
      </div>
    </article>
  )
}

export default ProductoCard
