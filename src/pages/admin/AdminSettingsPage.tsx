import { Button } from '../../components/ui/Button'

export function AdminSettingsPage() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="font-display text-3xl text-slate-950 dark:text-white">Configuracion de plataforma</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input className="field" defaultValue="SLA verificacion: 6h" />
        <input className="field" defaultValue="Soporte premium activo" />
        <input className="field" defaultValue="Webhook pagos pendiente" />
        <input className="field" defaultValue="Push notifications enabled" />
      </div>
      <Button className="mt-6">Guardar cambios</Button>
    </section>
  )
}
