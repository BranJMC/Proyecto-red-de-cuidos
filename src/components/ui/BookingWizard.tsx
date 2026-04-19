import { useMemo, useState } from 'react'
import { zones } from '../../services/mockData'
import { Button } from './Button'
import { PriceCalculatorCard } from './PriceCalculatorCard'

const services = [
  'Elder care',
  'Child care',
  'Disability support',
  'Home assistance',
  'Overnight care',
  'Emergency care',
]

export function BookingWizard() {
  const [serviceType, setServiceType] = useState(services[0])
  const [date, setDate] = useState('2026-04-24')
  const [startTime, setStartTime] = useState('20:00')
  const [hours, setHours] = useState(8)
  const [zone, setZone] = useState(zones[0].neighborhood)
  const [coupon, setCoupon] = useState('FAMILY10')

  const pricing = useMemo(() => {
    const hourlyRate = serviceType === 'Emergency care' ? 24 : serviceType === 'Overnight care' ? 20 : 18
    const nightExtra = startTime >= '18:00' ? 12 : 0
    const weekendExtra = ['2026-04-25', '2026-04-26'].includes(date) ? 8 : 0
    const emergencyExtra = serviceType === 'Emergency care' ? 16 : 0
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
  }, [coupon, date, hours, serviceType, startTime])

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Booking flow</p>
        <h2 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Reserva y calcula el pago</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Step 1 · Service type</label>
            <select className="field" value={serviceType} onChange={(event) => setServiceType(event.target.value)}>
              {services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Step 2 · Date</label>
            <input className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Step 3 · Start time</label>
            <input className="field" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Step 4 · Total hours</label>
            <input className="field" type="number" min={1} max={24} value={hours} onChange={(event) => setHours(Number(event.target.value))} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Step 5 · Zone</label>
            <select className="field" value={zone} onChange={(event) => setZone(event.target.value)}>
              {zones.map((item) => (
                <option key={item.id}>{item.neighborhood}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Discount coupon</label>
            <input className="field" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Continuar a pago</Button>
          <Button variant="secondary">Guardar estimacion</Button>
        </div>
      </section>
      <PriceCalculatorCard summary={pricing} />
    </div>
  )
}
