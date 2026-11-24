import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import Button from "@/shared/ui/Button"

const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `font-semibold hover:text-white ${isActive ? "text-white" : "text-orange-100"}`

const Navbar = () => {
  const usuario = useAuthStore((state) => state.usuario)
  const logout = useAuthStore((state) => state.logout)
  const cantidadEnCarrito = useCartStore((state) =>
    state.items.reduce((suma, item) => suma + item.cantidad, 0),
  )
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <nav className="bg-brand shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-white">
          Food Store
        </Link>
        <div className="flex flex-wrap items-center gap-5">
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            Carrito ({cantidadEnCarrito})
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === "admin" && (
            <NavLink to="/admin" className={claseEnlace}>
              Panel admin
            </NavLink>
          )}
          {usuario ? (
            <>
              <div className="text-right text-sm text-white">
                <p className="font-semibold">{usuario.full_name}</p>
                <p className="text-orange-100">Rol: {usuario.role}</p>
              </div>
              <Button variante="outline" onClick={cerrarSesion}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/register" className={claseEnlace}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
