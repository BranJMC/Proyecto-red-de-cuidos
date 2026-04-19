import { reviews } from '../../services/mockData'
import { RatingStars } from '../../components/ui/RatingStars'

export function ReviewsPage() {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
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
      ))}
    </div>
  )
}
