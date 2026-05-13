import { useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { mockApi } from '../../services/api'

export function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<{ id: string; actor: string; action: string; target: string; timestamp: string }[]>([])

  useEffect(() => {
    mockApi.getAuditLogs().then(setAuditLogs)
  }, [])

  return (
    <DataTable
      headers={['Actor', 'Action', 'Target', 'Timestamp']}
      rows={auditLogs.map((log) => [log.actor, log.action, log.target, log.timestamp])}
    />
  )
}
