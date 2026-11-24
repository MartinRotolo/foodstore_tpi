import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { activarUsuario, desactivarUsuario, listarUsuarios } from "../api/usuarios"

export const useUsuarios = () => useQuery({ queryKey: ["usuarios"], queryFn: listarUsuarios })

const useInvalidarUsuarios = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ["usuarios"] })
}

export const useActivarUsuario = () => {
  const invalidar = useInvalidarUsuarios()
  return useMutation({ mutationFn: activarUsuario, onSuccess: invalidar })
}

export const useDesactivarUsuario = () => {
  const invalidar = useInvalidarUsuarios()
  return useMutation({ mutationFn: desactivarUsuario, onSuccess: invalidar })
}
