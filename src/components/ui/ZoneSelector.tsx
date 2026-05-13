import { MapPinned } from 'lucide-react'
import { useMemo } from 'react'
import type { Zone } from '../../types'

export function ZoneSelector({
  zones,
  selectedZoneIds,
  onChange,
}: {
  zones: Zone[]
  selectedZoneIds: string[]
  onChange: (zoneIds: string[]) => void
}) {
  const provinces = useMemo(() => [...new Set(zones.map((zone) => zone.province))].sort(), [zones])

  const selectedProvinces = useMemo(
    () =>
      provinces.filter((province) => {
        const provinceZoneIds = zones.filter((zone) => zone.province === province).map((zone) => zone.id)
        return provinceZoneIds.length > 0 && provinceZoneIds.every((id) => selectedZoneIds.includes(id))
      }),
    [provinces, selectedZoneIds, zones],
  )

  const availableCities = useMemo(
    () =>
      [...new Set(
        zones
          .filter((zone) => !selectedProvinces.length || selectedProvinces.includes(zone.province))
          .map((zone) => zone.city),
      )].sort(),
    [selectedProvinces, zones],
  )

  const selectedCities = useMemo(
    () =>
      availableCities.filter((city) => {
        const cityZoneIds = zones
          .filter((zone) => zone.city === city && (!selectedProvinces.length || selectedProvinces.includes(zone.province)))
          .map((zone) => zone.id)
        return cityZoneIds.length > 0 && cityZoneIds.every((id) => selectedZoneIds.includes(id))
      }),
    [availableCities, selectedProvinces, selectedZoneIds, zones],
  )

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
          <MapPinned className="size-5" />
        </div>
        <div>
          <h3 className="font-display text-xl text-slate-950 dark:text-white">Tarifas y zonas</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Selecciona provincias y cantones donde quieres ofrecer tu servicio.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-800/60">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-display text-lg text-slate-950 dark:text-white">Provincias</h4>
            <button
              type="button"
              onClick={() => onChange(zones.map((zone) => zone.id))}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300"
            >
              Todas las provincias
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {provinces.map((province) => {
              const provinceZoneIds = zones.filter((zone) => zone.province === province).map((zone) => zone.id)
              return (
                <label key={province} className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <input
                    type="checkbox"
                    className="mr-2 size-4 accent-cyan-500"
                    checked={selectedProvinces.includes(province)}
                    onChange={(event) =>
                      onChange(
                        event.target.checked
                          ? [...new Set([...selectedZoneIds, ...provinceZoneIds])]
                          : selectedZoneIds.filter((id) => !provinceZoneIds.includes(id)),
                      )
                    }
                  />
                  {province}
                </label>
              )
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-800/60">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-display text-lg text-slate-950 dark:text-white">Cantones</h4>
            <button
              type="button"
              onClick={() =>
                onChange([
                  ...new Set([
                    ...selectedZoneIds,
                    ...zones
                      .filter((zone) => !selectedProvinces.length || selectedProvinces.includes(zone.province))
                      .map((zone) => zone.id),
                  ]),
                ])
              }
              className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300"
            >
              Todos los cantones
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {availableCities.map((city) => {
              const cityZoneIds = zones
                .filter((zone) => zone.city === city && (!selectedProvinces.length || selectedProvinces.includes(zone.province)))
                .map((zone) => zone.id)
              return (
                <label key={city} className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <input
                    type="checkbox"
                    className="mr-2 size-4 accent-cyan-500"
                    checked={selectedCities.includes(city)}
                    onChange={(event) =>
                      onChange(
                        event.target.checked
                          ? [...new Set([...selectedZoneIds, ...cityZoneIds])]
                          : selectedZoneIds.filter((id) => !cityZoneIds.includes(id)),
                      )
                    }
                  />
                  {city}
                </label>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
