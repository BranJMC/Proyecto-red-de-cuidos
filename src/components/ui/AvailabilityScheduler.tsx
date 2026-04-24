const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

export function AvailabilityScheduler() {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 className="font-display text-xl text-slate-950 dark:text-white">Working days & hours</h3>
      <div className="mt-5 space-y-3">
        {days.map((day, index) => (
          <div key={day} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:grid-cols-[140px_1fr_1fr] dark:border-white/10 dark:bg-slate-800/60">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-950 dark:text-white">
              <input type="checkbox" className="size-4 accent-cyan-500" defaultChecked={index < 6} />
              {day}
            </label>
            <input className="field" defaultValue="08:00" />
            <input className="field" defaultValue={day === 'Sabado' ? '16:00' : '20:00'} />
          </div>
        ))}
      </div>
    </section>
  )
}
