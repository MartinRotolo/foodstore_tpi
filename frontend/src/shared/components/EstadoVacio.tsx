import type { ReactNode } from "react"

interface EstadoVacioProps {
  mensaje: string
  children?: ReactNode
}

const EstadoVacio = ({ mensaje, children }: EstadoVacioProps) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
    <p>{mensaje}</p>
    {children}
  </div>
)

export default EstadoVacio
