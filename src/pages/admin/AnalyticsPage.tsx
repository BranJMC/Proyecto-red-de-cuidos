import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { platformSeries, zones } from '../../services/mockData'
import { ChartCard } from '../../components/ui/ChartCard'

export function AnalyticsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <ChartCard title="Earnings analytics" subtitle="Crecimiento de ingresos mensuales de la plataforma.">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={platformSeries}>
              <defs>
                <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="ingresos" stroke="#0891b2" fill="url(#income)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <h3 className="font-display text-2xl text-slate-950 dark:text-white">Heat map of active zones</h3>
        <div className="mt-6 space-y-3">
          {zones.map((zone) => (
            <div key={zone.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">{zone.neighborhood}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{zone.city}</p>
                </div>
                <div className="w-32 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${Math.min(zone.activeCaregivers * 2.2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
