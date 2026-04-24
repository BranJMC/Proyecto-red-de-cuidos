import { zones } from '../../services/mockData'
import { Button } from './Button'

export function SearchFilters() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select className="field">
          {zones.map((zone) => (
            <option key={zone.id}>{zone.province} • {zone.city} • {zone.neighborhood}</option>
          ))}
        </select>
        <select className="field">
          <option>$15 - $20 / h</option>
          <option>$20 - $30 / h</option>
        </select>
        <select className="field">
          <option>4.5+ estrellas</option>
          <option>4.8+ estrellas</option>
        </select>
        <select className="field">
          <option>Service type</option>
          <option>Child care</option>
          <option>Elder care</option>
          <option>Emergency care</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Available today', 'Available now', 'Verified only', 'Night shift', 'Weekend', 'Emergency', 'Bilingual', '5+ years'].map((filter) => (
          <label key={filter} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-300">
            <input type="checkbox" className="mr-2 size-4 accent-cyan-500" defaultChecked={filter === 'Verified only'} />
            {filter}
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button>Aplicar filtros</Button>
        <Button variant="secondary">Guardar busqueda</Button>
      </div>
    </div>
  )
}
