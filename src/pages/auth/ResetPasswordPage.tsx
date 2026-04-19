import { Button } from '../../components/ui/Button'

export function ResetPasswordPage() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Nueva contrasena</h1>
      <div className="mt-8 grid gap-4">
        <input className="field" placeholder="Nueva contrasena" type="password" />
        <input className="field" placeholder="Confirmar contrasena" type="password" />
      </div>
      <Button className="mt-6">Guardar contrasena</Button>
    </section>
  )
}
