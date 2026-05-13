import { useEffect, useMemo, useState } from 'react'
import { StatCard } from '../../components/ui/StatCard'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Caregiver, DashboardMetric } from '../../types'

export function CaregiverHomePage() {
  const [profile, setProfile] = useState<Caregiver | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [reminders, setReminders] = useState<{ id: string; date: string; time: string; service: string; client: string }[]>([])
  const [verificationSteps, setVerificationSteps] = useState<{ title: string; status: string }[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getCaregiverProfileById(user.id).then(setProfile)
    mockApi.getCaregiverMetrics().then(setMetrics)
    mockApi.getCaregiverReminders(user.id).then(setReminders)
    mockApi.getVerificationStepsByCaregiver(user.id).then((steps) =>
      setVerificationSteps(steps.map((step) => ({ title: step.title, status: step.status }))),
    )
  }, [user.id])

  const summaryText = useMemo(() => {
    if (!profile) {
      return 'Cargando tu informacion profesional.'
    }

    const specialtyLabel = profile.specialty ? profile.specialty.toLowerCase() : 'servicios de cuidado'
    return `${profile.serviceCount ?? 0} servicios registrados, rango ${profile.rank ?? 'activo'} y especialidad principal en ${specialtyLabel}.`
  }, [profile])

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
          <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">
            {profile ? `Tu perfil profesional de ${profile.rank} sigue activo.` : 'Estamos preparando tu panel profesional.'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">{summaryText}</p>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Checklist de verificacion</h3>
          <div className="mt-5 space-y-3">
            {verificationSteps.length ? verificationSteps.map((step) => (
              <div key={step.title} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{step.title}</p>
                <p className="text-sm text-slate-500 capitalize dark:text-slate-400">{step.status}</p>
              </div>
            )) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                Todavia no hay pasos de verificacion registrados.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Perfil y recorrido</p>
          <h3 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">{profile?.rank ?? 'Sin rango'}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{profile?.serviceCount ?? 0} servicios registrados</p>
          <div className="mt-6 rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {profile
                ? `Cobras $${profile.pricePerHour ?? 0} por hora y atiendes principalmente en ${profile.city ?? 'tu zona registrada'}, ${profile.province ?? 'Costa Rica'}.`
                : 'Cuando tu perfil termine de cargar, aqui veras tu posicion profesional.'}
            </p>
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Recordatorios de proximos servicios</h3>
          <div className="mt-5 space-y-3">
            {reminders.length ? reminders.map((reminder) => (
              <div key={reminder.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{reminder.service}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{reminder.date} | {reminder.time} | {reminder.client}</p>
              </div>
            )) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                No tienes recordatorios de servicios por ahora.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
