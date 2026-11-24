import { useForm } from "@tanstack/react-form"
import type { Categoria } from "@/features/categorias/types/categoria.types"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import Select from "@/shared/ui/Select"
import { primerError } from "@/shared/utils/formato"
import type { ProductoCreate } from "../types/producto.types"

interface ProductoFormProps {
  valoresIniciales: ProductoCreate
  categorias: Categoria[]
  guardando: boolean
  onGuardar: (datos: ProductoCreate) => void
  onCancelar: () => void
}

const validarNombre = ({ value }: { value: string }) =>
  value.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : undefined

const noNegativo =
  (campo: string) =>
  ({ value }: { value: number }) =>
    Number.isNaN(value) || value < 0 ? `${campo} debe ser un número mayor o igual a 0` : undefined

const validarCategoria = ({ value }: { value: number }) =>
  value > 0 ? undefined : "Elegí una categoría"

const ProductoForm = ({
  valoresIniciales,
  categorias,
  guardando,
  onGuardar,
  onCancelar,
}: ProductoFormProps) => {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      onGuardar({
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        imagen_url: value.imagen_url.trim(),
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
      <form.Field name="categoria_id" validators={{ onChange: validarCategoria }}>
        {(field) => (
          <Select
            label="Categoría"
            name={field.name}
            value={field.state.value || ""}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            onBlur={field.handleBlur}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          >
            <option value="">Elegí una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        )}
      </form.Field>
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="precio_base" validators={{ onChange: noNegativo("El precio") }}>
          {(field) => (
            <Input
              label="Precio"
              type="number"
              min={0}
              step="0.01"
              name={field.name}
              value={Number.isNaN(field.state.value) ? "" : field.state.value}
              onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              onBlur={field.handleBlur}
              error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
            />
          )}
        </form.Field>
        <form.Field name="stock" validators={{ onChange: noNegativo("El stock") }}>
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
      </div>
      <form.Field name="imagen_url">
        {(field) => (
          <Input
            label="URL de la imagen"
            type="url"
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
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

export default ProductoForm
