import { useForm } from "@tanstack/react-form"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import { primerError } from "@/shared/utils/formato"
import type { ProductoStockUpdate } from "../types/producto.types"

interface StockFormProps {
  valoresIniciales: ProductoStockUpdate
  guardando: boolean
  onGuardar: (datos: ProductoStockUpdate) => void
  onCancelar: () => void
}

const validarStock = ({ value }: { value: number }) =>
  Number.isInteger(value) && value >= 0
    ? undefined
    : "El stock debe ser un entero mayor o igual a 0"

const StockForm = ({ valoresIniciales, guardando, onGuardar, onCancelar }: StockFormProps) => {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onGuardar(value),
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="stock" validators={{ onChange: validarStock }}>
        {(field) => (
          <Input
            label="Stock"
            type="number"
            min={0}
            step="1"
            name={field.name}
            value={Number.isNaN(field.state.value) ? "" : field.state.value}
            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            onBlur={field.handleBlur}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>
      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name={field.name}
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Disponible para la venta
          </label>
        )}
      </form.Field>
      <div className="flex justify-end gap-2">
        <Button variante="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" disabled={!canSubmit || guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}

export default StockForm
