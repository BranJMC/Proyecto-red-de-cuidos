import { Button } from '../../components/ui/Button'

export function ClientSettingsPage() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="font-display text-3xl text-slate-950 dark:text-white">Perfil y ajustes</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder="Nombre completo" defaultValue="Ana Gutierrez" />
        <input className="field" placeholder="Email" defaultValue="ana@familia.com" />
        <input className="field" placeholder="Telefono" defaultValue="+506 8888-9999" />
        <input className="field" placeholder="Ciudad" defaultValue="San Jose" />
      </div>
      <Button className="mt-6">Guardar cambios</Button>
    </section>
  )
}
