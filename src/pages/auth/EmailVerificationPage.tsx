import { Button } from '../../components/ui/Button'
import { OtpInput } from '../../components/ui/OtpInput'

export function EmailVerificationPage() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Verifica tu email</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Ingresa el OTP enviado a tu bandeja.</p>
      <div className="mt-8">
        <OtpInput />
      </div>
      <div className="mt-6 flex gap-3">
        <Button>Confirmar codigo</Button>
        <Button variant="secondary">Reenviar</Button>
      </div>
    </section>
  )
}
