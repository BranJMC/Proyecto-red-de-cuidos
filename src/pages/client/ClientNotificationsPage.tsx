import { useEffect, useState } from 'react'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { NotificationItem } from '../../types'

export function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const user = useAppStore((state) => state.user)
  const setStoreNotifications = useAppStore((state) => state.setNotifications)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getNotificationsByUser(user.id).then((items) => {
      setNotifications(items)
      setStoreNotifications(items)
    })
    mockApi.markNotificationsRead(user.id)
  }, [setStoreNotifications, user.id])

  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <article key={item.id} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {item.time}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}
