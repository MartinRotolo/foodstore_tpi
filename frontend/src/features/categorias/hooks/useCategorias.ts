import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../api/categorias"

export const useCategorias = () => useQuery({ queryKey: ["categorias"], queryFn: listarCategorias })

const useInvalidarCatalogo = () => {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["categorias"] })
    queryClient.invalidateQueries({ queryKey: ["productos"] })
  }
}

export const useCrearCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({ mutationFn: crearCategoria, onSuccess: invalidar })
}

export const useActualizarCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({ mutationFn: actualizarCategoria, onSuccess: invalidar })
}

export const useEliminarCategoria = () => {
  const invalidar = useInvalidarCatalogo()
  return useMutation({ mutationFn: eliminarCategoria, onSuccess: invalidar })
}
