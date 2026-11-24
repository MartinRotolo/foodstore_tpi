import { NavLink, Outlet } from "react-router-dom"

const secciones = [
  { ruta: "/admin/resumen", nombre: "Resumen" },
  { ruta: "/admin/pedidos", nombre: "Pedidos" },
  { ruta: "/admin/productos", nombre: "Productos" },
  { ruta: "/admin/categorias", nombre: "Categorías" },
  { ruta: "/admin/usuarios", nombre: "Usuarios" },
]

const AdminLayout = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
      {secciones.map((seccion) => (
        <NavLink
          key={seccion.ruta}
          to={seccion.ruta}
          className={({ isActive }) =>
            `rounded-lg px-4 py-2 text-sm font-semibold ${isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-200"}`
          }
        >
          {seccion.nombre}
        </NavLink>
      ))}
    </div>
    <Outlet />
  </div>
)

export default AdminLayout
