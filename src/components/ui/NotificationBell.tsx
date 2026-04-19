import { Bell } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function NotificationBell() {
  const unread = useAppStore((state) => state.notifications.filter((item) => !item.read).length)

  return (
    <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-white">
      <Bell className="size-5" />
      {unread ? (
        <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
          {unread}
        </span>
      ) : null}
    </button>
  )
}
