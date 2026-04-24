import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import type { UserRole } from '../../types'
import { dashboardNav } from '../../utils/constants'
import { Logo } from '../branding/Logo'

export function Sidebar({ role }: { role: UserRole }) {
  return (
    <aside className="sidebar-scrollbar fixed inset-y-0 left-0 z-30 hidden w-72 shrink-0 overflow-y-auto border-r border-white/60 bg-white/80 px-5 py-6 shadow-[18px_0_45px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[18px_0_45px_rgba(0,0,0,0.22)] lg:block">
      <Logo />
      <nav className="mt-10 space-y-2">
        {dashboardNav[role].map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `group relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-3 text-sm transition duration-200 ${
                isActive
                  ? 'text-white shadow-lg shadow-slate-950/15 dark:text-slate-950 dark:shadow-cyan-400/10'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.span
                    layoutId={`sidebar-active-${role}`}
                    className="absolute inset-0 rounded-2xl bg-slate-950 dark:bg-cyan-400"
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                  />
                ) : null}
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                  {item.label}
                </span>
                {item.badge ? (
                  <span
                    className={`relative z-10 rounded-full px-2 py-1 text-[10px] font-semibold transition ${
                      isActive
                        ? 'bg-white/15 dark:bg-slate-950/10'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
