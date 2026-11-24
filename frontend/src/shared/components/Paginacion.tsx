import Button from "@/shared/ui/Button"

interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

const Paginacion = ({ pagina, totalPaginas, onCambiar }: PaginacionProps) => {
  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-slate-600">
      <Button variante="outline" disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </Button>
      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button
        variante="outline"
        disabled={pagina + 1 >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
      >
        Siguiente
      </Button>
    </div>
  )
}

export default Paginacion
