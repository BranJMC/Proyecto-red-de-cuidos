import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking } from '../../types'
import { bookingOperationalTone, currency, paymentProofStatusLabel, serviceLabel } from '../../utils/helpers'

export function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getBookingsByUser(user.id, 'client').then(setBookings)
  }, [user.id])

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== 'completed' && booking.status !== 'cancelled'),
    [bookings],
  )

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'completed'),
    [bookings],
  )

  function renderBookingCard(booking: Booking) {
    return (
      <article key={booking.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-950 dark:text-white">{serviceLabel(booking.service)}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {booking.caregiverName} | {booking.zone} | {booking.date} | {booking.startTime}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{booking.duration} | {currency(booking.amount)}</p>
            {booking.paymentReferenceCode ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                Codigo de reserva: {booking.paymentReferenceCode}
              </p>
            ) : null}
            {booking.checkIn ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Inicio registrado: {booking.checkIn}</p> : null}
            {booking.checkOut ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Salida registrada: {booking.checkOut}</p> : null}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bookingOperationalTone(booking.serviceState || booking.serviceStateLabel)}`}>
                {booking.serviceStateLabel ?? booking.status}
              </span>
            </div>
        </div>

        {booking.status === 'completed' ? (
          <div className={`mt-5 rounded-[24px] p-4 ${booking.paymentProofStatus === 'Approved' ? 'border border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10' : 'border border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-400/10'}`}>
            <p className={`text-sm font-semibold ${booking.paymentProofStatus === 'Approved' ? 'text-emerald-700 dark:text-emerald-200' : 'text-rose-700 dark:text-rose-200'}`}>
              {booking.paymentProofStatus === 'Approved' ? 'Comprobante aprobado' : booking.paymentProofStatus ? `Comprobante: ${paymentProofStatusLabel(booking.paymentProofStatus)}` : 'Es necesario adjuntar el comprobante'}
            </p>
            <p className={`mt-1 text-sm ${booking.paymentProofStatus === 'Approved' ? 'text-emerald-700/90 dark:text-emerald-200/90' : 'text-rose-700/90 dark:text-rose-200/90'}`}>
              {booking.paymentProofStatus === 'Approved'
                ? 'Este servicio ya quedo pagado y validado.'
                : 'Debes subir o completar la validacion del comprobante para volver a contratar servicios.'}
            </p>
            {booking.paymentProofStatus !== 'Approved' ? (
              <Link to={`/client/payments?booking=${booking.id}`} className="mt-3 inline-block">
                <Button>Ir a adjuntar comprobante</Button>
              </Link>
            ) : null}
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Pendientes y en transcurso</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aqui aparecen tus servicios proximos y los que ya estan en progreso.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            {activeBookings.length} activos
          </span>
        </div>
        <div className="space-y-4">
          {activeBookings.length ? activeBookings.map((booking) => renderBookingCard(booking)) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400">
              No tienes servicios activos en este momento.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Completados</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Aqui puedes ver si el servicio ya termino y si el comprobante fue enviado o aprobado.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            {completedBookings.length} completados
          </span>
        </div>
        <div className="space-y-4">
          {completedBookings.length ? completedBookings.map((booking) => renderBookingCard(booking)) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-400">
              Aun no tienes servicios completados.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
