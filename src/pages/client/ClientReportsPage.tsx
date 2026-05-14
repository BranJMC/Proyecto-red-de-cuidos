import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking, Complaint } from '../../types'
import { serviceLabel } from '../../utils/helpers'

export function ClientReportsPage() {
  const [category, setCategory] = useState('cuidador')
  const [urgency, setUrgency] = useState('notice')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reports, setReports] = useState<Complaint[]>([])
  const [saving, setSaving] = useState(false)
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getBookingsByUser(user.id, 'client').then(setBookings)
    mockApi.getReports().then((items) => setReports(items.filter((item) => item.description || item.subject)))
  }, [user.id])

  const selectedBooking = bookings.find((item) => item.id === bookingId)

  async function handleSubmit() {
    if (!user.id || !subject.trim() || !description.trim()) {
      toast.error('Faltan datos', 'Completa asunto y descripcion antes de enviar el reporte.')
      return
    }

    setSaving(true)
    try {
      await mockApi.createReport({
        reporterId: user.id,
        bookingId: bookingId || undefined,
        caregiverId: selectedBooking?.caregiverId,
        category,
        urgency,
        subject,
        description,
      })

      toast.success('Reporte enviado', 'Tu reporte ya quedo guardado y fue enviado al administrador.')
      setSubject('')
      setDescription('')
      setBookingId('')
      setReports(await mockApi.getReports())
    } catch {
      toast.error('No se pudo enviar', 'El reporte no pudo guardarse en la base de datos.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Reportes directos al administrador</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Si hubo un problema con el cuidador, la plataforma o el pago, reportalo desde aqui.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="cuidador">Cuidador</option>
            <option value="plataforma">Plataforma</option>
            <option value="pago">Pago</option>
            <option value="seguridad">Seguridad</option>
            <option value="otro">Otro</option>
          </select>
          <select className="field" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
            <option value="urgent">Urgente</option>
            <option value="notice">Aviso</option>
            <option value="other">Otro</option>
          </select>
          <select className="field sm:col-span-2" value={bookingId} onChange={(event) => setBookingId(event.target.value)}>
            <option value="">Reserva relacionada (opcional)</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.caregiverName} | {booking.date} | {serviceLabel(booking.service)}
              </option>
            ))}
          </select>
          <input className="field sm:col-span-2" placeholder="Asunto del reporte" value={subject} onChange={(event) => setSubject(event.target.value)} />
          <textarea className="field min-h-40 sm:col-span-2" placeholder="Describe lo ocurrido con el mayor detalle posible" value={description} onChange={(event) => setDescription(event.target.value)} />
        </div>
        <Button className="mt-6" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Enviando...' : 'Enviar reporte'}
        </Button>
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="font-display text-2xl text-slate-950 dark:text-white">Historial reciente</h3>
        <div className="mt-5 space-y-3">
          {reports.slice(0, 5).map((report) => (
            <div key={report.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <p className="font-medium text-slate-950 dark:text-white">{report.subject}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {report.category} | {report.urgency} | {report.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
