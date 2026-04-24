import { MapPinned } from 'lucide-react'
import type { Zone } from '../../types'

export function ZoneSelector({ zones }: { zones: Zone[] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
          <MapPinned className="size-5" />
        </div>
        <div>
          <h3 className="font-display text-xl text-slate-950 dark:text-white">Zonas de servicio</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Selecciona ciudades y barrios cubiertos.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {zones.map((zone) => (
          <label key={zone.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-800/60">
            <div>
              <p className="text-sm font-medium text-slate-950 dark:text-white">{zone.neighborhood}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{zone.city}</p>
            </div>
            <input type="checkbox" className="size-4 accent-cyan-500" defaultChecked={zone.activeCaregivers > 15} />
          </label>
        ))}
      </div>
    </div>
  )
}
