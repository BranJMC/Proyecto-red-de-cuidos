import { useMemo, useState } from 'react'
import { calendarDaysByCaregiver, caregivers, reviews, zones } from '../../services/mockData'
import type { CalendarDayStatus, Caregiver } from '../../types'
import { Button } from './Button'
import { MonthAvailabilityCalendar } from './MonthAvailabilityCalendar'
import { PriceCalculatorCard } from './PriceCalculatorCard'
import { RatingStars } from './RatingStars'
import { ReceiptUploader } from './ReceiptUploader'

const services = [
  'Elder care',
  'Child care',
  'Disability support',
  'Home assistance',
  'Overnight care',
  'Emergency care',
]

interface BookingWizardProps {
  caregiver?: Caregiver
}

export function BookingWizard({ caregiver = caregivers[0] }: BookingWizardProps) {
  const calendarDays = calendarDaysByCaregiver[caregiver.id] ?? []
  const initialDay = calendarDays.find((day) => day.state === 'available') ?? calendarDays[0] ?? null
  const [selectedDay, setSelectedDay] = useState<CalendarDayStatus | null>(initialDay)
  const [serviceType, setServiceType] = useState(caregiver.serviceTypes[0] ?? services[0])
  const [date, setDate] = useState(initialDay?.date ?? '2026-04-24')
  const [startTime, setStartTime] = useState('08:00')
  const [hours, setHours] = useState(4)
  const [zone, setZone] = useState(caregiver.neighborhood)
  const [coupon, setCoupon] = useState('FAMILY10')

  const caregiverReviews = reviews.filter((review) => review.caregiverName === caregiver.name)
  const availableZones = zones.filter(
    (item) =>
      item.province === caregiver.province ||
      item.city === caregiver.city ||
      caregiver.zones.includes(item.province) ||
      caregiver.zones.includes(item.city) ||
      caregiver.zones.includes(item.neighborhood),
  )

  const pricing = useMemo(() => {
    const hourlyRate = caregiver.pricePerHour
    const nightExtra = startTime >= '18:00' ? caregiver.nightShiftFee : 0
    const bookingDate = new Date(`${date}T12:00:00`)
    const weekendExtra = [0, 6].includes(bookingDate.getDay()) ? caregiver.weekendFee : 0
    const emergencyExtra = serviceType === 'Emergency care' ? caregiver.emergencyFee : 0
    const base = hourlyRate * hours
    const platformFee = Math.round(base * 0.12)
    const discount = coupon ? 10 : 0

    return {
      hourlyRate,
      hours,
      nightExtra,
      weekendExtra,
      emergencyExtra,
      platformFee,
      discount,
      total: base + nightExtra + weekendExtra + emergencyExtra + platformFee - discount,
    }
  }, [caregiver, coupon, date, hours, serviceType, startTime])

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Reserva guiada</p>
          <h2 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Agenda con {caregiver.name}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Elige el dia en el calendario, define el rango horario y carga el comprobante para iniciar la revision.
          </p>
        </section>

        <MonthAvailabilityCalendar
          title="Disponibilidad del cuidador"
          days={calendarDays}
          onSelect={(day) => {
            setSelectedDay(day)
            setDate(day.date)
            if (day.timeRange) {
              const [nextStartTime] = day.timeRange.split(' - ')
              if (nextStartTime) {
                setStartTime(nextStartTime)
              }
            }
          }}
        />

        <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl text-slate-950 dark:text-white">Configura la reserva</h3>
              {selectedDay ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Dia elegido: {selectedDay.date} • Estado: {selectedDay.state}
                  {selectedDay.serviceType ? ` • ${selectedDay.serviceType}` : ''}
                  {selectedDay.timeRange ? ` • ${selectedDay.timeRange}` : ''}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Selecciona un dia disponible para comenzar.
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              {caregiver.rank} • {caregiver.serviceCount} servicios • {caregiver.pricePerHour}/h
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Tipo de cuido</label>
              <select className="field" value={serviceType} onChange={(event) => setServiceType(event.target.value)}>
                {[...new Set([...caregiver.serviceTypes, ...services])].map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Fecha</label>
              <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Hora de inicio</label>
              <input
                className="field"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Horas de servicio</label>
              <input
                className="field"
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Zona</label>
              <select className="field" value={zone} onChange={(event) => setZone(event.target.value)}>
                {availableZones.map((item) => (
                  <option key={item.id} value={item.neighborhood}>
                    {item.province} • {item.city} • {item.neighborhood}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Cupon de descuento</label>
              <input className="field" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Continuar a reserva</Button>
            <Button variant="secondary">Guardar estimacion</Button>
          </div>
        </section>

        <ReceiptUploader />

        <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-slate-950 dark:text-white">Resenas anteriores del cuidador</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Historial publico para decidir con mas confianza antes de reservar.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <RatingStars value={caregiver.rating} />
              <span className="text-sm text-slate-500 dark:text-slate-400">{caregiver.reviews} resenas</span>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {caregiverReviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">{review.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                  </div>
                  <RatingStars value={review.rating} />
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PriceCalculatorCard summary={pricing} />
    </div>
  )
}
