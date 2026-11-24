import Button from "@/shared/ui/Button"

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

const EstadoError = ({ mensaje, onReintentar }: EstadoErrorProps) => (
  <div
    role="alert"
    className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-error"
  >
    <p>{mensaje}</p>
    {onReintentar && (
      <Button variante="outline" onClick={onReintentar}>
        Reintentar
      </Button>
    )}
  </div>
)

export default EstadoError
