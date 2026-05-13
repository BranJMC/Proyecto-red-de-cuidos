import { useEffect, useMemo, useState } from 'react'
import { Heart, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BookingModal } from '../../features/booking/BookingModal'
import { SearchFilters } from '../../components/ui/SearchFilters'
import { RatingStars } from '../../components/ui/RatingStars'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Caregiver } from '../../types'
import { currency } from '../../utils/helpers'

export function SearchCaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const favorites = useAppStore((state) => state.favorites)
  const user = useAppStore((state) => state.user)
  const setFavorites = useAppStore((state) => state.setFavorites)
  const toggleFavoriteLocal = useAppStore((state) => state.toggleFavorite)
  const toast = useToast()

  useEffect(() => {
    mockApi.getCaregivers().then(setCaregivers)
  }, [])

  useEffect(() => {
    if (!user.id || user.role !== 'client') {
      return
    }

    mockApi.getFavorites(user.id).then(setFavorites)
  }, [setFavorites, user.id, user.role])

  const publicCaregivers = useMemo(
    () =>
      caregivers
        .filter(
          (caregiver) =>
            caregiver.verified &&
            (!selectedProvinces.length || selectedProvinces.includes(caregiver.province)) &&
            (!selectedCities.length || selectedCities.includes(caregiver.city)),
        )
        .sort((left, right) => {
          // Los favoritos suben al inicio para que el cliente vea primero los perfiles que ya marco como prioritarios.
          const leftFavorite = favorites.includes(left.id) ? 1 : 0
          const rightFavorite = favorites.includes(right.id) ? 1 : 0
          if (leftFavorite !== rightFavorite) {
            return rightFavorite - leftFavorite
          }

          return right.rating - left.rating
        }),
    [caregivers, favorites, selectedCities, selectedProvinces],
  )

  async function toggleFavorite(caregiverId: string) {
    if (!user.id || user.role !== 'client') {
      toggleFavoriteLocal(caregiverId)
      return
    }

    try {
      const response = await mockApi.toggleFavorite(user.id, caregiverId)
      setFavorites(
        response.favorite
          ? [...new Set([...favorites, caregiverId])]
          : favorites.filter((id) => id !== caregiverId),
      )
    } catch {
      toast.error('No se pudo guardar', 'El favorito no pudo sincronizarse con la base de datos.')
    }
  }

  return (
    <div className="space-y-6">
      <SearchFilters
        selectedProvinces={selectedProvinces}
        selectedCities={selectedCities}
        onChange={({ provinces, cities }) => {
          setSelectedProvinces(provinces)
          setSelectedCities(cities)
        }}
      />
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Directorio verificado</p>
            <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Encuentra un cuidador que encaje con tu familia</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Dejamos una vista mas compacta para comparar mejor foto, nombre, descripcion y disponibilidad sin perder espacio. Los favoritos aparecen primero.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            {publicCaregivers.length} cuidadores listos para reservar
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {publicCaregivers.map((caregiver) => (
          <article
            key={caregiver.id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-lg shadow-slate-200/30 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none"
          >
            <div className="relative">
              <img src={caregiver.image} alt={caregiver.name} className="h-48 w-full object-cover" />
              <button
                onClick={() => toggleFavorite(caregiver.id)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-slate-600 shadow-sm dark:bg-slate-950/85 dark:text-slate-200"
              >
                <Heart className={`size-5 ${favorites.includes(caregiver.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">
                  {currency(caregiver.pricePerHour)}/hora
                </span>
                {caregiver.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <ShieldCheck className="size-3.5" />
                    Verificado
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-[1.6rem] text-slate-950 dark:text-white">{caregiver.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {caregiver.rank}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="size-4 text-cyan-500" />
                  {caregiver.city}, {caregiver.neighborhood}
                </div>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{caregiver.about}</p>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <RatingStars value={caregiver.rating} />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{caregiver.reviews} resenas</p>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  {caregiver.availableNow ? 'Disponible ahora' : caregiver.availableToday ? 'Disponible hoy' : 'Con agenda'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {caregiver.serviceTypes.slice(0, 2).map((service) => (
                  <span key={service} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Sparkles className="size-3.5" />
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={`/caregivers/${caregiver.slug}`}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  Ver perfil
                </Link>
                <BookingModal caregiverId={caregiver.id} caregiverName={caregiver.name} serviceType={caregiver.serviceTypes[0] ?? 'Cuidado general'} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
