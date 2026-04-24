import { bookings } from '../../services/mockData'
import { DataTable } from '../../components/ui/DataTable'
import { currency, statusTone } from '../../utils/helpers'

export function ClientBookingsPage() {
  return (
    <DataTable
      headers={['Cuidador', 'Servicio', 'Zona', 'Fecha', 'Duracion', 'Estado', 'Monto']}
      rows={bookings.map((booking) => [
        booking.caregiverName,
        booking.service,
        booking.zone,
        booking.date,
        booking.duration,
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(booking.status)}`}>
          {booking.status}
        </span>,
        currency(booking.amount),
      ])}
    />
  )
}
