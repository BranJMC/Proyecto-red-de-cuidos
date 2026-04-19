import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { earningsSeries } from '../../services/mockData'
import { ChartCard } from '../../components/ui/ChartCard'

export function EarningsPage() {
  return (
    <ChartCard title="Ganancias" subtitle="Vista lista para enlazar payout status, fee breakdown y exportes.">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={earningsSeries}>
            <defs>
              <linearGradient id="earnings" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="name" stroke="#64748b" />
            <Tooltip />
            <Area type="monotone" dataKey="ingresos" stroke="#0891b2" fill="url(#earnings)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
