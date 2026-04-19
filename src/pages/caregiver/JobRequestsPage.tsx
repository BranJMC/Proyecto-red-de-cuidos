import { Button } from '../../components/ui/Button'

export function JobRequestsPage() {
  const jobs = [
    ['Familia Gutierrez', 'Cuidado infantil nocturno', 'Hoy 14:00', 'Urgente'],
    ['Residencial Roble', 'Acompanamiento adulto mayor', 'Miercoles 08:00', 'Nuevo'],
    ['Empresa Vida Sana', 'Cobertura corporativa', 'Viernes 09:00', 'Premium'],
  ]

  return (
    <div className="space-y-4">
      {jobs.map(([client, service, time, tag]) => (
        <article key={client + service} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-950 dark:text-white">{client}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{service} • {time}</p>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              {tag}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Aceptar</Button>
            <Button variant="secondary">Rechazar</Button>
          </div>
        </article>
      ))}
    </div>
  )
}
