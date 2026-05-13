import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'

export function BookingModal({
  caregiverId,
  caregiverName,
  serviceType,
}: {
  caregiverId: string
  caregiverName: string
  serviceType: string
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('08:00')
  const [hours, setHours] = useState('4')
  const [addressLine, setAddressLine] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const user = useAppStore((state) => state.user)
  const toast = useToast()
  const navigate = useNavigate()

  async function handleBooking() {
    if (!user.id || user.role !== 'client') {
      toast.error('Necesitas iniciar sesion', 'Entra como cliente para guardar la reserva en la base de datos.')
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
        caregiverId,
        serviceType,
        date,
        startTime: time,
        hours: Number(hours),
        addressLine,
        notes,
      })
      toast.success('Solicitud enviada', `Reserva guardada. Codigo de pago: ${booking.paymentReferenceCode}.`)
      setOpen(false)
    } catch {
      toast.error('No se pudo reservar', 'Confirma que el backend este corriendo e intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Reservar ahora</Button>
      <Modal open={open} title={`Reservar a ${caregiverName}`} onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <input className="field" placeholder="Hora" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          <input
            className="field"
            placeholder="Horas requeridas"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
          />
          <input
            className="field"
            placeholder="Direccion del servicio"
            value={addressLine}
            onChange={(event) => setAddressLine(event.target.value)}
          />
        </div>
        <textarea
          className="field mt-4 min-h-28"
          placeholder="Notas sobre la rutina, alergias o cuidados especiales"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleBooking} disabled={saving}>
            {saving ? 'Guardando...' : 'Confirmar solicitud'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
