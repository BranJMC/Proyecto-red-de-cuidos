import { useEffect, useMemo, useState } from 'react'
import { Eye, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import type { PaymentProof } from '../../types'
import { aiDecisionLabel, currency, paymentProofStatusLabel, statusTone } from '../../utils/helpers'

function isImageProof(proof: PaymentProof) {
  const target = `${proof.fileUrl ?? ''} ${proof.fileName ?? ''}`.toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp'].some((extension) => target.includes(extension))
}

export function PaymentProofsPage() {
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([])
  const [selectedProofId, setSelectedProofId] = useState<string>('')
  const [busyDecision, setBusyDecision] = useState<'approve' | 'reject' | 'manual' | ''>('')
  const toast = useToast()

  useEffect(() => {
    mockApi.getPaymentProofs().then((items) => {
      setPaymentProofs(items)
      setSelectedProofId((current) => current || items[0]?.id || '')
    })
  }, [])

  const selectedProof = useMemo(
    () => paymentProofs.find((item) => item.id === selectedProofId) ?? paymentProofs[0] ?? null,
    [paymentProofs, selectedProofId],
  )

  async function refreshProofs() {
    const items = await mockApi.getPaymentProofs()
    setPaymentProofs(items)
    setSelectedProofId((current) => items.find((item) => item.id === current)?.id ?? items[0]?.id ?? '')
  }

  async function decide(proofId: string, decision: 'approve' | 'reject' | 'manual') {
    setBusyDecision(decision)
    try {
      await mockApi.decidePaymentProof(proofId, decision)
      await refreshProofs()
      toast.success('Comprobante actualizado', 'La decision ya se guardo en la base.')
    } catch {
      toast.error('No se pudo actualizar', 'La decision del comprobante no pudo guardarse.')
    } finally {
      setBusyDecision('')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Comprobantes</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Revision visual de comprobantes de pago</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
          El admin puede abrir cada comprobante dentro de la plataforma, ver el archivo completo, comparar monto, motivo y codigo de reserva, y decidir si se aprueba, se rechaza o se escala.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/75">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Eye className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Cola de revision</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{paymentProofs.length} comprobantes disponibles</p>
            </div>
          </div>

          <div className="max-h-[42rem] space-y-3 overflow-y-auto pr-1">
            {paymentProofs.map((proof) => (
              <button
                key={proof.id}
                type="button"
                onClick={() => setSelectedProofId(proof.id)}
                className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${
                  selectedProof?.id === proof.id
                    ? 'border-cyan-400 bg-cyan-50/80 dark:border-cyan-300 dark:bg-cyan-400/10'
                    : 'border-slate-200 bg-slate-50/90 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/55'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">{proof.payer}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Reserva {proof.bookingId} | {currency(proof.amount)}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                      Codigo: {proof.expectedReferenceCode ?? 'Sin codigo'}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(proof.status)}`}>{paymentProofStatusLabel(proof.status)}</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        {selectedProof ? (
          <article className="rounded-[32px] border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/75">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-3xl text-slate-950 dark:text-white">Comprobante {selectedProof.bookingId}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(selectedProof.status)}`}>{paymentProofStatusLabel(selectedProof.status)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(selectedProof.aiDecision)}`}>
                    IA: {aiDecisionLabel(selectedProof.aiDecision)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {selectedProof.payer} | {selectedProof.uploadedAt} | {currency(selectedProof.amount)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => decide(selectedProof.id, 'approve')} disabled={busyDecision !== ''}>
                  {busyDecision === 'approve' ? 'Aprobando...' : 'Aprobar'}
                </Button>
                <Button variant="secondary" onClick={() => decide(selectedProof.id, 'manual')} disabled={busyDecision !== ''}>
                  {busyDecision === 'manual' ? 'Escalando...' : 'Escalar a manual'}
                </Button>
                <Button variant="secondary" onClick={() => decide(selectedProof.id, 'reject')} disabled={busyDecision !== ''}>
                  {busyDecision === 'reject' ? 'Rechazando...' : 'Rechazar'}
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                {selectedProof.fileUrl ? (
                  isImageProof(selectedProof) ? (
                    <img src={selectedProof.fileUrl} alt={selectedProof.fileName ?? selectedProof.id} className="max-h-[42rem] w-full rounded-[24px] object-contain bg-white dark:bg-slate-950" />
                  ) : (
                    <iframe title={`Comprobante ${selectedProof.id}`} src={selectedProof.fileUrl} className="h-[42rem] w-full rounded-[24px] bg-white dark:bg-slate-950" />
                  )
                ) : (
                  <div className="flex h-[42rem] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
                    No hay archivo disponible para este comprobante
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Validacion del pago</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                    <p><span className="font-semibold">Nombre del pagador:</span> {selectedProof.payer}</p>
                    <p><span className="font-semibold">Monto enviado:</span> {currency(selectedProof.amount)}</p>
                    <p><span className="font-semibold">Monto esperado:</span> {selectedProof.expectedAmount ? currency(selectedProof.expectedAmount) : 'No disponible'}</p>
                    <p><span className="font-semibold">Motivo enviado:</span> {selectedProof.referenceNumber || 'Sin referencia'}</p>
                    <p><span className="font-semibold">Codigo esperado:</span> {selectedProof.expectedReferenceCode || 'Sin codigo'}</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Revision automatica y humana</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                    <p><span className="font-semibold">Confianza IA:</span> {Math.round(selectedProof.aiConfidence * 100)}%</p>
                    <p><span className="font-semibold">Anomalia detectada:</span> {selectedProof.anomaly}</p>
                    <p><span className="font-semibold">Revision humana:</span> {selectedProof.reviewedBy}</p>
                    <p><span className="font-semibold">Archivo:</span> {selectedProof.fileName || 'Sin nombre'}</p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    <p className="font-semibold">Regla operativa</p>
                  </div>
                  <p className="mt-2">
                    El motivo del comprobante debe traer el mismo codigo de reserva para que admin e IA puedan validarlo junto con el nombre y el monto.
                  </p>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  )
}
