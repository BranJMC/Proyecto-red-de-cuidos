import type { ReactNode } from 'react'
import type { CalendarDayStatus } from '../../types'

const stateStyles: Record<CalendarDayStatus['state'], string> = {
  booked: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/20',
  available: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/20',
  pending: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20',
  mixed: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/20',
  full: 'bg-rose-200 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/30',
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
  selectedDate,
  selectOnHover = false,
  children,
}: {
  title: string
  days: CalendarDayStatus[]
  onSelect?: (day: CalendarDayStatus) => void
  selectedDate?: string
  selectOnHover?: boolean
  children?: ReactNode
}) {
  const monthCells = buildMonthGrid(days)

  return (
    <section className="overflow-visible rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/30 sm:p-6 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
      <div className="mb-5">
        <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Verde disponible, amarillo pendiente, naranja mixto, rojo reservado o lleno, gris fuera de jornada.
        </p>
      </div>

      <div className={children ? 'grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]' : ''}>
        <div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase tracking-[0.14em] text-slate-400 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthCells.map((day, index) =>
              day ? (
                <button
                  key={day.date}
                  onClick={() => onSelect?.(day)}
                  onMouseEnter={() => {
                    if (selectOnHover) {
                      onSelect?.(day)
                    }
                  }}
                  title={day.alert}
                  className={`group relative min-h-[92px] rounded-[16px] border p-2 text-left transition hover:z-50 hover:-translate-y-0.5 sm:min-h-[108px] sm:rounded-[18px] sm:p-3 ${
                    selectedDate === day.date ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg shadow-cyan-200/50 dark:shadow-none' : ''
                  } ${stateStyles[day.state]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold sm:text-sm">{day.day}</p>
                    {day.reservationCount ? (
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-950/60 dark:text-slate-100">
                        {day.reservationCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 sm:mt-2 sm:text-[11px]">
                    {day.serviceType ?? (day.state === 'available' ? 'Libre' : 'No labora')}
                  </p>
                  {day.summary ? <p className="mt-1 line-clamp-2 text-[9px] leading-4 opacity-80 sm:text-[10px]">{day.summary}</p> : null}
                  <div className="pointer-events-none absolute left-1/2 top-full z-[80] hidden w-44 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-3 text-left shadow-2xl shadow-slate-200/60 xl:group-hover:block dark:border-white/10 dark:bg-slate-950/95 dark:shadow-none">
                    <p className="text-xs uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">{day.date}</p>
                    <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">
                      {day.serviceType ?? (day.state === 'available' ? 'Disponible para reservar' : 'Fuera de jornada')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {day.timeRange ?? (day.state === 'available' ? 'Selecciona este dia para abrir la reserva' : 'Sin horario activo')}
                    </p>
                    {day.alert ? <p className="mt-2 text-xs text-amber-600 dark:text-amber-300">{day.alert}</p> : null}
                  </div>
                </button>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="min-h-[92px] rounded-[16px] border border-dashed border-slate-200/70 bg-transparent sm:min-h-[108px] dark:border-white/5"
                />
              ),
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}
