import type { ReactNode } from "react"

interface ModalProps {
  abierto: boolean
  titulo: string
  onClose: () => void
  children: ReactNode
}

const Modal = ({ abierto, titulo, onClose, children }: ModalProps) => {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">{titulo}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md px-2 text-xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
