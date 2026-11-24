export type Rol = "user" | "admin"

export interface UsuarioSesion {
  id: number
  username: string
  full_name: string
  email: string
  role: Rol
}

export interface UserPublic extends UsuarioSesion {
  disabled: boolean
  created_at: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  full_name: string
  email: string
  password: string
}

export interface MensajeRespuesta {
  message: string
}
