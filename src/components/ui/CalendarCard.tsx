export function CalendarCard({ days }: { days: string[] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
      <h3 className="font-display text-xl text-slate-950 dark:text-white">Disponibilidad</h3>
      <div className="mt-5 space-y-3">
        {days.map((day) => (
          <div
            key={day}
            className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-300"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
