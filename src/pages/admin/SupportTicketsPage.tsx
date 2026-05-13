import { useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { mockApi } from '../../services/api'
import type { SupportTicket } from '../../types'
import { statusTone } from '../../utils/helpers'

export function SupportTicketsPage() {
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])

  useEffect(() => {
    mockApi.getSupportTickets().then(setSupportTickets)
  }, [])

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
