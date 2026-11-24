import type { ButtonHTMLAttributes } from "react"

type Variante = "primary" | "secondary" | "outline" | "danger"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
}

const clases: Record<Variante, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-slate-700 text-white hover:bg-slate-800",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
  danger: "bg-error text-white hover:opacity-90",
}

const Button = ({
  variante = "primary",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${clases[variante]} ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default Button
