import type { ReactNode } from "react"
import Card from "@/shared/ui/Card"

interface AuthCardProps {
  titulo: string
  children: ReactNode
}

const AuthCard = ({ titulo, children }: AuthCardProps) => (
  <div className="flex justify-center">
    <Card className="flex w-full max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-800">{titulo}</h1>
      {children}
    </Card>
  </div>
)

export default AuthCard
