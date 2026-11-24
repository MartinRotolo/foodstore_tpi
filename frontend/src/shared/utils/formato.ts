const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })
const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" })

export const formatearPrecio = (valor: number): string => moneda.format(valor)

export const formatearFecha = (valor: string): string => fecha.format(new Date(valor))

export const primerError = (errores: ReadonlyArray<unknown>): string | undefined => {
  const error = errores.find((e) => typeof e === "string")
  return typeof error === "string" ? error : undefined
}
