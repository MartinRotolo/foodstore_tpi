import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const MainLayout = () => (
  <div className="min-h-screen bg-orange-50/40">
    <Navbar />
    <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <Outlet />
    </main>
  </div>
)

export default MainLayout
