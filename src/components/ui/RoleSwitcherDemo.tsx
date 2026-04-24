import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'
import { demoUsers } from '../../utils/constants'

const destinations: Record<UserRole, string> = {
  client: '/client/home',
  caregiver: '/caregiver/home',
  admin: '/admin/overview',
}

export function RoleSwitcherDemo() {
  const navigate = useNavigate()
  const role = useAppStore((state) => state.user.role)
  const demoMode = useAppStore((state) => state.demoMode)
  const enterDemo = useAppStore((state) => state.enterDemo)

  if (!demoMode) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[22px] border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-slate-900/70">
      {(['client', 'caregiver', 'admin'] as UserRole[]).map((item) => (
        <button
          key={item}
          onClick={() => {
            enterDemo(item)
            navigate(destinations[item])
          }}
          className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            role === item
              ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {demoUsers[item].role}
        </button>
      ))}
    </div>
  )
}
