import { LogOut, Settings, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getSettingsPath(role: UserRole) {
  if (role === 'caregiver') {
    return '/caregiver/settings'
  }

  if (role === 'admin') {
    return '/admin/settings'
  }

  return '/client/settings'
}

export function UserMenu() {
  const navigate = useNavigate()
  const clearSession = useAppStore((state) => state.clearSession)
  const user = useAppStore((state) => state.user)
  const [open, setOpen] = useState(false)

  const settingsPath = useMemo(() => getSettingsPath(user.role), [user.role])

  function handleLogout() {
    clearSession()
    setOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-left shadow-sm transition hover:border-cyan-400 dark:border-white/10 dark:bg-slate-900/80"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">
          {user.avatar ? <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover" /> : initials(user.name || 'Perfil')}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-medium text-slate-950 dark:text-white">{user.name || 'Mi perfil'}</span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{user.email || 'Cuenta activa'}</span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-40 w-72 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-2xl dark:border-white/10 dark:bg-slate-950/95">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-900/70">
            <p className="text-sm font-medium text-slate-950 dark:text-white">{user.name}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">{user.title || user.role}</p>
          </div>

          <div className="mt-3 grid gap-2">
            <Link
              to={settingsPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Settings className="size-4" />
              Configuraciones
            </Link>
            <Link
              to={settingsPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <UserRound className="size-4" />
              Informacion de la cuenta
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-400/10"
            >
              <LogOut className="size-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

