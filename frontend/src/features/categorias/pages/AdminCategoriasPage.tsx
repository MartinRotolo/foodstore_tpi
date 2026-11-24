import { createColumnHelper } from "@tanstack/react-table"
import { useState } from "react"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import TablaDatos from "@/shared/components/TablaDatos"
import Button from "@/shared/ui/Button"
import Modal from "@/shared/ui/Modal"
import CategoriaForm from "../components/CategoriaForm"
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from "../hooks/useCategorias"
import type { Categoria, CategoriaCreate } from "../types/categoria.types"

const columnHelper = createColumnHelper<Categoria>()

const AdminCategoriasPage = () => {
  const { data, isPending, error, refetch } = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null)

  const mutacion = seleccionada ? actualizar : crear

  const abrir = (categoria: Categoria | null) => {
    crear.reset()
    actualizar.reset()
    setSeleccionada(categoria)
    setModalAbierto(true)
  }

  const cerrar = () => {
    setModalAbierto(false)
    setSeleccionada(null)
  }

  const guardar = (datos: CategoriaCreate) => {
    if (seleccionada) {
      actualizar.mutate({ id: seleccionada.id, datos }, { onSuccess: cerrar })
    } else {
      crear.mutate(datos, { onSuccess: cerrar })
    }
  }

  const confirmarEliminacion = (categoria: Categoria) => {
    if (window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id)
    }
  }

  const columnas = [
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("descripcion", { header: "Descripción" }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="outline" onClick={() => abrir(row.original)}>
            Editar
          </Button>
          <Button variante="danger" onClick={() => confirmarEliminacion(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Categorías</h1>
        <Button onClick={() => abrir(null)}>+ Nueva categoría</Button>
      </div>
      {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error)} />}
      {isPending ? (
        <Skeleton cantidad={4} className="h-12" />
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : (
        <TablaDatos datos={data} columnas={columnas} />
      )}
      <Modal
        abierto={modalAbierto}
        titulo={seleccionada ? "Editar categoría" : "Nueva categoría"}
        onClose={cerrar}
      >
        {mutacion.isError && <EstadoError mensaje={handleApiError(mutacion.error)} />}
        <CategoriaForm
          key={seleccionada?.id ?? "nueva"}
          valoresIniciales={{
            nombre: seleccionada?.nombre ?? "",
            descripcion: seleccionada?.descripcion ?? "",
          }}
          guardando={mutacion.isPending}
          onGuardar={guardar}
          onCancelar={cerrar}
        />
      </Modal>
    </section>
  )
}

export default AdminCategoriasPage
