import { FileCheck2, ShieldCheck } from 'lucide-react'
import { paymentHistory } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { DataTable } from '../../components/ui/DataTable'
import { currency, statusTone } from '../../utils/helpers'

export function ClientPaymentsPage() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <FileCheck2 className="size-6 text-cyan-500" />
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Comprobante como metodo principal</h2>
          </div>
          <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white dark:bg-slate-900">
            <p className="text-sm text-white/60">Flujo operativo</p>
            <p className="mt-5 font-display text-3xl">Sube el recibo y espera doble validacion.</p>
            <div className="mt-6 grid gap-3 text-sm text-white/75">
              <p>1. El cliente carga el comprobante.</p>
              <p>2. La AI detecta coincidencia, monto y anomalias.</p>
              <p>3. Staff o admin revisan manualmente si hace falta.</p>
            </div>
          </div>
          <Button className="mt-6">Subir nuevo comprobante</Button>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-cyan-500" />
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Revision del pago</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {[
              ['AI verification', 'Lectura OCR, monto esperado y deteccion de anomalias'],
              ['Revision operativa', 'El trabajador puede validar o escalar el recibo'],
              ['Control admin', 'Admin interviene cuando la AI detecta riesgo o incongruencias'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <DataTable
        headers={['Date', 'Caregiver', 'Method', 'Amount', 'Status']}
        rows={paymentHistory.map((payment) => [
          payment.date,
          payment.caregiverName,
          payment.method,
          currency(payment.amount),
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(payment.status)}`}>{payment.status}</span>,
        ])}
      />
    </div>
  )
}
