import { UploadCloud } from 'lucide-react'
import { useId, useState } from 'react'

export function FileUploader({
  label,
  helper,
  accept,
  fileName,
  statusLabel,
  busy = false,
  onSelect,
}: {
  label: string
  helper: string
  accept?: string
  fileName?: string
  statusLabel?: string
  busy?: boolean
  onSelect?: (file: File) => void | Promise<void>
}) {
  const inputId = useId()
  const [localName, setLocalName] = useState(fileName ?? '')

  return (
    <label
      htmlFor={inputId}
      className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center transition hover:border-cyan-500 hover:bg-cyan-50/50 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-400"
    >
      <div className="rounded-2xl bg-white p-3 text-cyan-600 shadow-sm dark:bg-slate-950 dark:text-cyan-300">
        <UploadCloud className="size-5" />
      </div>
      <span className="mt-4 font-medium text-slate-950 dark:text-white">{label}</span>
      <span className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{helper}</span>
      <span className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-400 dark:text-slate-950">
        {busy ? 'Subiendo...' : 'Seleccionar archivo'}
      </span>
      {statusLabel ? <span className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">{statusLabel}</span> : null}
      {localName ? <span className="mt-2 text-sm text-slate-600 dark:text-slate-300">{localName}</span> : null}
      <input
        id={inputId}
        className="hidden"
        type="file"
        accept={accept}
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) {
            return
          }

          setLocalName(file.name)
          await onSelect?.(file)
          event.target.value = ''
        }}
      />
    </label>
  )
}
