import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import { mockApi } from '../../services/api'
import type { Zone } from '../../types'
import { Button } from './Button'

export function SearchFilters({
  selectedProvinces,
  selectedCities,
  onChange,
}: {
  selectedProvinces: string[]
  selectedCities: string[]
  onChange: (payload: { provinces: string[]; cities: string[] }) => void
}) {
  const [zones, setZones] = useState<Zone[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    mockApi.getZones().then(setZones)
  }, [])

  const provinces = useMemo(() => [...new Set(zones.map((zone) => zone.province))].sort(), [zones])
  const availableCities = useMemo(
    () =>
      [...new Set(
        zones
          .filter((zone) => !selectedProvinces.length || selectedProvinces.includes(zone.province))
          .map((zone) => zone.city),
      )].sort(),
    [selectedProvinces, zones],
  )

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Filtros de ubicacion</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filtra por provincias y cantones antes de elegir cuidador.</p>
        </div>
        <Button variant="secondary" onClick={() => setOpen((value) => !value)}>
          <Filter className="mr-2 size-4" />
          {open ? 'Ocultar filtros' : 'Filtrar ubicacion'}
        </Button>
      </div>

      {open ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-800/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-slate-950 dark:text-white">Provincias</h3>
              <button
                type="button"
                onClick={() => onChange({ provinces: provinces, cities: [] })}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300"
              >
                Todas las provincias
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {provinces.map((province) => (
                <label key={province} className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <input
                    type="checkbox"
                    className="mr-2 size-4 accent-cyan-500"
                    checked={selectedProvinces.includes(province)}
                    onChange={(event) =>
                      onChange({
                        provinces: event.target.checked
                          ? [...new Set([...selectedProvinces, province])]
                          : selectedProvinces.filter((item) => item !== province),
                        cities: selectedCities.filter((city) =>
                          zones.some((zone) => zone.city === city && (event.target.checked ? true : zone.province !== province)),
                        ),
                      })
                    }
                  />
                  {province}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-800/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-slate-950 dark:text-white">Cantones</h3>
              <button
                type="button"
                onClick={() => onChange({ provinces: selectedProvinces, cities: availableCities })}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300"
              >
                Todos los cantones
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {availableCities.map((city) => (
                <label key={city} className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <input
                    type="checkbox"
                    className="mr-2 size-4 accent-cyan-500"
                    checked={selectedCities.includes(city)}
                    onChange={(event) =>
                      onChange({
                        provinces: selectedProvinces,
                        cities: event.target.checked
                          ? [...new Set([...selectedCities, city])]
                          : selectedCities.filter((item) => item !== city),
                      })
                    }
                  />
                  {city}
                </label>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => setOpen(false)}>Aplicar filtros</Button>
        <Button variant="secondary" onClick={() => onChange({ provinces: [], cities: [] })}>Limpiar filtros</Button>
      </div>
    </div>
  )
}
