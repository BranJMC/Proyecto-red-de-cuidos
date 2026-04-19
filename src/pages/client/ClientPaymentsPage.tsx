import { CreditCard, Wallet } from 'lucide-react'
import { paymentHistory } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { ReceiptUploader } from '../../components/ui/ReceiptUploader'
import { DataTable } from '../../components/ui/DataTable'
import { currency, statusTone } from '../../utils/helpers'

export function ClientPaymentsPage() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          <Wallet className="size-6 text-cyan-500" />
          <h2 className="font-display text-3xl text-slate-950 dark:text-white">Metodo principal</h2>
        </div>
        <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white dark:bg-slate-900">
          <p className="text-sm text-white/60">Visa ending 1428</p>
          <p className="mt-8 font-display text-4xl">**** **** **** 1428</p>
          <div className="mt-6 flex items-center justify-between text-sm text-white/60">
            <span>Exp 09/29</span>
            <span>Ana Gutierrez</span>
          </div>
        </div>
        <Button className="mt-6">Agregar metodo</Button>
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          <CreditCard className="size-6 text-cyan-500" />
          <h2 className="font-display text-3xl text-slate-950 dark:text-white">Estado de pagos</h2>
        </div>
        <div className="mt-6 grid gap-4">
          {[
            ['Autorizacion 3DS ready', 'Checkout preparado para integracion'],
            ['Wallet & cards', 'Visa, Mastercard y transferencias'],
            ['Recibos exportables', 'Factura y comprobante posteriores'],
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
      <ReceiptUploader />
    </div>
  )
}
