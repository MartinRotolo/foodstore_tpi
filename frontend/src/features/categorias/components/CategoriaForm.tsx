import { useForm } from "@tanstack/react-form"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import { primerError } from "@/shared/utils/formato"
import type { CategoriaCreate } from "../types/categoria.types"

interface CategoriaFormProps {
  valoresIniciales: CategoriaCreate
  guardando: boolean
  onGuardar: (datos: CategoriaCreate) => void
  onCancelar: () => void
}

const validarNombre = ({ value }: { value: string }) => {
  const largo = value.trim().length
  if (largo < 2) return "El nombre debe tener al menos 2 caracteres"
  return largo > 100 ? "El nombre no puede superar los 100 caracteres" : undefined
}

const CategoriaForm = ({
  valoresIniciales,
  guardando,
  onGuardar,
  onCancelar,
}: CategoriaFormProps) => {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() }),
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
      <form.Field name="nombre" validators={{ onChange: validarNombre }}>
        {(field) => (
          <Input
            label="Nombre"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>
      <form.Field name="descripcion">
        {(field) => (
          <Input
            label="Descripción"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
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

export default CategoriaForm
