import { bookings } from '../../services/mockData'
import { statusTone } from '../../utils/helpers'

export function UpcomingServicesPage() {
  return (
    <div className="space-y-4">
      {bookings.filter((booking) => booking.status !== 'completed').map((booking) => (
        <article key={booking.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-slate-950 dark:text-white">{booking.service}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.caregiverName} • {booking.zone} • {booking.date} • {booking.startTime}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(booking.status)}`}>{booking.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
