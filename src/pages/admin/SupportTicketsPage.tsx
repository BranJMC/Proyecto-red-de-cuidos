import { supportTickets } from '../../services/mockData'
import { DataTable } from '../../components/ui/DataTable'
import { statusTone } from '../../utils/helpers'

export function SupportTicketsPage() {
  return (
    <DataTable
      headers={['Requester', 'Topic', 'Channel', 'SLA', 'Status']}
      rows={supportTickets.map((ticket) => [
        ticket.requester,
        ticket.topic,
        ticket.channel,
        ticket.sla,
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(ticket.status)}`}>{ticket.status}</span>,
      ])}
    />
  )
}
