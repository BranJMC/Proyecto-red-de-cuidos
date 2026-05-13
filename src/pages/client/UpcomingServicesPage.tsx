import { useEffect, useState } from 'react'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking } from '../../types'
import { statusTone } from '../../utils/helpers'

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
      {bookings.filter((booking) => booking.status !== 'completed').map((booking) => (
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
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(booking.status)}`}>{booking.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
