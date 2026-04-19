import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { adminMetrics, platformSeries, fraudAlerts, supportTickets } from '../../services/mockData'
import { ChartCard } from '../../components/ui/ChartCard'
import { StatCard } from '../../components/ui/StatCard'

export function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Crecimiento de plataforma" subtitle="Clientes, cuidadores y reservas por mes.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="clientes" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="cuidadores" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard title="Volumen de reservas" subtitle="Visibilidad operativa para forecast y staffing.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="reservas" fill="#06b6d4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Fraud alerts center</h3>
          <div className="mt-5 space-y-3">
            {fraudAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{alert.label}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{alert.detail}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Support tickets</h3>
          <div className="mt-5 space-y-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{ticket.topic}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{ticket.requester} • SLA {ticket.sla}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
