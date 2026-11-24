import { createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"
import { useCategorias } from "@/features/categorias/hooks/useCategorias"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import TablaDatos from "@/shared/components/TablaDatos"
import Button from "@/shared/ui/Button"
import Modal from "@/shared/ui/Modal"
import { formatearPrecio } from "@/shared/utils/formato"
import ProductoForm from "../components/ProductoForm"
import StockForm from "../components/StockForm"
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from "../hooks/useProductos"
import type { Producto, ProductoCreate, ProductoStockUpdate } from "../types/producto.types"

const columnHelper = createColumnHelper<Producto>()

type Modo = "crear" | "editar" | "stock" | null

const productoNuevo: ProductoCreate = {
  nombre: "",
  descripcion: "",
  precio_base: 0,
  imagen_url: "",
  stock: 0,
  disponible: true,
  categoria_id: 0,
}

const aFormulario = (producto: Producto): ProductoCreate => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio_base: producto.precio_base,
  imagen_url: producto.imagen_url,
  stock: producto.stock,
  disponible: producto.disponible,
  categoria_id: producto.categoria_id,
})

const AdminProductosPage = () => {
  const { data, isPending, error, refetch } = useProductos({ skip: 0, limit: 100 })
  const categorias = useCategorias()
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const cambiarStock = useActualizarStock()
  const eliminar = useEliminarProducto()
  const [modo, setModo] = useState<Modo>(null)
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null)

  const abrir = (nuevoModo: Modo, producto: Producto | null) => {
    crear.reset()
    actualizar.reset()
    cambiarStock.reset()
    setSeleccionado(producto)
    setModo(nuevoModo)
  }

  const cerrar = () => {
    setModo(null)
    setSeleccionado(null)
  }

  const guardarProducto = (datos: ProductoCreate) => {
    if (seleccionado) {
      actualizar.mutate({ id: seleccionado.id, datos }, { onSuccess: cerrar })
    } else {
      crear.mutate(datos, { onSuccess: cerrar })
    }
  }

  const guardarStock = (datos: ProductoStockUpdate) => {
    if (seleccionado) cambiarStock.mutate({ id: seleccionado.id, datos }, { onSuccess: cerrar })
  }

  const confirmarEliminacion = (producto: Producto) => {
    if (window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id)
    }
  }

  const columnas = [
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor((producto) => producto.categoria.nombre, {
      id: "categoria",
      header: "Categoría",
    }),
    columnHelper.accessor("precio_base", {
      header: "Precio",
      cell: (info) => formatearPrecio(info.getValue()),
    }),
    columnHelper.accessor("stock", { header: "Stock" }),
    columnHelper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => (info.getValue() ? "Sí" : "No"),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="outline" onClick={() => abrir("editar", row.original)}>
            Editar
          </Button>
          <Button variante="secondary" onClick={() => abrir("stock", row.original)}>
            Stock
          </Button>
          <Button variante="danger" onClick={() => confirmarEliminacion(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ]

  const errorModal =
    modo === "stock" ? cambiarStock.error : modo === "editar" ? actualizar.error : crear.error

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Productos</h1>
        <Button onClick={() => abrir("crear", null)}>+ Nuevo producto</Button>
      </div>
      {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error)} />}
      {isPending ? (
        <Skeleton cantidad={5} className="h-12" />
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : (
        <TablaDatos datos={data.items} columnas={columnas} />
      )}

      <Modal
        abierto={modo === "crear" || modo === "editar"}
        titulo={modo === "editar" ? "Editar producto" : "Nuevo producto"}
        onClose={cerrar}
      >
        {errorModal && <EstadoError mensaje={handleApiError(errorModal)} />}
        <ProductoForm
          key={seleccionado?.id ?? "nuevo"}
          valoresIniciales={seleccionado ? aFormulario(seleccionado) : productoNuevo}
          categorias={categorias.data ?? []}
          guardando={crear.isPending || actualizar.isPending}
          onGuardar={guardarProducto}
          onCancelar={cerrar}
        />
      </Modal>

      <Modal
        abierto={modo === "stock"}
        titulo={`Stock de ${seleccionado?.nombre ?? ""}`}
        onClose={cerrar}
      >
        {errorModal && <EstadoError mensaje={handleApiError(errorModal)} />}
        {seleccionado && (
          <StockForm
            key={seleccionado.id}
            valoresIniciales={{ stock: seleccionado.stock, disponible: seleccionado.disponible }}
            guardando={cambiarStock.isPending}
            onGuardar={guardarStock}
            onCancelar={cerrar}
          />
        )}
      </Modal>
    </section>
  )
}

export default AdminProductosPage
