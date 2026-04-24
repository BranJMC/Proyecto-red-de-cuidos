import { Button } from '../../components/ui/Button'

export function SupportPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Support</p>
        <h1 className="mt-4 font-display text-5xl text-slate-950 dark:text-white">Habla con operaciones de cuidado.</h1>
        <p className="mt-4 text-base leading-8 text-slate-500 dark:text-slate-400">Soporte para familias, cuidadores, pagos, comprobantes y trust & safety.</p>
      </div>
      <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 dark:border-white/10 dark:bg-slate-900/75">
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="field" placeholder="Nombre" />
          <input className="field" placeholder="Email" />
          <input className="field sm:col-span-2" placeholder="Asunto" />
          <textarea className="field min-h-40 sm:col-span-2" placeholder="Describe el problema o solicitud" />
        </div>
        <Button className="mt-6">Enviar ticket</Button>
      </div>
    </section>
  )
}
