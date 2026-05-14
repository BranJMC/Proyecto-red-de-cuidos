import { Camera, UploadCloud } from 'lucide-react'
import { useMemo, useState } from 'react'
import { paymentProofStatusLabel, statusTone } from '../../utils/helpers'

interface ReceiptUploaderProps {
  file?: File | null
  onFileChange?: (file: File | null) => void
  status?: 'Pending Review' | 'Approved' | 'Rejected'
}

export function ReceiptUploader({
  file: externalFile,
  onFileChange,
  status = 'Pending Review',
}: ReceiptUploaderProps = {}) {
  const [internalFile, setInternalFile] = useState<File | null>(null)
  const file = externalFile ?? internalFile

  const fileSizeLabel = useMemo(() => {
    if (!file) {
      return ''
    }

    return `${(file.size / 1024 / 1024).toFixed(2)} MB`
  }, [file])

  function handleFileChange(nextFile: File | null) {
    setInternalFile(nextFile)
    onFileChange?.(nextFile)
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Subida de comprobante</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Ya puedes seleccionar un archivo real y revisar su preview local antes de enviar el pago desde la pantalla de pagos.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(status)}`}>{paymentProofStatusLabel(status)}</span>
      </div>
      <label className="mt-6 flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.16),_transparent_55%)] p-6 text-center dark:border-white/10">
        <UploadCloud className="size-8 text-cyan-500" />
        <p className="mt-4 font-medium text-slate-950 dark:text-white">Arrastra o sube el comprobante</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Preview local activo para revisar el archivo seleccionado.</p>
        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white dark:bg-cyan-400 dark:text-slate-950">Seleccionar imagen</span>
          <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
            <Camera className="mr-2 inline size-4" />
            Camara
          </span>
        </div>
        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)} />
      </label>
      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/60">
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <div className="flex h-28 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_rgba(148,163,184,0.22),_rgba(34,211,238,0.18))] text-xs text-slate-500 dark:text-slate-300">
            {file ? 'Archivo listo' : 'Sin archivo'}
          </div>
          <div>
            <p className="font-medium text-slate-950 dark:text-white">{file ? 'Preview local listo' : 'Preview pendiente'}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {file ? `Archivo: ${file.name} | ${fileSizeLabel}` : 'Selecciona una imagen o PDF para revisar el archivo antes de enviarlo.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
