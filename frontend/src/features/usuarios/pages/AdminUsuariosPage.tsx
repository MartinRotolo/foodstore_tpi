import { createColumnHelper } from "@tanstack/react-table"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Skeleton from "@/shared/components/Skeleton"
import TablaDatos from "@/shared/components/TablaDatos"
import Button from "@/shared/ui/Button"
import { useAuthStore } from "@/store/authStore"
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from "../hooks/useUsuarios"
import type { UserPublic } from "../types/usuario.types"

const columnHelper = createColumnHelper<UserPublic>()

const AdminUsuariosPage = () => {
  const usuarioActualId = useAuthStore((state) => state.usuario?.id)
  const { data, isPending, error, refetch } = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()
  const procesando = activar.isPending || desactivar.isPending
  const errorAccion = activar.error ?? desactivar.error

  const columnas = [
    columnHelper.accessor("username", { header: "Usuario" }),
    columnHelper.accessor("full_name", { header: "Nombre" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("role", { header: "Rol" }),
    columnHelper.accessor("disabled", {
      header: "Estado",
      cell: (info) =>
        info.getValue() ? (
          <span className="font-semibold text-error">Desactivado</span>
        ) : (
          <span className="font-semibold text-green-700">Activo</span>
        ),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original
        if (usuario.disabled) {
          return (
            <Button disabled={procesando} onClick={() => activar.mutate(usuario.id)}>
              Activar
            </Button>
          )
        }
        if (usuario.id === usuarioActualId) return null
        return (
          <Button
            variante="danger"
            disabled={procesando}
            onClick={() => desactivar.mutate(usuario.id)}
          >
            Desactivar
          </Button>
        )
      },
    }),
  ]

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
      {errorAccion && <EstadoError mensaje={handleApiError(errorAccion)} />}
      {isPending ? (
        <Skeleton cantidad={4} className="h-12" />
      ) : error ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => refetch()} />
      ) : (
        <TablaDatos datos={data} columnas={columnas} />
      )}
    </section>
  )
}

export default AdminUsuariosPage
