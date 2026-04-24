import type { DashboardMetric } from '../../types'

const accentMap = {
  emerald: 'from-emerald-400/20 to-emerald-500/0 text-emerald-700 dark:text-emerald-300',
  sky: 'from-sky-400/20 to-sky-500/0 text-sky-700 dark:text-sky-300',
  amber: 'from-amber-300/25 to-amber-500/0 text-amber-700 dark:text-amber-300',
  rose: 'from-rose-300/20 to-rose-500/0 text-rose-700 dark:text-rose-300',
}

export function StatCard({ label, value, change, accent }: DashboardMetric) {
  return (
    <article className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
      <div className={`mb-4 inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold ${accentMap[accent]}`}>
        {change}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-display text-4xl text-slate-950 dark:text-white">{value}</p>
    </article>
  )
}
