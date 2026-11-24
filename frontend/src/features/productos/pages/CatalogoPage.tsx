import { useState, type FormEvent } from "react"
import { useCategorias } from "@/features/categorias/hooks/useCategorias"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import EstadoVacio from "@/shared/components/EstadoVacio"
import Paginacion from "@/shared/components/Paginacion"
import Skeleton from "@/shared/components/Skeleton"
import Button from "@/shared/ui/Button"
import ProductoCard from "../components/ProductoCard"
import { useProductos } from "../hooks/useProductos"

const POR_PAGINA = 8

const CatalogoPage = () => {
  const [pagina, setPagina] = useState(0)
  const [texto, setTexto] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)
  const categorias = useCategorias()

  const { data, isPending, isFetching, error, refetch } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  })

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    setPagina(0)
    setBusqueda(texto.trim())
  }

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold text-slate-800">Catálogo</h1>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={buscar} className="flex flex-1 gap-2">
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <Button type="submit">Buscar</Button>
        </form>
        <select
          aria-label="Filtrar por categoría"
          value={categoriaId ?? ""}
          onChange={(e) => {
            setPagina(0)
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined)
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categorias.data?.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton cantidad={POR_PAGINA} className="h-80" />
        </div>
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EstadoVacio mensaje="No hay productos que coincidan con la búsqueda." />
      ) : (
        <div
          className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}
        >
          {data.items.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default CatalogoPage
