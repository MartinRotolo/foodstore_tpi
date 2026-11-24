import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = ({ label, error, className = "", ...props }: InputProps) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
    {label}
    <input
      className={`rounded-lg border px-3 py-2 font-normal focus:border-brand focus:outline-none ${error ? "border-error" : "border-slate-300"} ${className}`}
      {...props}
    />
    {error && <span className="text-xs font-normal text-error">{error}</span>}
  </label>
)

export default Input
