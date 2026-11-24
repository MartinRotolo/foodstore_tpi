import Card from "@/shared/ui/Card"

interface TarjetaResumenProps {
  titulo: string
  valor: string | number
  color: string
}

const TarjetaResumen = ({ titulo, valor, color }: TarjetaResumenProps) => (
  <Card className={`flex flex-col gap-2 border-l-4 ${color}`}>
    <span className="text-sm font-semibold text-slate-500">{titulo}</span>
    <span className="text-3xl font-bold text-slate-800">{valor}</span>
  </Card>
)

export default TarjetaResumen
