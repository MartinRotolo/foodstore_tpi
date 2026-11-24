import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import * as authApi from "@/features/auth/api/auth"
import type { UserPublic, UsuarioSesion } from "@/features/auth/types/auth.types"
import { queryClient } from "@/shared/api/queryClient"

interface AuthState {
  usuario: UsuarioSesion | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

const aUsuarioSesion = ({ id, username, full_name, email, role }: UserPublic): UsuarioSesion => ({
  id,
  username,
  full_name,
  email,
  role,
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login({ username, password })
        const perfil = await authApi.obtenerPerfil()
        queryClient.clear()
        set({ usuario: aUsuarioSesion(perfil), cargando: false })
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          queryClient.clear()
          set({ usuario: null, cargando: false })
        }
      },

      checkSession: async () => {
        set({ cargando: true })
        try {
          const perfil = await authApi.obtenerPerfil()
          set({ usuario: aUsuarioSesion(perfil), cargando: false })
        } catch {
          set({ usuario: null, cargando: false })
        }
      },

      limpiarSesion: () => set({ usuario: null, cargando: false }),
    }),
    {
      name: "foodstore-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
