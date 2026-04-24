import { useMemo } from 'react'
import { caregivers, caregiverMetrics, caregiverUpcomingReminders } from '../../services/mockData'
import { StatCard } from '../../components/ui/StatCard'

export function CaregiverHomePage() {
  const profile = caregivers[2]

  const timeRemaining = useMemo(() => {
    const endHour = 18
    const endMinute = 0
    const now = new Date()
    const end = new Date()
    end.setHours(endHour, endMinute, 0, 0)
    const diff = Math.max(end.getTime() - now.getTime(), 0)
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }, [])

  const metrics = caregiverMetrics.map((metric) =>
    metric.label === 'Service rank'
      ? { ...metric, value: profile.rank, change: `${profile.serviceCount} servicios completados` }
      : metric.label === 'Jobs completed'
        ? { ...metric, value: String(profile.serviceCount), change: '+4 esta semana' }
        : metric,
  )

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Resumen</p>
          <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">Tienes 5 nuevas solicitudes y rango {profile.rank} activo.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Tu récord de servicios aumenta cuando marcas tu salida. Mientras más servicios completos tengas, más visible y recomendable se vuelve tu perfil.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Checklist de verificacion</h3>
          <div className="mt-5 space-y-3">
            {[
              'Cedula aprobada',
              'Foto facial validada',
              'Curriculum recibido',
              'Hoja de vida en revisión',
            ].map((step) => (
              <div key={step} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Rango y servicios</p>
          <h3 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{profile.rank}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{profile.serviceCount} servicios registrados</p>
          <div className="mt-6 rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Te faltan 12 servicios más para llegar a Platinum y ganar más prioridad en resultados.
            </p>
          </div>
        </article>
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Recordatorios de próximos servicios</h3>
          <div className="mt-5 space-y-3">
            {caregiverUpcomingReminders.map((reminder) => (
              <div key={reminder.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{reminder.service}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{reminder.date} • {reminder.time} • {reminder.client}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Servicio en curso</p>
        <h3 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">Tiempo restante: {timeRemaining}</h3>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Contador estimado según la hora de entrada registrada y la duración del servicio contratado.
        </p>
      </section>
    </div>
  )
}
