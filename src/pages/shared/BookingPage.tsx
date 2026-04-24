import { Heart, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { caregivers, reviews } from '../../services/mockData'
import { useAppStore } from '../../store/useAppStore'
import { RatingStars } from '../../components/ui/RatingStars'

export function BookingPage() {
  const favorites = useAppStore((state) => state.favorites)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Reservar servicio</p>
        <h1 className="mt-3 font-display text-5xl text-slate-950 dark:text-white">Elige primero a tu cuidador ideal.</h1>
        <p className="mt-4 text-base leading-8 text-slate-500 dark:text-slate-400">
          Explora perfiles como si fuera una red social profesional: foto, experiencia, reseñas, rango y zonas. Cuando entres a una ficha podrás reservar directamente.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {caregivers.map((caregiver) => {
          const caregiverReviews = reviews.filter((review) => review.caregiverName === caregiver.name).slice(0, 2)
          return (
            <article key={caregiver.id} className="rounded-[34px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
              <div className="flex items-start gap-5">
                <img src={caregiver.image} alt={caregiver.name} className="size-28 rounded-[28px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-3xl text-slate-950 dark:text-white">{caregiver.name}</h2>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                      {caregiver.rank}
                    </span>
                    {caregiver.verified ? (
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">
                        Verificado
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {caregiver.specialty} • {caregiver.province} • {caregiver.city}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <RatingStars value={caregiver.rating} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {caregiver.reviews} reseñas • {caregiver.serviceCount} servicios
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{caregiver.about}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(caregiver.id)}
                  className="rounded-full bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Heart className={`size-5 ${favorites.includes(caregiver.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Precio</p>
                  <p className="mt-2 text-sm text-slate-950 dark:text-white">${caregiver.pricePerHour}/hora</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Cobertura</p>
                  <p className="mt-2 text-sm text-slate-950 dark:text-white">{caregiver.zones.join(', ')}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Disponibilidad</p>
                  <p className="mt-2 text-sm text-slate-950 dark:text-white">{caregiver.availableToday ? 'Disponible hoy' : 'Bajo reserva'}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-800/40">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="size-4 text-cyan-500" />
                  Reseñas destacadas
                </div>
                <div className="space-y-3">
                  {caregiverReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-900/70">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-950 dark:text-white">{review.author}</p>
                        <RatingStars value={review.rating} />
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={`/caregivers/${caregiver.slug}`}
                  className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                  Ver card completa y reservar
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
