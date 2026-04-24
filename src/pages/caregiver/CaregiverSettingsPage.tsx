import { caregivers, zones } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { AvailabilityScheduler } from '../../components/ui/AvailabilityScheduler'
import { ZoneSelector } from '../../components/ui/ZoneSelector'

export function CaregiverSettingsPage() {
  const profile = caregivers[2]

  return (
    <div className="grid gap-5">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Tariff management</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Base hourly rate</label>
            <input className="field" defaultValue={profile.pricePerHour} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Night shift extra fee</label>
            <input className="field" defaultValue={profile.nightShiftFee} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Weekend extra fee</label>
            <input className="field" defaultValue={profile.weekendFee} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Emergency service fee</label>
            <input className="field" defaultValue={profile.emergencyFee} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Provincia principal</label>
            <select className="field" defaultValue={profile.province}>
              {[...new Set(zones.map((zone) => zone.province))].map((province) => (
                <option key={province}>{province}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Zona de referencia</label>
            <input className="field" defaultValue={`${profile.city} • ${profile.neighborhood}`} />
          </div>
        </div>
        <textarea className="field mt-4 min-h-32" defaultValue="Perfil profesional premium para atraer mejores reservas, turnos de emergencia y familias recurrentes." />
        <Button className="mt-6">Guardar configuracion</Button>
      </section>
      <ZoneSelector zones={zones.filter((zone) => zone.province === profile.province)} />
      <AvailabilityScheduler />
    </div>
  )
}
