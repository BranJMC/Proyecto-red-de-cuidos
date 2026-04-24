import { useState } from 'react'
import { complaints } from '../../services/mockData'
import { statusTone } from '../../utils/helpers'

type ReportStatus = 'pendiente' | 'en transito' | 'resuelto'

const initialStatuses: Record<string, ReportStatus> = Object.fromEntries(
  complaints.map((report) => [
    report.id,
    report.status === 'resolved' ? 'resuelto' : report.status === 'investigating' ? 'en transito' : 'pendiente',
  ]),
)

export function ReportsCenterPage() {
  const [statuses, setStatuses] = useState(initialStatuses)

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {complaints.map((report) => {
        const status = statuses[report.id] ?? 'pendiente'

        return (
          <article key={report.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">{report.subject}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {report.type} | categoria {report.category} | urgencia {report.urgency} | prioridad {report.priority}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusTone(status)}`}>{status}</span>
            </div>

            <label className="mt-5 block text-sm text-slate-600 dark:text-slate-300">Estado del reporte</label>
            <select
              className="field mt-2"
              value={status}
              onChange={(event) =>
                setStatuses((current) => ({
                  ...current,
                  [report.id]: event.target.value as ReportStatus,
                }))
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="en transito">En transito</option>
              <option value="resuelto">Resuelto</option>
            </select>
          </article>
        )
      })}
    </div>
  )
}
