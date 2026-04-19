import { caregivers, caregiverMetrics, verificationSteps } from '../../services/mockData'
import { ProgressTracker } from '../../components/ui/ProgressTracker'
import { StatCard } from '../../components/ui/StatCard'

export function CaregiverHomePage() {
  const profile = caregivers[2]

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {caregiverMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Resumen</p>
          <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">Tienes 5 nuevas solicitudes y 2 entrevistas verificadas.</h2>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Checklist de verificacion</h3>
          <div className="mt-5 space-y-3">
            {verificationSteps.map((step) => (
              <div key={step.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950 dark:text-white">{step.title}</p>
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{step.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ProgressTracker
          title="Profile completion progress"
          value={84}
          steps={[
            { label: 'Identity verification', status: 'approved' },
            { label: 'Zones configured', status: 'approved' },
            { label: 'Night fees and emergency tariff', status: 'pending' },
            { label: 'Weekend availability', status: 'approved' },
          ]}
        />
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Performance snapshot</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Service zones</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{profile.zones.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Working days</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{profile.workingDays.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Base rate</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">${profile.pricePerHour}/h + extras</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Response quality</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">97% within SLA window</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
