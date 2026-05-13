import { useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking } from '../../types'
import { currency, statusTone } from '../../utils/helpers'

export function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getBookingsByUser(user.id, 'client').then(setBookings)
  }, [user.id])

  return (
    <DataTable
      headers={['Cuidador', 'Servicio', 'Zona', 'Fecha', 'Duracion', 'Codigo', 'Estado', 'Monto']}
      rows={bookings.map((booking) => [
        booking.caregiverName,
        booking.service,
        booking.zone,
        booking.date,
        booking.duration,
        booking.paymentReferenceCode ?? 'Pendiente',
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(booking.status)}`}>
          {booking.status}
        </span>,
        currency(booking.amount),
      ])}
    />
  )
}
