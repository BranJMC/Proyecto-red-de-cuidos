import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ChartCard } from '../../components/ui/ChartCard'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { CaregiverEarningsSummary } from '../../types'

const emptySummary: CaregiverEarningsSummary = {
  totalReceived: 0,
  totalProofs: 0,
  todayReceived: 0,
  daily: [],
  payments: [],
}

function isVisualFile(fileUrl?: string, fileName?: string) {
  const target = `${fileUrl ?? ''} ${fileName ?? ''}`.toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp'].some((extension) => target.includes(extension))
}

export function EarningsPage() {
  const [summary, setSummary] = useState<CaregiverEarningsSummary>(emptySummary)
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getCaregiverEarnings(user.id).then(setSummary)
  }, [user.id])

  const reviewedCount = useMemo(
    () => summary.payments.filter((payment) => payment.status === 'Approved' || payment.status === 'Rejected').length,
    [summary.payments],
  )

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Ganancias y comprobantes</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Tus ingresos y la revision de cada pago</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
          Aqui se calcula cuanto vas acumulando con los comprobantes validos y debajo puedes revisar cada comprobante con su foto, cliente y estado de revision por admin e IA.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pagos registrados</p>
          <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">${summary.totalReceived}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Suma de comprobantes que cuentan como ingreso activo.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Comprobantes recibidos</p>
          <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{summary.totalProofs}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Incluye pagos pendientes, aprobados o rechazados.</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Revisados por admin</p>
          <p className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{reviewedCount}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Comprobantes que ya tienen decision visible.</p>
        </div>
      </div>

      <ChartCard title="Ganancias por dia" subtitle="Calculado con base en la entrada diaria de comprobantes validos o en revision activa.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.daily}>
              <defs>
                <linearGradient id="earnings" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="label" stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#0891b2" fill="url(#earnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Comprobantes recibidos</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Puedes revisar quien pago, el codigo escrito en el motivo y si ya fue visto por admin e IA.</p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {summary.payments.length ? summary.payments.map((payment) => (
            <article key={payment.id} className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
              {payment.fileUrl ? (
                isVisualFile(payment.fileUrl, payment.fileName) ? (
                  <img src={payment.fileUrl} alt={payment.fileName ?? payment.clientName} className="h-56 w-full rounded-[22px] object-cover" />
                ) : (
                  <a
                    href={payment.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-56 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white text-sm font-medium text-cyan-700 hover:bg-cyan-50/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-cyan-300"
                  >
                    Abrir archivo del comprobante
                  </a>
                )
              ) : (
                <div className="flex h-56 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400">
                  Sin vista previa
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">{payment.clientName}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{payment.date} | {payment.method}</p>
                  {payment.referenceNumber ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Motivo enviado: {payment.referenceNumber}</p> : null}
                  {payment.expectedReferenceCode ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Codigo esperado: {payment.expectedReferenceCode}</p> : null}
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    ${payment.amount}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                  <p className="font-semibold text-slate-950 dark:text-white">Estado del admin</p>
                  <p className="mt-1">{payment.status ?? 'Pendiente'}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                  <p className="font-semibold text-slate-950 dark:text-white">Estado de IA</p>
                  <p className="mt-1">{payment.aiDecision ?? 'Pendiente'}</p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Revision humana: {payment.reviewedBy ?? 'Pendiente'}</p>
            </article>
          )) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Todavia no hay comprobantes registrados para este cuidador.</p>
          )}
        </div>
      </section>
    </div>
  )
}
