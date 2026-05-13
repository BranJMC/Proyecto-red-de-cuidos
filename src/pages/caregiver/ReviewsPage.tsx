import { useEffect, useState } from 'react'
import { RatingStars } from '../../components/ui/RatingStars'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Review } from '../../types'

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    mockApi.getReviews().then((items) => {
      setReviews(items.filter((review) => review.caregiverName === user.name))
    })
  }, [user.name])

  return (
    <div className="space-y-4">
      {reviews.length ? reviews.map((review) => (
        <article key={review.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">{review.author}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{review.date}</p>
            </div>
            <RatingStars value={review.rating} />
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{review.comment}</p>
        </article>
      )) : (
        <article className="rounded-[32px] border border-slate-200 bg-white/85 p-8 text-center dark:border-white/10 dark:bg-slate-900/70">
          <h2 className="font-display text-3xl text-slate-950 dark:text-white">Todavia no tienes resenas</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Cuando completes servicios y los clientes califiquen su experiencia, aqui apareceran tus resenas.
          </p>
        </article>
      )}
    </div>
  )
}
