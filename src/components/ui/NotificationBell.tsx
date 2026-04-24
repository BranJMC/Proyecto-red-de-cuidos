import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export function NotificationBell() {
  const unread = useAppStore((state) => state.notifications.filter((item) => !item.read).length)
  const role = useAppStore((state) => state.user.role)
  const markNotificationsRead = useAppStore((state) => state.markNotificationsRead)
  const navigate = useNavigate()

  return (
    <button
      className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-cyan-200 hover:text-slate-950 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:border-cyan-400/40"
      aria-label="Ir a notificaciones"
      onClick={() => {
        markNotificationsRead()
        navigate(`/${role}/notifications`)
      }}
    >
      <Bell className="size-5" />
      {unread ? (
        <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
          {unread}
        </span>
      ) : null}
    </button>
  )
}
