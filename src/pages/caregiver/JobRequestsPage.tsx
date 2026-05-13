import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking } from '../../types'

export function JobRequestsPage() {
  const [jobs, setJobs] = useState<Booking[]>([])
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
  const acceptedJobs = useMemo(() => jobs.filter((booking) => booking.status === 'confirmed'), [jobs])

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
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{job.service} | {job.date} | {job.startTime}</p>
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
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{job.service} | {job.date} | {job.startTime}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{job.zone}</p>
                  {job.addressLine ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Direccion: {job.addressLine}</p> : null}
                  {job.paymentReferenceCode ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Codigo de reserva: {job.paymentReferenceCode}</p> : null}
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{job.duration} | Pago esperado ${job.amount}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
                  Aceptado
                </span>
              </div>
            </article>
          )) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400">
              Aun no tienes trabajos aceptados.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
