import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { handleApiError } from "@/shared/api/handleApiError"
import EstadoError from "@/shared/components/EstadoError"
import Button from "@/shared/ui/Button"
import Input from "@/shared/ui/Input"
import { primerError } from "@/shared/utils/formato"
import { useAuthStore } from "@/store/authStore"
import AuthCard from "../components/AuthCard"

interface EstadoNavegacion {
  from?: { pathname: string }
  mensaje?: string
}

const obligatorio =
  (campo: string) =>
  ({ value }: { value: string }) =>
    value.trim() ? undefined : `${campo} es obligatorio`

const LoginPage = () => {
  const usuario = useAuthStore((state) => state.usuario)
  const login = useAuthStore((state) => state.login)
  const location = useLocation()
  const estado = location.state as EstadoNavegacion | null
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await login(value.username.trim(), value.password)
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  if (usuario) return <Navigate to={estado?.from?.pathname ?? "/"} replace />

  return (
    <AuthCard titulo="Iniciar sesión">
      {estado?.mensaje && (
        <p className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">{estado.mensaje}</p>
      )}
      {error && <EstadoError mensaje={error} />}
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="username" validators={{ onChange: obligatorio("El usuario") }}>
          {(field) => (
            <Input
              label="Usuario"
              name={field.name}
              autoComplete="username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
            />
          )}
        </form.Field>
        <form.Field name="password" validators={{ onChange: obligatorio("La contraseña") }}>
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              name={field.name}
              autoComplete="current-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="text-sm text-slate-600">
        ¿No tenés cuenta?{" "}
                <Link
          to="/register"
          state={{ from: estado?.from }}
          className="font-semibold text-brand hover:underline"
        >
          Registrate
        </Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage
