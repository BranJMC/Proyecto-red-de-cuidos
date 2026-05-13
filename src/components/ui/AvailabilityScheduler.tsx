import type { CaregiverWorkingHour } from '../../types'

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

export function AvailabilityScheduler({
  workingHours,
  onChange,
}: {
  workingHours: CaregiverWorkingHour[]
  onChange: (workingHours: CaregiverWorkingHour[]) => void
}) {
  const byDay = new Map(workingHours.map((slot) => [slot.dayOfWeek, slot]))

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 className="font-display text-xl text-slate-950 dark:text-white">Working days & hours</h3>
      <div className="mt-5 space-y-3">
        {days.map((day, index) => {
          const slot = byDay.get(index) ?? {
            dayOfWeek: index,
            active: index > 0 && index < 6,
            startTime: '08:00',
            endTime: index === 6 ? '16:00' : '20:00',
          }

          return (
            <div key={day} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:grid-cols-[140px_1fr_1fr] dark:border-white/10 dark:bg-slate-800/60">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-950 dark:text-white">
                <input
                  type="checkbox"
                  className="size-4 accent-cyan-500"
                  checked={slot.active}
                  onChange={(event) =>
                    onChange(
                      days.map((_, dayIndex) =>
                        dayIndex === index
                          ? { ...slot, active: event.target.checked }
                          : byDay.get(dayIndex) ?? {
                              dayOfWeek: dayIndex,
                              active: false,
                              startTime: '08:00',
                              endTime: '20:00',
                            },
                      ),
                    )
                  }
                />
                {day}
              </label>
              <input
                className="field"
                value={slot.startTime}
                onChange={(event) =>
                  onChange(
                    days.map((_, dayIndex) =>
                      dayIndex === index
                        ? { ...slot, startTime: event.target.value }
                        : byDay.get(dayIndex) ?? {
                            dayOfWeek: dayIndex,
                            active: false,
                            startTime: '08:00',
                            endTime: '20:00',
                          },
                    ),
                  )
                }
              />
              <input
                className="field"
                value={slot.endTime}
                onChange={(event) =>
                  onChange(
                    days.map((_, dayIndex) =>
                      dayIndex === index
                        ? { ...slot, endTime: event.target.value }
                        : byDay.get(dayIndex) ?? {
                            dayOfWeek: dayIndex,
                            active: false,
                            startTime: '08:00',
                            endTime: '20:00',
                          },
                    ),
                  )
                }
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
