import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'
import { PublicFooter } from '../components/navigation/PublicFooter'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff,_#eef4ff_48%,_#f8fafc)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_#020617,_#0f172a_48%,_#111827)]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
