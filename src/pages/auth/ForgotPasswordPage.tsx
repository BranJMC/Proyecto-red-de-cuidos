import { Button } from '../../components/ui/Button'

export function ForgotPasswordPage() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Recuperar contrasena</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Enviaremos un enlace seguro a tu correo.</p>
      <input className="field mt-8" placeholder="tu@email.com" />
      <Button className="mt-6">Enviar enlace</Button>
    </section>
  )
}
