import { notifications } from '../../services/mockData'

export function CaregiverNotificationsPage() {
  return (
    <div className="space-y-4">
      {notifications.map((item) => (
        <article key={item.id} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">{item.type}</p>
          <h2 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">{item.title}</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
        </article>
      ))}
    </div>
  )
}
