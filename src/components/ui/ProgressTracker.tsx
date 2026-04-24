import { statusTone } from '../../utils/helpers'

export function ProgressTracker({
  title,
  value,
  steps,
}: {
  title: string
  value: number
  steps: { label: string; status: string }[]
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 font-display text-4xl text-slate-950 dark:text-white">{value}%</p>
        </div>
        <div className="h-14 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${value}%` }} />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
            <span className="text-sm text-slate-600 dark:text-slate-300">{step.label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(step.status)}`}>{step.status}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
