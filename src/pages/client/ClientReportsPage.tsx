import { Button } from '../../components/ui/Button'

export function ClientReportsPage() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="font-display text-3xl text-slate-950 dark:text-white">Reportes directos al administrador</h2>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Si hubo un problema con el cuidador, la plataforma o el pago, repórtalo desde aquí.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <select className="field">
          <option>Categoria del reporte</option>
          <option>Cuidador</option>
          <option>Plataforma</option>
          <option>Pago</option>
        </select>
        <select className="field">
          <option>Urgencia</option>
          <option>Urgente</option>
          <option>Aviso</option>
          <option>Otro</option>
        </select>
        <input className="field sm:col-span-2" placeholder="Asunto del reporte" />
        <textarea className="field min-h-40 sm:col-span-2" placeholder="Describe lo ocurrido con el mayor detalle posible" />
      </div>
      <Button className="mt-6">Enviar reporte</Button>
    </section>
  )
}
