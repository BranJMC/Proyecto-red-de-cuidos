import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { NotificationBell } from '../components/ui/NotificationBell'
import { Sidebar } from '../components/navigation/Sidebar'
import { ThemeToggle } from '../components/navigation/ThemeToggle'
import { dashboardNav } from '../utils/constants'
import type { UserRole } from '../types'
import { MobileMenu } from '../components/navigation/MobileMenu'
import { useAppStore } from '../store/useAppStore'

export function DashboardLayout({ role }: { role: UserRole }) {
  const user = useAppStore((state) => state.user)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(239,246,255,0.96))] dark:bg-[linear-gradient(180deg,_#020617,_#0f172a_42%,_#111827)]">
      <Sidebar role={role} />
      <div className="min-w-0 flex-1 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 px-4 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MobileMenu items={dashboardNav[role]} />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hola</p>
                <h1 className="font-display text-xl text-slate-950 dark:text-white">{user.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </header>
        <main className="overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
