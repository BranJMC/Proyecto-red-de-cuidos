import { contentItems } from '../../services/mockData'
import { DataTable } from '../../components/ui/DataTable'
import { statusTone } from '../../utils/helpers'

export function ContentManagementPage() {
  return (
    <DataTable
      headers={['Title', 'Section', 'Status']}
      rows={contentItems.map((item) => [
        item.title,
        item.section,
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}>{item.status}</span>,
      ])}
    />
  )
}
