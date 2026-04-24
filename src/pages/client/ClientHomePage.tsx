import { BellRing, Heart, History, SearchCheck, Siren, Undo2 } from 'lucide-react'
import { clientMetrics, notifications, savedSearches } from '../../services/mockData'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { StatCard } from '../../components/ui/StatCard'

export function ClientHomePage() {
  const quickPanels = [
    { icon: BellRing, title: 'Pending requests', copy: '2 reservas esperando comprobante o confirmacion' },
    { icon: History, title: 'Payment history', copy: '3 pagos completados este mes' },
    { icon: Undo2, title: 'Repeat flow', copy: 'Duplica la ultima reserva con un clic' },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {clientMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Actividad de hoy</p>
          <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">Tu proxima reserva inicia en 1h 20m.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            Valeria llegara a las 14:00. Ya confirmo llegada, ruta y checklist de cuidado.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/client/booking">
              <Button>Reservar servicio</Button>
            </Link>
            <Link to="/client/booking">
              <Button>Repeat last booking</Button>
            </Link>
            <Link to="/search">
              <Button variant="secondary">
                <Siren className="mr-2 size-4" />
                Emergency quick hire
              </Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Centro de notificaciones</h3>
          <div className="mt-5 space-y-3">
            {notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-3">
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <SearchCheck className="size-5 text-cyan-500" />
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">Saved searches</h3>
          </div>
          <div className="mt-5 space-y-3">
            {savedSearches.map((search) => (
              <div key={search.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{search.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{search.matches} matches hoy</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <Heart className="size-5 text-cyan-500" />
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">Favorite caregivers</h3>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">Valeria Rojas sigue siendo tu match mas recurrente, con 6 reservas completadas y respuesta promedio de 5 minutos.</p>
        </article>
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="grid gap-3">
            {quickPanels.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-cyan-500" />
                  <p className="font-medium text-slate-950 dark:text-white">{title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
