import { paymentProofs } from '../../services/mockData'
import { DataTable } from '../../components/ui/DataTable'
import { currency, statusTone } from '../../utils/helpers'

export function PaymentProofsPage() {
  return (
    <DataTable
      headers={['Booking', 'Payer', 'Uploaded', 'Amount', 'Status']}
      rows={paymentProofs.map((proof) => [
        proof.bookingId,
        proof.payer,
        proof.uploadedAt,
        currency(proof.amount),
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(proof.status)}`}>{proof.status}</span>,
      ])}
    />
  )
}
