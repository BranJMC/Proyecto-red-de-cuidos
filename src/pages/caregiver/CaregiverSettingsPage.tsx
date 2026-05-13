import { useEffect, useMemo, useState } from 'react'
import { Clock3, Coins, MapPinned, Save } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ZoneSelector } from '../../components/ui/ZoneSelector'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { CaregiverWorkingHour, Zone } from '../../types'

const weekDays = [
  { dayOfWeek: 1, label: 'Lunes' },
  { dayOfWeek: 2, label: 'Martes' },
  { dayOfWeek: 3, label: 'Miercoles' },
  { dayOfWeek: 4, label: 'Jueves' },
  { dayOfWeek: 5, label: 'Viernes' },
  { dayOfWeek: 6, label: 'Sabado' },
  { dayOfWeek: 0, label: 'Domingo' },
]

function normalizeWorkingHours(items: CaregiverWorkingHour[]) {
  return weekDays.map(({ dayOfWeek }) => {
    const existing = items.find((entry) => entry.dayOfWeek === dayOfWeek)
    return (
      existing ?? {
        dayOfWeek,
        active: false,
        startTime: '08:00',
        endTime: '17:00',
      }
    )
  })
}

export function CaregiverSettingsPage() {
  const user = useAppStore((state) => state.user)
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pricePerHour, setPricePerHour] = useState('24')
  const [nightShiftFee, setNightShiftFee] = useState('0')
  const [weekendFee, setWeekendFee] = useState('0')
  const [emergencyFee, setEmergencyFee] = useState('0')
  const [about, setAbout] = useState('')
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([])
  const [workingHours, setWorkingHours] = useState<CaregiverWorkingHour[]>(normalizeWorkingHours([]))

  useEffect(() => {
    if (!user.id) {
      return
    }

    let active = true
    Promise.all([
      mockApi.getCaregiverProfileById(user.id),
      mockApi.getZones(),
      mockApi.getCaregiverServiceZones(user.id),
      mockApi.getCaregiverWorkingHours(user.id),
    ])
      .then(([profile, zonesResponse, zoneIds, workingHoursResponse]) => {
        if (!active) {
          return
        }

        setPricePerHour(String(profile.pricePerHour ?? 24))
        setNightShiftFee(String(profile.nightShiftFee ?? 0))
        setWeekendFee(String(profile.weekendFee ?? 0))
        setEmergencyFee(String(profile.emergencyFee ?? 0))
        setAbout(profile.about ?? '')
        setZones(zonesResponse)
        setSelectedZoneIds(zoneIds)
        setWorkingHours(normalizeWorkingHours(workingHoursResponse))
      })
      .catch(() => {
        if (active) {
          toast.error('No se pudo cargar', 'No fue posible traer tu configuracion de servicio.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [toast, user.id])

  const selectedZoneSummary = useMemo(() => {
    if (!selectedZoneIds.length) {
      return 'Todavia no has seleccionado provincias ni cantones.'
    }

    const selected = zones.filter((zone) => selectedZoneIds.includes(zone.id))
    const provinces = [...new Set(selected.map((zone) => zone.province))]
    const cities = [...new Set(selected.map((zone) => zone.city))]
    return `${provinces.length} provincias y ${cities.length} cantones activos para ofrecer el servicio.`
  }, [selectedZoneIds, zones])

  async function handleSave() {
    if (!user.id) {
      return
    }

    setSaving(true)
    try {
      await Promise.all([
        mockApi.updateCaregiverProfile(user.id, {
          pricePerHour: Number(pricePerHour) || 0,
          nightShiftFee: Number(nightShiftFee) || 0,
          weekendFee: Number(weekendFee) || 0,
          emergencyFee: Number(emergencyFee) || 0,
          about,
        }),
        mockApi.updateCaregiverServiceZones(user.id, selectedZoneIds),
        mockApi.updateCaregiverWorkingHours(user.id, workingHours),
      ])

      toast.success('Tarifas y zonas guardadas', 'Tu configuracion de servicio ya quedo actualizada.')
    } catch {
      toast.error('No se pudo guardar', 'Revisa los datos e intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Tarifas y zonas</p>
            <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Configura cuanto cobras y donde trabajas</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Aqui dejas listo tu precio, tus extras, tus provincias, tus cantones y tu jornada operativa para que el sistema calcule capacidad y muestre bien tu servicio.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            <Save className="size-4" />
            {saving ? 'Guardando...' : 'Guardar configuracion'}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Coins className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Tarifas operativas</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Estas tarifas se usan para calcular el precio sugerido de cada reserva.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Tarifa base por hora</p>
              <input className="field" value={pricePerHour} onChange={(event) => setPricePerHour(event.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Extra nocturno</p>
              <input className="field" value={nightShiftFee} onChange={(event) => setNightShiftFee(event.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Extra fin de semana</p>
              <input className="field" value={weekendFee} onChange={(event) => setWeekendFee(event.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Extra por emergencia</p>
              <input className="field" value={emergencyFee} onChange={(event) => setEmergencyFee(event.target.value)} />
            </div>
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Descripcion corta del servicio</p>
              <textarea
                className="field min-h-36"
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                placeholder="Describe tu experiencia, tipo de acompanamiento, poblaciones que atiendes y fortalezas."
              />
            </div>
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              <MapPinned className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Cobertura activa</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedZoneSummary}</p>
            </div>
          </div>

          <div className="mt-6">
            <ZoneSelector zones={zones} selectedZoneIds={selectedZoneIds} onChange={setSelectedZoneIds} />
          </div>
        </article>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-50 p-3 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
            <Clock3 className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">Horario disponible</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tu calendario compara estas horas contra las reservas pendientes y confirmadas.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {weekDays.map(({ dayOfWeek, label }) => {
            const item = workingHours.find((entry) => entry.dayOfWeek === dayOfWeek) ?? {
              dayOfWeek,
              active: false,
              startTime: '08:00',
              endTime: '17:00',
            }

            return (
              <div key={dayOfWeek} className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-slate-950 dark:text-white">{label}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.active ? 'Disponible para recibir reservas.' : 'No disponible ese dia.'}</p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={item.active}
                      className="size-4 accent-cyan-500"
                      onChange={(event) =>
                        setWorkingHours((current) =>
                          current.map((entry) =>
                            entry.dayOfWeek === dayOfWeek ? { ...entry, active: event.target.checked } : entry,
                          ),
                        )
                      }
                    />
                    Activo
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Inicio</p>
                    <input
                      type="time"
                      className="field"
                      value={item.startTime}
                      disabled={!item.active}
                      onChange={(event) =>
                        setWorkingHours((current) =>
                          current.map((entry) =>
                            entry.dayOfWeek === dayOfWeek ? { ...entry, startTime: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Fin</p>
                    <input
                      type="time"
                      className="field"
                      value={item.endTime}
                      disabled={!item.active}
                      onChange={(event) =>
                        setWorkingHours((current) =>
                          current.map((entry) =>
                            entry.dayOfWeek === dayOfWeek ? { ...entry, endTime: event.target.value } : entry,
                          ),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
