import { useEffect, useMemo, useState } from 'react'
import { Clock3, ExternalLink, FileImage } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking, ShiftLog } from '../../types'
import { bookingOperationalTone, paymentProofStatusLabel, serviceLabel, statusTone } from '../../utils/helpers'

export function JobRequestsPage() {
  const [jobs, setJobs] = useState<Booking[]>([])
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null)
  const [selectedShiftLog, setSelectedShiftLog] = useState<ShiftLog | null>(null)
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  async function loadJobs() {
    if (!user.id) {
      return
    }

    setJobs(await mockApi.getBookingsByUser(user.id, 'caregiver'))
  }

  useEffect(() => {
    if (!user.id) {
      return
    }

    let active = true
    mockApi.getBookingsByUser(user.id, 'caregiver').then((items) => {
      if (active) {
        setJobs(items)
      }
    })

    return () => {
      active = false
    }
  }, [user.id])

  const pendingJobs = useMemo(() => jobs.filter((booking) => booking.status === 'pending'), [jobs])
  const acceptedJobs = useMemo(
    () => jobs.filter((booking) => ['confirmed', 'in-progress', 'completed'].includes(booking.status)),
    [jobs],
  )

  async function handleDecision(bookingId: string, decision: 'accept' | 'reject') {
    if (!user.id) {
      return
    }

    try {
      await mockApi.decideBooking(bookingId, user.id, decision)
      await loadJobs()
      toast.success(
        decision === 'accept' ? 'Solicitud aceptada' : 'Solicitud rechazada',
        'La decision ya quedo guardada en la base de datos.',
      )
    } catch {
      toast.error('No se pudo actualizar', 'La solicitud no pudo actualizarse en la base.')
    }
  }

  async function openJobDetail(job: Booking) {
    setSelectedJob(job)
    if (job.id) {
      setSelectedShiftLog(await mockApi.getShiftLog(job.id))
    }
  }

  async function refreshAfterShift() {
    await loadJobs()
    if (selectedJob?.id && user.id) {
      const nextJobs = await mockApi.getBookingsByUser(user.id, 'caregiver')
      const nextSelected = nextJobs.find((item) => item.id === selectedJob.id) ?? null
      setSelectedJob(nextSelected)
      setSelectedShiftLog(nextSelected ? await mockApi.getShiftLog(nextSelected.id) : null)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Solicitudes</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Revisa y decide cuales reservas quieres aceptar.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            {pendingJobs.length} pendientes
          </span>
        </div>

        <div className="space-y-4">
          {pendingJobs.length ? pendingJobs.map((job) => (
            <article key={job.id} className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-5 dark:border-white/10 dark:bg-slate-800/60">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-slate-950 dark:text-white">{job.clientName}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{serviceLabel(job.service)} | {job.date} | {job.startTime}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.zone}</p>
                  {job.addressLine ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.addressLine}</p> : null}
                  {job.paymentReferenceCode ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Codigo de reserva: {job.paymentReferenceCode}</p> : null}
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.duration} | Monto estimado ${job.amount}</p>
                </div>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                  Pendiente
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={() => handleDecision(job.id, 'accept')}>Aceptar</Button>
                <Button variant="secondary" onClick={() => handleDecision(job.id, 'reject')}>Rechazar</Button>
                <Button variant="secondary" onClick={() => openJobDetail(job)}>Ver detalle</Button>
              </div>
            </article>
          )) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400">
              De momento no tienes solicitudes.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Trabajos aceptados</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Servicios ya confirmados con toda la informacion operativa.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            {acceptedJobs.length} confirmados
          </span>
        </div>

        <div className="space-y-4">
          {acceptedJobs.length ? acceptedJobs.map((job) => (
            <article key={job.id} className="rounded-[28px] border border-emerald-200 bg-emerald-50/70 px-5 py-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-slate-950 dark:text-white">{job.clientName}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{serviceLabel(job.service)} | {job.date} | {job.startTime}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{job.zone}</p>
                  {job.addressLine ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Direccion: {job.addressLine}</p> : null}
                  {job.paymentReferenceCode ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Codigo de reserva: {job.paymentReferenceCode}</p> : null}
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{job.duration} | Pago esperado ${job.amount}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bookingOperationalTone(job.serviceState || job.serviceStateLabel)}`}>
                  {job.serviceStateLabel ?? 'Servicio proximo'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => openJobDetail(job)}>Abrir trabajo</Button>
                <Link
                  to={job.conversationId ? `/caregiver/messages?thread=${job.conversationId}` : '/caregiver/messages'}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  Ir a mensajes <ExternalLink className="size-4" />
                </Link>
              </div>
            </article>
          )) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400">
              Aun no tienes trabajos aceptados.
            </div>
          )}
        </div>
      </section>

      <Modal open={Boolean(selectedJob)} onClose={() => setSelectedJob(null)} title={selectedJob ? `Detalle de ${selectedJob.clientName}` : 'Detalle del trabajo'}>
        {selectedJob ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">Servicio</p>
                <p className="mt-1 font-medium text-slate-950 dark:text-white">{serviceLabel(selectedJob.service)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedJob.date} | {selectedJob.startTime}{selectedJob.endTime ? ` - ${selectedJob.endTime}` : ''}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selectedJob.duration}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">Estado operativo</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bookingOperationalTone(selectedJob.serviceState || selectedJob.serviceStateLabel)}`}>
                  {selectedJob.serviceStateLabel ?? 'Servicio proximo'}
                </span>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Entrada: {selectedShiftLog?.checkIn || selectedJob.checkIn || 'Sin registrar'}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Salida: {selectedShiftLog?.checkOut || selectedJob.checkOut || 'Sin registrar'}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">Ubicacion y notas</p>
              <p className="mt-1 font-medium text-slate-950 dark:text-white">{selectedJob.zone}</p>
              {selectedJob.addressLine ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedJob.addressLine}</p> : null}
              {selectedJob.notes ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{selectedJob.notes}</p> : null}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">Comprobante de pago</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(selectedJob.paymentProofStatus || 'Pending Review')}`}>
                  {selectedJob.paymentProofStatus ? paymentProofStatusLabel(selectedJob.paymentProofStatus) : 'Aun no enviado'}
                </span>
                  {selectedJob.paymentProofUploadedAt ? <span className="text-sm text-slate-600 dark:text-slate-300">Subido: {selectedJob.paymentProofUploadedAt}</span> : null}
              </div>
              {selectedJob.paymentProofFileUrl ? (
                <a
                  href={selectedJob.paymentProofFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300"
                >
                  <FileImage className="size-4" />
                  Ver comprobante
                </a>
              ) : (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">El cliente aun no ha subido un comprobante para esta reserva.</p>
              )}
            </div>

            {selectedJob.status !== 'pending' ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (!user.id || !selectedJob.id) return
                    await mockApi.markShiftCheckIn(selectedJob.id, user.id)
                    await refreshAfterShift()
                    toast.success('Entrada registrada', 'La hora de entrada ya quedo guardada.')
                  }}
                  disabled={(selectedShiftLog?.status ?? selectedJob.shiftStatus) !== 'pending-start'}
                >
                  <Clock3 className="mr-2 size-4" />
                  Marcar entrada
                </Button>
                <Button
                  onClick={async () => {
                    if (!user.id || !selectedJob.id) return
                    await mockApi.markShiftCheckOut(selectedJob.id, user.id)
                    await refreshAfterShift()
                    toast.success('Salida registrada', 'La hora de salida ya quedo guardada.')
                  }}
                  disabled={(selectedShiftLog?.status ?? selectedJob.shiftStatus) !== 'in-progress'}
                >
                  Marcar salida
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
