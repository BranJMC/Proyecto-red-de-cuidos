import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircleMore } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { CalendarDayStatus, Caregiver, Zone } from '../../types'
import { serviceLabel } from '../../utils/helpers'
import { Button } from './Button'
import { MonthAvailabilityCalendar } from './MonthAvailabilityCalendar'
import { PriceCalculatorCard } from './PriceCalculatorCard'

const services = [
  'Cuidado de adulto mayor',
  'Cuidado infantil',
  'Apoyo a discapacidad',
  'Asistencia en el hogar',
  'Cuidado nocturno',
  'Cuidado de emergencia',
]

interface BookingWizardProps {
  caregiver?: Caregiver
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function BookingWizard({ caregiver }: BookingWizardProps) {
  const [calendarDays, setCalendarDays] = useState<CalendarDayStatus[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDayStatus | null>(null)
  const [serviceType, setServiceType] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [hours, setHours] = useState(4)
  const [zone, setZone] = useState('')
  const [coupon, setCoupon] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [startingConversation, setStartingConversation] = useState(false)
  const user = useAppStore((state) => state.user)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!caregiver) {
      return
    }

    mockApi.getCaregiverCalendar(caregiver.id).then(setCalendarDays)
    mockApi.getZones().then(setZones)
  }, [caregiver])
  const firstAvailableDay = calendarDays.find((day) => day.state === 'available') ?? calendarDays[0]
  const activeDay = selectedDay ?? calendarDays.find((day) => day.date === date) ?? firstAvailableDay
  const effectiveDate = date || activeDay?.date || getTodayDate()
  const effectiveStartTime = startTime || activeDay?.timeRange?.split(' - ')[0] || '08:00'

  const pricing = useMemo(() => {
    if (!caregiver) {
      return {
        hourlyRate: 0,
        hours,
        nightExtra: 0,
        weekendExtra: 0,
        emergencyExtra: 0,
        platformFee: 0,
        discount: 0,
        total: 0,
      }
    }

    const hourlyRate = caregiver.pricePerHour
    const nightExtra = effectiveStartTime >= '18:00' ? caregiver.nightShiftFee : 0
    const bookingDate = new Date(`${effectiveDate}T12:00:00`)
    const weekendExtra = [0, 6].includes(bookingDate.getDay()) ? caregiver.weekendFee : 0
    const emergencyExtra = serviceType === 'Cuidado de emergencia' ? caregiver.emergencyFee : 0
    const base = hourlyRate * hours
    const platformFee = Math.round(base * 0.12)
    const discount = coupon.trim() ? 10 : 0

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
  }, [caregiver, coupon, effectiveDate, effectiveStartTime, hours, serviceType])

  if (!caregiver) {
    return null
  }

  const currentCaregiver = caregiver
  const selectedServiceType = serviceType || serviceLabel(currentCaregiver.serviceTypes[0]) || services[0]
  const selectedZone = zone || currentCaregiver.neighborhood || ''

  const availableZones = zones.filter(
    (item) =>
      item.province === currentCaregiver.province ||
      item.city === currentCaregiver.city ||
      currentCaregiver.zones.includes(item.province) ||
      currentCaregiver.zones.includes(item.city) ||
      currentCaregiver.zones.includes(item.neighborhood),
  )

  async function handleCreateBooking() {
    if (!user.id || user.role !== 'client') {
      toast.error('Necesitas iniciar sesion', 'Entra como cliente para solicitar la reserva.')
      navigate('/auth/access/client')
      return
    }

    if (!addressLine.trim()) {
      toast.error('Falta la direccion', 'Ingresa la direccion donde se brindara el servicio.')
      return
    }

    setSaving(true)
    try {
      const booking = await mockApi.createBooking({
        clientId: user.id,
        caregiverId: currentCaregiver.id,
        serviceType: selectedServiceType,
        date: effectiveDate,
        startTime: effectiveStartTime,
        hours,
        addressLine,
        notes: [selectedZone ? `Zona: ${selectedZone}` : '', notes].filter(Boolean).join('\n'),
      })

      toast.success('Reserva enviada', `Tu codigo de pago es ${booking.paymentReferenceCode}. Lo usaras luego en el motivo del deposito.`)
      navigate('/client/bookings')
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error('No se pudo reservar', message || 'La solicitud no pudo guardarse. Revisa los datos e intenta otra vez.')
    } finally {
      setSaving(false)
    }
  }

  function handleSaveEstimate() {
    const draft = {
      caregiverId: currentCaregiver.id,
      caregiverName: currentCaregiver.name,
      serviceType: selectedServiceType,
      date: effectiveDate,
      startTime: effectiveStartTime,
      hours,
      zone: selectedZone,
      addressLine,
      notes,
      total: pricing.total,
    }

    localStorage.setItem('red-cuidados-booking-draft', JSON.stringify(draft))
    toast.success('Estimacion guardada', 'Dejamos este borrador en tu navegador para retomarlo luego.')
  }

  return (
    <div className="space-y-6">
      <div>
        <MonthAvailabilityCalendar
          title={`Disponibilidad de ${caregiver.name}`}
          days={calendarDays}
          selectedDate={effectiveDate}
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
        >
          <div className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5 dark:border-white/10 dark:bg-slate-800/45">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl text-slate-950 sm:text-2xl dark:text-white">Solicitar servicio</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  La fecha seleccionada queda fija hasta que hagas clic en otro dia.
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Fecha activa</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{effectiveDate}</p>
              </div>
            </div>
            {activeDay ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {activeDay.date} | {activeDay.state}
                {activeDay.serviceType ? ` | ${serviceLabel(activeDay.serviceType)}` : ''}
                {activeDay.timeRange ? ` | ${activeDay.timeRange}` : ''}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Selecciona un dia disponible para comenzar.
              </p>
            )}

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Tipo de cuido</label>
                <select className="field" value={selectedServiceType} onChange={(event) => setServiceType(event.target.value)}>
                  {[...new Set([...currentCaregiver.serviceTypes.map((service) => serviceLabel(service)), ...services])].map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Fecha</label>
                  <input className="field" type="date" value={effectiveDate} onChange={(event) => setDate(event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Hora de inicio</label>
                  <input
                    className="field"
                    type="time"
                    value={effectiveStartTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Horas</label>
                  <input
                    className="field"
                    type="number"
                    min={1}
                    max={24}
                    value={hours}
                    onChange={(event) => setHours(Math.max(1, Number(event.target.value) || 1))}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Cupon</label>
                  <input className="field" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Zona</label>
                <select className="field" value={selectedZone} onChange={(event) => setZone(event.target.value)}>
                  <option value="">Selecciona una zona</option>
                  {availableZones.map((item) => (
                    <option key={item.id} value={item.neighborhood}>
                      {item.province} | {item.city} | {item.neighborhood}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Direccion del servicio</label>
                <input
                  className="field"
                  placeholder="Ej. Condominio Los Arcos, casa 12"
                  value={addressLine}
                  onChange={(event) => setAddressLine(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Notas</label>
                <textarea
                  className="field min-h-28"
                  placeholder="Rutina, alergias, medicacion o detalles importantes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleCreateBooking} disabled={saving}>
                {saving ? 'Enviando...' : 'Solicitar reserva'}
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  if (!user.id || user.role !== 'client') {
                    toast.error('Necesitas iniciar sesion', 'Entra como cliente para abrir el chat con el cuidador.')
                    navigate('/auth/access/client')
                    return
                  }

                  setStartingConversation(true)
                  try {
                    const response = await mockApi.startConversation({
                      requesterId: user.id,
                      targetUserId: currentCaregiver.id,
                      initialMessage: `Hola ${currentCaregiver.name}, quisiera saber mas sobre tu servicio para el ${effectiveDate}.`,
                    })
                    toast.success('Conversacion lista', 'Ya puedes continuar esta conversacion en Mensajes.')
                    navigate(`/client/messages?thread=${response.conversationId}`)
                  } catch {
                    toast.error('No se pudo abrir el chat', 'Intenta nuevamente en unos segundos.')
                  } finally {
                    setStartingConversation(false)
                  }
                }}
                disabled={startingConversation}
              >
                <MessageCircleMore className="mr-2 size-4" />
                {startingConversation ? 'Abriendo chat...' : 'Hablar antes de reservar'}
              </Button>
              <Button variant="secondary" onClick={handleSaveEstimate}>
                Guardar estimacion
              </Button>
            </div>
          </div>
        </MonthAvailabilityCalendar>
      </div>

      <div className="2xl:max-w-sm">
        <PriceCalculatorCard summary={pricing} />
      </div>
    </div>
  )
}
