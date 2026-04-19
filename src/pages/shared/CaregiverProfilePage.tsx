import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Caregiver } from '../../types'
import { BookingModal } from '../../features/booking/BookingModal'
import { CalendarCard } from '../../components/ui/CalendarCard'
import { RatingStars } from '../../components/ui/RatingStars'
import { mockApi } from '../../services/api'

export function CaregiverProfilePage() {
  const { slug = '' } = useParams()
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null)

  useEffect(() => {
    mockApi.getCaregiverBySlug(slug).then(setCaregiver)
  }, [slug])

  if (!caregiver) {
    return <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">Cargando perfil...</div>
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[36px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-start gap-6">
            <img src={caregiver.image} alt={caregiver.name} className="size-32 rounded-[32px] object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-5xl text-slate-950 dark:text-white">{caregiver.name}</h1>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  Verificado
                </span>
              </div>
              <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
              <div className="mt-4 flex items-center gap-4">
                <RatingStars value={caregiver.rating} />
                <span className="text-sm text-slate-500 dark:text-slate-400">{caregiver.reviews} resenas</span>
              </div>
            </div>
          </div>
          <p className="mt-8 text-base leading-8 text-slate-600 dark:text-slate-300">{caregiver.about}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {caregiver.certifications.map((certification) => (
              <span key={certification} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
                {certification}
              </span>
            ))}
          </div>
        </article>
        <div className="space-y-6">
          <CalendarCard days={caregiver.availability} />
          <div className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Tarifa</p>
            <p className="mt-2 font-display text-5xl text-slate-950 dark:text-white">${caregiver.pricePerHour}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">por hora</p>
            <div className="mt-6">
              <BookingModal caregiverName={caregiver.name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
