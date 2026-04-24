import { fraudAlerts } from '../../services/mockData'
import { statusTone } from '../../utils/helpers'

export function FraudAlertsPage() {
  return (
    <div className="space-y-4">
      {fraudAlerts.map((alert) => (
        <article key={alert.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">{alert.label}</h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(alert.risk)}`}>{alert.risk}</span>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{alert.location}</p>
        </article>
      ))}
    </div>
  )
}
