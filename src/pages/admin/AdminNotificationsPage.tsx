import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { NotificationItem } from '../../types'

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getNotificationsByUser(user.id).then(setNotifications)
  }, [user.id])

  async function handleDelete(notificationId: string) {
    if (!user.id) {
      return
    }

    await mockApi.deleteNotification(notificationId, user.id)
    setNotifications((current) => current.filter((item) => item.id !== notificationId))
  }

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <article key={item.id} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">{item.type}</p>
              <h2 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
            <Button variant="secondary" onClick={() => handleDelete(item.id)}>
              <Trash2 className="mr-2 size-4" />
              Borrar
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
