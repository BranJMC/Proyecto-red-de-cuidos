import { complaints } from '../../services/mockData'
import { statusTone } from '../../utils/helpers'

export function ReportsCenterPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {complaints.map((report) => (
        <article key={report.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">{report.subject}</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(report.status)}`}>{report.status}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {report.type} • categoria {report.category} • urgencia {report.urgency} • prioridad {report.priority}
          </p>
        </article>
      ))}
    </div>
  )
}
