import { NavLink } from 'react-router-dom'
import type { UserRole } from '../../types'
import { dashboardNav } from '../../utils/constants'
import { Logo } from '../branding/Logo'

export function Sidebar({ role }: { role: UserRole }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/60 bg-white/75 px-5 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 lg:block">
      <Logo />
      <nav className="mt-10 space-y-2">
        {dashboardNav[role].map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            <span>{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
