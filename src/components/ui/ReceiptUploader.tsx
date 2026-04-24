import { Camera, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { statusTone } from '../../utils/helpers'

export function ReceiptUploader() {
  const [status] = useState<'Pending Review' | 'Approved' | 'Rejected'>('Pending Review')

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-slate-950 dark:text-white">Subida de comprobante</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This receipt will later be analyzed automatically by AI verification and then reviewed by staff and admin when needed.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(status)}`}>{status}</span>
      </div>
      <label className="mt-6 flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.16),_transparent_55%)] p-6 text-center dark:border-white/10">
        <UploadCloud className="size-8 text-cyan-500" />
        <p className="mt-4 font-medium text-slate-950 dark:text-white">Arrastra o sube el comprobante</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Carga desde movil, camara y preview listos para integrar.</p>
        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white dark:bg-cyan-400 dark:text-slate-950">Seleccionar imagen</span>
          <span className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
            <Camera className="mr-2 inline size-4" />
            Camara
          </span>
        </div>
        <input type="file" className="hidden" />
      </label>
      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/60">
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <div className="h-28 rounded-2xl bg-[linear-gradient(135deg,_rgba(148,163,184,0.22),_rgba(34,211,238,0.18))]" />
          <div>
            <p className="font-medium text-slate-950 dark:text-white">Preview placeholder</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Archivo: recibo-sinpe-abril.jpg • 1.4 MB</p>
          </div>
        </div>
      </div>
    </section>
  )
}
