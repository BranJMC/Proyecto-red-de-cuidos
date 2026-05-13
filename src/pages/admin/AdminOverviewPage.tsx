import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../../components/ui/ChartCard'
import { StatCard } from '../../components/ui/StatCard'
import { mockApi } from '../../services/api'
import type { DashboardMetric } from '../../types'

export function AdminOverviewPage() {
  const [adminMetrics, setAdminMetrics] = useState<DashboardMetric[]>([])
  const [platformSeries, setPlatformSeries] = useState<Record<string, number | string>[]>([])

  useEffect(() => {
    mockApi.getAdminMetrics().then(setAdminMetrics)
    mockApi.getPlatformSeries().then(setPlatformSeries)
  }, [])

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Crecimiento de la plataforma" subtitle="Vista general del comportamiento de clientes, reservas y pagos a lo largo del tiempo.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={platformSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="payments" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Volumen de reservas" subtitle="Cantidad de reservas registradas por periodo para el seguimiento administrativo.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="label" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="bookings" fill="#06b6d4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>
    </div>
  )
}
