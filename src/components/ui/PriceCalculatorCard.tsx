import { currency } from '../../utils/helpers'

export function PriceCalculatorCard({
  summary,
}: {
  summary: {
    hourlyRate: number
    hours: number
    nightExtra: number
    weekendExtra: number
    emergencyExtra: number
    platformFee: number
    discount: number
    total: number
  }
}) {
  const rows = [
    ['Tarifa base', summary.hourlyRate * summary.hours],
    ['Extra nocturno', summary.nightExtra],
    ['Extra fin de semana', summary.weekendExtra],
    ['Extra emergencia', summary.emergencyExtra],
    ['Fee plataforma', summary.platformFee],
    ['Cupon', -summary.discount],
  ]

  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Estimador</p>
      <h3 className="mt-2 font-display text-3xl text-slate-950 dark:text-white">Resumen de precio</h3>
      <div className="mt-6 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>{label}</span>
            <span>{currency(Number(value))}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-950 dark:text-white">Total estimado</span>
          <span className="font-display text-3xl text-slate-950 dark:text-white">{currency(summary.total)}</span>
        </div>
      </div>
    </aside>
  )
}
