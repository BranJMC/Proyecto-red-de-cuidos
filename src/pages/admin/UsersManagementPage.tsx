import { useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { mockApi } from '../../services/api'
import type { AdminUser } from '../../types'
import { roleLabel } from '../../utils/helpers'

export function UsersManagementPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    mockApi.getAdminUsers().then(setAdminUsers)
  }, [])

  return (
    <DataTable
      headers={['Nombre', 'Email', 'Ciudad', 'Rol', 'Estado', 'Ingreso']}
      rows={adminUsers.map((user) => [
        user.name,
        user.email,
        user.city,
        roleLabel(user.role),
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {user.status}
        </span>,
        user.joinedAt,
      ])}
    />
  )
}
