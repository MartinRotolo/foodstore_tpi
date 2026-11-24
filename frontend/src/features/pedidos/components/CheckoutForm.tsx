import { useForm } from "@tanstack/react-form"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import Select from "@/shared/ui/Select"
import { primerError } from "@/shared/utils/formato"
import type { FormaPago } from "../types/pedido.types"

export interface DatosCheckout {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string
}

interface CheckoutFormProps {
  enviando: boolean
  onConfirmar: (datos: DatosCheckout) => void
}

const validarDireccion = ({ value }: { value: string }) => {
  const largo = value.trim().length
  if (largo < 5) return "La dirección debe tener al menos 5 caracteres"
  return largo > 200 ? "La dirección no puede superar los 200 caracteres" : undefined
}

const valoresIniciales: DatosCheckout = { direccion_entrega: "", forma_pago: "EFECTIVO", notas: "" }

const CheckoutForm = ({ enviando, onConfirmar }: CheckoutFormProps) => {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      onConfirmar({
        direccion_entrega: value.direccion_entrega.trim(),
        forma_pago: value.forma_pago,
        notas: value.notas.trim(),
      }),
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
      <form.Field name="direccion_entrega" validators={{ onChange: validarDireccion }}>
        {(field) => (
          <Input
            label="Dirección de entrega"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>
      <form.Field name="forma_pago">
        {(field) => (
          <Select
            label="Forma de pago"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value as FormaPago)}
            onBlur={field.handleBlur}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </Select>
        )}
      </form.Field>
      <form.Field name="notas">
        {(field) => (
          <Input
            label="Notas (opcional)"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || enviando}>
            {enviando ? "Confirmando..." : "Confirmar pedido"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export default CheckoutForm
