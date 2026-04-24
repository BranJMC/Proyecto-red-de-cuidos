import { paymentProofs } from '../../services/mockData'
import { currency, statusTone } from '../../utils/helpers'
import { Button } from '../../components/ui/Button'

export function PaymentProofsPage() {
  return (
    <div className="space-y-4">
      {paymentProofs.map((proof) => (
        <article key={proof.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">Comprobante {proof.bookingId}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(proof.status)}`}>{proof.status}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(proof.aiDecision)}`}>
                  AI: {proof.aiDecision}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {proof.payer} • {proof.uploadedAt} • {currency(proof.amount)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button>Aprobar</Button>
              <Button variant="secondary">Escalar a manual</Button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Lectura AI</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Confianza {Math.round(proof.aiConfidence * 100)}%
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Anomalia</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{proof.anomaly}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Revision humana</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{proof.reviewedBy}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
