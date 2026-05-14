import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking } from '../../types'
import { bookingOperationalTone, statusTone } from '../../utils/helpers'
import { Button } from '../../components/ui/Button'

export function UpcomingServicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getBookingsByUser(user.id, 'client').then(setBookings)
  }, [user.id])

  return (
    <div className="space-y-4">
      {bookings.filter((booking) => booking.status !== 'cancelled').map((booking) => (
        <article key={booking.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-950 dark:text-white">{booking.service}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {booking.caregiverName} | {booking.zone} | {booking.date} | {booking.startTime}
              </p>
              {booking.paymentReferenceCode ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                  Codigo de reserva: {booking.paymentReferenceCode}
                </p>
              ) : null}
              {booking.checkIn ? (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Inicio registrado: {booking.checkIn}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bookingOperationalTone(booking.serviceState || booking.serviceStateLabel)}`}>
                {booking.serviceStateLabel ?? booking.status}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(booking.status)}`}>{booking.status}</span>
            </div>
          </div>
          {booking.status === 'completed' && booking.paymentProofStatus !== 'Approved' ? (
            <div className="mt-5 rounded-[24px] border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/20 dark:bg-rose-400/10">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-200">Debes pagar este servicio para poder seguir reservando.</p>
              <p className="mt-1 text-sm text-rose-700/90 dark:text-rose-200/90">
                Sube el comprobante del servicio completado y espera su aprobacion.
              </p>
              <Link to={`/client/payments?booking=${booking.id}`} className="mt-3 inline-block">
                <Button>Adjuntar comprobante</Button>
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
