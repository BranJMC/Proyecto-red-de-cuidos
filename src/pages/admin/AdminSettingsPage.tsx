import { backupRecords } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { statusTone } from '../../utils/helpers'

export function AdminSettingsPage() {
  return (
    <div className="grid gap-5">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Configuracion de plataforma</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <input className="field" defaultValue="SLA verificacion: 6h" />
          <input className="field" defaultValue="Soporte premium activo" />
          <input className="field" defaultValue="Revision AI para comprobantes: enabled" />
          <input className="field" defaultValue="Push notifications enabled" />
        </div>
        <Button className="mt-6">Guardar cambios</Button>
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Backup diario de actividad</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Respaldo diario de mensajes, bookings, aprobaciones, comprobantes y actividad operativa.
            </p>
          </div>
          <Button>Generar backup manual</Button>
        </div>
        <div className="mt-6 space-y-3">
          {backupRecords.map((record) => (
            <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <div>
                <p className="font-medium text-slate-950 dark:text-white">{record.scope}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {record.generatedAt} • {record.size}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(record.status)}`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
