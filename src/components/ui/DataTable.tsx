import type { ReactNode } from 'react'

export function DataTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 dark:border-white/10 dark:bg-slate-900/70">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-slate-200/80 text-slate-700 dark:border-white/10 dark:text-slate-200"
            >
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-5 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
