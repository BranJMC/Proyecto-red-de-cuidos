import type { CalendarDayStatus } from '../../types'

const stateStyles: Record<CalendarDayStatus['state'], string> = {
  booked: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/20',
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20',
  off: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-white/10',
}

function buildMonthGrid(days: CalendarDayStatus[]) {
  const byDay = new Map(days.map((day) => [day.day, day]))
  const firstDate = new Date(days[0]?.date ?? '2026-04-01')
  const year = firstDate.getFullYear()
  const month = firstDate.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const totalDays = new Date(year, month + 1, 0).getDate()

  const cells: Array<CalendarDayStatus | null> = Array.from({ length: firstWeekday }, () => null)
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(
      byDay.get(day) ?? {
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        day,
        state: 'available',
      },
    )
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }
  return cells
}

export function MonthAvailabilityCalendar({
  title,
  days,
  onSelect,
}: {
  title: string
  days: CalendarDayStatus[]
  onSelect?: (day: CalendarDayStatus) => void
}) {
  const monthCells = buildMonthGrid(days)

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
      <div className="mb-5">
        <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Verde disponible, rojo reservado, gris fuera de jornada.
        </p>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {monthCells.map((day, index) =>
          day ? (
            <button
              key={day.date}
              onClick={() => onSelect?.(day)}
              className={`group relative min-h-18 rounded-[16px] border p-2 text-left transition hover:-translate-y-0.5 ${stateStyles[day.state]}`}
            >
              <p className="text-xs font-semibold">{day.day}</p>
              <p className="mt-1 text-[10px] leading-4">{day.serviceType ?? (day.state === 'available' ? 'Libre' : 'No labora')}</p>
              <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-44 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-3 text-left shadow-2xl shadow-slate-200/60 group-hover:block dark:border-white/10 dark:bg-slate-950/95 dark:shadow-none">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">{day.date}</p>
                <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">
                  {day.serviceType ?? (day.state === 'available' ? 'Disponible para reservar' : 'Fuera de jornada')}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {day.timeRange ?? (day.state === 'available' ? 'Selecciona este día para abrir la reserva' : 'Sin horario activo')}
                </p>
              </div>
            </button>
          ) : (
            <div key={`empty-${index}`} className="min-h-18 rounded-[16px] border border-dashed border-slate-200/70 bg-transparent dark:border-white/5" />
          ),
        )}
      </div>
    </section>
  )
}
