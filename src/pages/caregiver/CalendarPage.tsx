import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CalendarClock, Clock3 } from 'lucide-react'
import { MonthAvailabilityCalendar } from '../../components/ui/MonthAvailabilityCalendar'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { CalendarDayStatus } from '../../types'

export function CalendarPage() {
  const [days, setDays] = useState<CalendarDayStatus[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getCaregiverCalendar(user.id).then((items) => {
      setDays(items)
      const preferredDay = items.find((day) => day.pendingCount || day.confirmedCount) ?? items.find((day) => day.state !== 'off') ?? items[0]
      if (preferredDay) {
        setSelectedDate(preferredDay.date)
      }
    })
  }, [user.id])

  const selectedDay = useMemo(
    () => days.find((day) => day.date === selectedDate) ?? days.find((day) => day.state !== 'off') ?? null,
    [days, selectedDate],
  )

  const acceptedReservations = selectedDay?.reservations?.filter((reservation) => reservation.status === 'confirmed' || reservation.status === 'completed') ?? []
  const pendingReservations = selectedDay?.reservations?.filter((reservation) => reservation.status === 'pending') ?? []

  return (
    <div className="space-y-6">
      <MonthAvailabilityCalendar
        title={`Calendario operativo de ${user.name}`}
        days={days}
        selectedDate={selectedDay?.date}
        onSelect={(day) => {
          setSelectedDate(day.date)
          if (day.alert) {
            window.alert(day.alert)
          }
        }}
      >
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-800/45">
            <div className="flex items-center gap-3">
              <CalendarClock className="size-5 text-cyan-500" />
              <div>
                <h3 className="font-display text-2xl text-slate-950 dark:text-white">Resumen del dia</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedDay ? selectedDay.date : 'Selecciona un dia'} {selectedDay?.summary ? `| ${selectedDay.summary}` : ''}
                </p>
              </div>
            </div>
            {selectedDay ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-4 dark:bg-slate-900/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Capacidad</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    {selectedDay.totalReservedHours ?? 0}h usadas de {selectedDay.workingHoursCapacity ?? 0}h
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {selectedDay.hasCapacity ? 'Todavia puedes recibir mas solicitudes.' : 'Tu jornada ya no admite mas reservas.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-4 dark:bg-slate-900/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Conteo</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    {selectedDay.confirmedCount ?? 0} aceptadas | {selectedDay.pendingCount ?? 0} pendientes
                  </p>
                  {selectedDay.alert ? (
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300">
                      <AlertTriangle className="size-4" />
                      {selectedDay.alert}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </MonthAvailabilityCalendar>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <Clock3 className="size-5 text-rose-500" />
            <div>
              <h3 className="font-display text-2xl text-slate-950 dark:text-white">Reservas aceptadas</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Servicios ya confirmados para la fecha seleccionada.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {acceptedReservations.length ? acceptedReservations.map((reservation) => (
              <article key={reservation.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950 dark:text-white">{reservation.clientName}</p>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
                    Reservado
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{reservation.serviceType}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {reservation.startTime} - {reservation.endTime} | {reservation.hours} horas
                </p>
              </article>
            )) : <p className="text-sm text-slate-500 dark:text-slate-400">No hay reservas aceptadas para este dia.</p>}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-amber-500" />
            <div>
              <h3 className="font-display text-2xl text-slate-950 dark:text-white">Reservas pendientes</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Solicitudes que todavia debes revisar.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {pendingReservations.length ? pendingReservations.map((reservation) => (
              <article key={reservation.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-950 dark:text-white">{reservation.clientName}</p>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                    Pendiente
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{reservation.serviceType}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {reservation.startTime} - {reservation.endTime} | {reservation.hours} horas
                </p>
              </article>
            )) : <p className="text-sm text-slate-500 dark:text-slate-400">No hay solicitudes pendientes para este dia.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
