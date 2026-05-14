import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileCheck2, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { DataTable } from '../../components/ui/DataTable'
import { ReceiptUploader } from '../../components/ui/ReceiptUploader'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking, PaymentHistoryItem, PaymentProof } from '../../types'
import { currency, paymentProofStatusLabel, serviceLabel, statusTone } from '../../utils/helpers'

export function ClientPaymentsPage() {
  const [searchParams] = useSearchParams()
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingId, setBookingId] = useState('')
  const [amount, setAmount] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    if (!user.id) {
      return
    }

    Promise.all([
      mockApi.getPaymentHistory(user.id),
      mockApi.getPaymentProofsByClient(user.id),
      mockApi.getBookingsByUser(user.id, 'client'),
    ]).then(([history, proofs, userBookings]) => {
      setPaymentHistory(history)
      setPaymentProofs(proofs)
      setBookings(userBookings)
      const requestedBookingId = searchParams.get('booking')
      if (requestedBookingId && userBookings.some((booking) => booking.id === requestedBookingId)) {
        setBookingId(requestedBookingId)
      }
    })
  }, [searchParams, user.id])

  const payableBookings = useMemo(
    () =>
      bookings.filter(
        (item) =>
          item.status === 'pending' ||
          item.status === 'confirmed' ||
          item.status === 'in-progress' ||
          (item.status === 'completed' && item.paymentProofStatus !== 'Approved'),
      ),
    [bookings],
  )
  const selectedBookingId = bookingId || payableBookings[0]?.id || ''
  const selectedBooking = payableBookings.find((item) => item.id === selectedBookingId)
  const displayedAmount = amount || (selectedBooking ? String(selectedBooking.amount) : '')

  async function reloadData() {
    if (!user.id) {
      return
    }

    const [history, proofs, userBookings] = await Promise.all([
      mockApi.getPaymentHistory(user.id),
      mockApi.getPaymentProofsByClient(user.id),
      mockApi.getBookingsByUser(user.id, 'client'),
    ])

    setPaymentHistory(history)
    setPaymentProofs(proofs)
    setBookings(userBookings)
  }

  async function handleUploadProof() {
    if (!user.id) {
      return
    }

    if (!selectedBookingId || !amount.trim() || !referenceNumber.trim()) {
      toast.error('Faltan datos', 'Selecciona una reserva, confirma el monto y escribe el codigo de motivo.')
      return
    }

    if (!receiptFile) {
      toast.error('Falta el comprobante', 'Sube la foto o PDF del deposito antes de enviarlo.')
      return
    }

    setSaving(true)
    try {
      await mockApi.uploadPaymentProof({
        bookingId: selectedBookingId,
        clientId: user.id,
        amount: Number(displayedAmount),
        referenceNumber,
        receipt: receiptFile,
      })

      toast.success('Comprobante enviado', 'La foto quedo registrada y paso a revision operativa.')
      setReferenceNumber('')
      setAmount('')
      setBookingId('')
      setReceiptFile(null)
      await reloadData()
    } catch {
      toast.error('No se pudo subir', 'El comprobante no pudo guardarse. Revisa el monto, el codigo y el archivo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <FileCheck2 className="size-6 text-cyan-500" />
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Subir comprobante real</h2>
          </div>
          <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white dark:bg-slate-900">
            <p className="text-sm text-white/60">Flujo operativo</p>
            <p className="mt-5 font-display text-3xl">Sube la foto y usa el codigo exacto de la reserva.</p>
            <div className="mt-6 grid gap-3 text-sm text-white/75">
              <p>1. Selecciona la reserva.</p>
              <p>2. Copia el codigo de motivo que te damos abajo.</p>
              <p>3. Sube la foto del comprobante para revision y futura lectura OCR.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Reserva</label>
              <select
                className="field"
                value={selectedBookingId}
                onChange={(event) => {
                  const nextBookingId = event.target.value
                  setBookingId(nextBookingId)
                  const nextBooking = payableBookings.find((item) => item.id === nextBookingId)
                  setAmount(nextBooking ? String(nextBooking.amount) : '')
                }}
              >
                <option value="">Selecciona una reserva</option>
                {payableBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.caregiverName} | {booking.date} | {currency(booking.amount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Monto</label>
                <input className="field" value={displayedAmount} onChange={(event) => setAmount(event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Codigo en motivo</label>
                <input
                  className="field"
                  value={referenceNumber}
                  onChange={(event) => setReferenceNumber(event.target.value.toUpperCase())}
                  placeholder={selectedBooking?.paymentReferenceCode ?? 'RDC-XXXXXXXX'}
                />
              </div>
            </div>
            {selectedBooking ? (
              <div className="grid gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <p>Servicio: {serviceLabel(selectedBooking.service)} | Zona: {selectedBooking.zone} | Hora: {selectedBooking.startTime}</p>
                <p>Monto esperado: {currency(selectedBooking.amount)}</p>
                <p className="font-semibold text-slate-950 dark:text-white">
                  Codigo de motivo: {selectedBooking.paymentReferenceCode ?? 'Pendiente'}
                </p>
              </div>
            ) : null}
            <ReceiptUploader file={receiptFile} onFileChange={setReceiptFile} />
          </div>
          <Button className="mt-6" onClick={handleUploadProof} disabled={saving || !payableBookings.length}>
            {saving ? 'Guardando...' : 'Subir nuevo comprobante'}
          </Button>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-cyan-500" />
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Revision del pago</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {[
              ['Verificacion automatica', 'Lectura OCR, monto esperado y deteccion de anomalias'],
              ['Revision operativa', 'El trabajador puede validar o escalar el recibo'],
              ['Control admin', 'Admin interviene cuando la AI detecta riesgo o incongruencias'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {paymentProofs.slice(0, 3).map((proof) => (
              <div key={proof.id} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950 dark:text-white">Comprobante {proof.bookingId}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(proof.status)}`}>{paymentProofStatusLabel(proof.status)}</span>
                </div>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {proof.uploadedAt} | {currency(proof.amount)} | Ref: {proof.referenceNumber || 'Sin referencia'}
                </p>
                {proof.fileUrl ? (
                  <a
                    className="mt-2 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300"
                    href={proof.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver comprobante
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>
      <DataTable
        headers={['Fecha', 'Cuidador', 'Metodo', 'Monto', 'Estado']}
        rows={paymentHistory.map((payment) => [
          payment.date,
          payment.caregiverName,
          payment.method,
          currency(payment.amount),
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(payment.status)}`}>{paymentProofStatusLabel(payment.status)}</span>,
        ])}
      />
    </div>
  )
}
