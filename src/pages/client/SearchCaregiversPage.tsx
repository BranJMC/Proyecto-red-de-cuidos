import { Clock3, Heart, ShieldCheck, Siren } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BookingModal } from '../../features/booking/BookingModal'
import { SearchFilters } from '../../components/ui/SearchFilters'
import { RatingStars } from '../../components/ui/RatingStars'
import { caregivers } from '../../services/mockData'
import { useAppStore } from '../../store/useAppStore'
import { currency } from '../../utils/helpers'

export function SearchCaregiversPage() {
  const favorites = useAppStore((state) => state.favorites)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

  return (
    <div className="space-y-6">
      <SearchFilters />
      <div className="grid gap-5">
        {caregivers.map((caregiver) => (
          <article key={caregiver.id} className="grid gap-6 rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 md:grid-cols-[220px_1fr] dark:shadow-none">
            <img src={caregiver.image} alt={caregiver.name} className="h-full min-h-64 w-full rounded-[28px] object-cover" />
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-display text-3xl text-slate-950 dark:text-white">{caregiver.name}</h2>
                    {caregiver.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        Verificado
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{caregiver.specialty} • {caregiver.city}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(caregiver.id)}
                  className="rounded-full bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Heart className={`size-5 ${favorites.includes(caregiver.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{caregiver.about}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>{caregiver.province} • {caregiver.city} • {caregiver.neighborhood}</span>
                <span>{currency(caregiver.pricePerHour)}/hora</span>
                <span>{caregiver.experienceYears} anos experiencia</span>
                <span>{caregiver.languages.join(', ')}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {caregiver.serviceTypes.map((service) => (
                  <span key={service} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {service}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Clock3 className="size-4" />
                    <span className="text-xs uppercase tracking-[0.18em]">Horario</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{caregiver.workingHours.join(' • ')}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="size-4" />
                    <span className="text-xs uppercase tracking-[0.18em]">Cobertura</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{caregiver.zones.join(', ')}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Siren className="size-4" />
                    <span className="text-xs uppercase tracking-[0.18em]">Urgencia</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                    {caregiver.availableNow ? 'Disponible ahora' : caregiver.availableToday ? 'Disponible hoy' : 'Bajo reserva'}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <RatingStars value={caregiver.rating} />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{caregiver.reviews} resenas</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/caregivers/${caregiver.slug}`} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200">
                    Ver perfil
                  </Link>
                  <BookingModal caregiverName={caregiver.name} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
