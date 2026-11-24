import { useForm } from "@tanstack/react-form"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import { primerError } from "@/shared/utils/formato"
import { useAuthStore } from "@/store/authStore"
import AuthCard from "../components/AuthCard"
import { useRegistro } from "../hooks/useRegistro"
import type { RegisterData } from "../types/auth.types"

const valoresIniciales: RegisterData = { username: "", full_name: "", email: "", password: "" }

const validarUsername = ({ value }: { value: string }) => {
  if (!value.trim()) return "El usuario es obligatorio"
  if (value.trim().length < 3) return "El usuario debe tener al menos 3 caracteres"
  return /\s/.test(value.trim()) ? "El usuario no puede tener espacios" : undefined
}

const validarNombre = ({ value }: { value: string }) =>
  value.trim().length < 2 ? "Ingresá tu nombre y apellido" : undefined

const validarEmail = ({ value }: { value: string }) => {
  if (!value.trim()) return "El email es obligatorio"
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "El email no es válido"
}

const validarPassword = ({ value }: { value: string }) => {
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres"
  return value.length > 72 ? "La contraseña no puede superar los 72 caracteres" : undefined
}

type Validador = (campo: { value: string }) => string | undefined

const campos: { name: keyof RegisterData; label: string; type: string; validar: Validador }[] = [
  { name: "username", label: "Usuario", type: "text", validar: validarUsername },
  { name: "full_name", label: "Nombre y apellido", type: "text", validar: validarNombre },
  { name: "email", label: "Email", type: "email", validar: validarEmail },
  { name: "password", label: "Contraseña", type: "password", validar: validarPassword },
]

const RegisterPage = () => {
  const usuario = useAuthStore((state) => state.usuario)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from
  const registro = useRegistro()

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) =>
      registro.mutate(
        { ...value, username: value.username.trim(), email: value.email.trim() },
        {
          onSuccess: () =>
            navigate("/login", {
              replace: true,
                            state: { mensaje: "La cuenta se creó correctamente. Ya podés iniciar sesión.", from },
            }),
        },
      ),
  })

  if (usuario) return <Navigate to="/" replace />

  return (
    <AuthCard titulo="Crear cuenta">
      {registro.isError && <EstadoError mensaje={handleApiError(registro.error)} />}
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {campos.map((campo) => (
          <form.Field key={campo.name} name={campo.name} validators={{ onChange: campo.validar }}>
            {(field) => (
              <Input
                label={campo.label}
                type={campo.type}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={
                  field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined
                }
              />
            )}
          </form.Field>
        ))}
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" disabled={!canSubmit || registro.isPending}>
              {registro.isPending ? "Registrando..." : "Registrarse"}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
                <Link to="/login" state={{ from }} className="font-semibold text-brand hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </AuthCard>
  )
}

export default RegisterPage
