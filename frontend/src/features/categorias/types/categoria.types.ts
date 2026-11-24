export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  activo: boolean
}

export interface CategoriaCreate {
  nombre: string
  descripcion: string
}

export type CategoriaUpdate = Partial<CategoriaCreate>
