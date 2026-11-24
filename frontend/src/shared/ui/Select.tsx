import type { SelectHTMLAttributes } from "react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

const Select = ({ label, error, children, ...props }: SelectProps) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
    {label}
    <select
      className={`rounded-lg border bg-white px-3 py-2 font-normal focus:border-brand focus:outline-none ${error ? "border-error" : "border-slate-300"}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs font-normal text-error">{error}</span>}
  </label>
)

export default Select
