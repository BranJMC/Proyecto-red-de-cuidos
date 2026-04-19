import { auditLogs } from '../../services/mockData'
import { DataTable } from '../../components/ui/DataTable'

export function AuditLogsPage() {
  return (
    <DataTable
      headers={['Actor', 'Action', 'Target', 'Timestamp']}
      rows={auditLogs.map((log) => [log.actor, log.action, log.target, log.timestamp])}
    />
  )
}
