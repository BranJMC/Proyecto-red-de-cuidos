import { useEffect, useMemo, useState } from 'react'
import { BellRing, History, SearchCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { StatCard } from '../../components/ui/StatCard'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking, DashboardMetric, NotificationItem } from '../../types'
import { bookingOperationalTone } from '../../utils/helpers'

export function ClientHomePage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const user = useAppStore((state) => state.user)
  const setStoreNotifications = useAppStore((state) => state.setNotifications)

  useEffect(() => {
    mockApi.getClientMetrics().then(setMetrics)
  }, [])

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getNotificationsByUser(user.id).then((items) => {
      setNotifications(items)
      setStoreNotifications(items)
    })

    mockApi.getBookingsByUser(user.id, 'client').then(setBookings)
  }, [setStoreNotifications, user.id])

  const nextBooking = useMemo(
    () => bookings.find((booking) => booking.status === 'confirmed' || booking.status === 'pending' || booking.status === 'in-progress' || booking.status === 'completed') ?? null,
    [bookings],
  )

  const quickPanels = useMemo(
    () => [
      {
        icon: BellRing,
        title: 'Notificaciones nuevas',
        copy: notifications.length ? `${notifications.length} avisos recientes de tus reservas y pagos.` : 'No tienes avisos nuevos por ahora.',
      },
      {
        icon: History,
        title: 'Historial de reservas',
        copy: bookings.length ? `${bookings.length} reservas registradas en tu cuenta.` : 'Todavia no has realizado reservas.',
      },
      {
        icon: SearchCheck,
        title: 'Busqueda de cuidadores',
        copy: 'Explora perfiles verificados por provincia, canton y disponibilidad.',
      },
    ],
    [bookings.length, notifications.length],
  )

  return (
    <div className="space-y-8">
      <section className="grid gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Actividad principal</p>
          <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">
            {nextBooking ? 'Tu siguiente servicio ya esta listo para seguimiento.' : 'Aun no tienes una reserva activa.'}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            {nextBooking
              ? `${nextBooking.caregiverName} aparece para ${nextBooking.date} a las ${nextBooking.startTime}. Estado actual: ${nextBooking.serviceStateLabel ?? nextBooking.status}. Codigo de reserva: ${nextBooking.paymentReferenceCode ?? 'pendiente de confirmacion'}.`
              : 'Puedes buscar un cuidador verificado, revisar su perfil y solicitar un servicio desde esta misma plataforma.'}
          </p>
          {nextBooking ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bookingOperationalTone(nextBooking.serviceState || nextBooking.serviceStateLabel)}`}>
                {nextBooking.serviceStateLabel ?? nextBooking.status}
              </span>
              {nextBooking.paymentDeadlineAt && nextBooking.paymentProofStatus !== 'Approved' ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  Debes subir comprobante antes de seguir reservando
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/client/booking">
              <Button>Reservar servicio</Button>
            </Link>
            <Link to="/client/bookings">
              <Button variant="secondary">Ver mis reservas</Button>
            </Link>
            {nextBooking?.status === 'completed' && nextBooking.paymentProofStatus !== 'Approved' ? (
              <Link to={`/client/payments?booking=${nextBooking.id}`}>
                <Button>Adjuntar comprobante</Button>
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Centro de notificaciones</h3>
          <div className="mt-5 space-y-3">
            {notifications.length ? notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            )) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                No tienes notificaciones nuevas.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {quickPanels.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
              <Icon className="size-5 text-cyan-500" />
              <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">{copy}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
