import { Link } from "react-router-dom"
import Card from "@/shared/ui/Card"

const UnauthorizedPage = () => (
  <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
    <h1 className="text-2xl font-semibold text-slate-800">Acceso denegado</h1>
    <p className="text-slate-600">Tu usuario no tiene permisos para ver esta página.</p>
    <Link to="/" className="font-semibold text-brand hover:underline">
      Volver al inicio
    </Link>
  </Card>
)

export default UnauthorizedPage
