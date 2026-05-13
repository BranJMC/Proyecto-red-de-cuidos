import { useEffect, useState } from 'react'
import { mockApi } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import type { Complaint } from '../../types'
import { statusTone } from '../../utils/helpers'

type ReportStatus = 'pendiente' | 'en transito' | 'resuelto'

export function ReportsCenterPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [statuses, setStatuses] = useState<Record<string, ReportStatus>>({})
  const toast = useToast()

  useEffect(() => {
    mockApi.getReports().then((items) => {
      setComplaints(items)
      setStatuses(
        Object.fromEntries(
          items.map((report) => [
            report.id,
            report.status === 'resolved' ? 'resuelto' : report.status === 'investigating' ? 'en transito' : 'pendiente',
          ]),
        ),
      )
    })
  }, [])

  async function handleStatusChange(reportId: string, nextStatus: ReportStatus) {
    setStatuses((current) => ({ ...current, [reportId]: nextStatus }))
    await mockApi.updateReportStatus(reportId, nextStatus)
    toast.success('Reporte actualizado', 'El nuevo estado ya quedo persistido.')
  }

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
              onChange={(event) => handleStatusChange(report.id, event.target.value as ReportStatus)}
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
