import { bookings } from '../../services/mockData'

export function AcceptedJobsPage() {
  return (
    <div className="space-y-4">
      {bookings.filter((booking) => booking.status === 'confirmed').map((booking) => (
        <article key={booking.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h2 className="font-display text-3xl text-slate-950 dark:text-white">{booking.clientName}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.service} • {booking.zone} • {booking.date} • {booking.startTime}</p>
        </article>
      ))}
    </div>
  )
}
