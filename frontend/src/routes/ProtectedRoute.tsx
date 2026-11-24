import { Navigate, Outlet, useLocation } from "react-router-dom"
import type { Rol } from "@/features/auth/types/auth.types"
import Skeleton from "@/shared/components/Skeleton"
import { useAuthStore } from "@/store/authStore"

interface ProtectedRouteProps {
  allowedRoles?: Rol[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const usuario = useAuthStore((state) => state.usuario)
  const cargando = useAuthStore((state) => state.cargando)
  const location = useLocation()

  if (cargando) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-slate-600">Verificando sesión…</p>
        <Skeleton cantidad={3} />
      </div>
    )
  }

  if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
