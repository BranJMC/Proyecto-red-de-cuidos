import { Button } from '../../components/ui/Button'
import { OtpInput } from '../../components/ui/OtpInput'

export function SmsVerificationPage() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Verifica tu telefono</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Usa el codigo SMS de seis digitos.</p>
      <div className="mt-8">
        <OtpInput />
      </div>
      <div className="mt-6 flex gap-3">
        <Button>Validar SMS</Button>
        <Button variant="secondary">Reenviar codigo</Button>
      </div>
    </section>
  )
}
