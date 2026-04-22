import { clientBookings, reviews } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { RatingStars } from '../../components/ui/RatingStars'

export function ClientReviewsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Escribir una reseña</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Solo puedes reseñar cuidadores con los que ya tengas servicios registrados.
        </p>
        <div className="mt-8 grid gap-4">
          <select className="field">
            <option>Selecciona un cuidador</option>
            {clientBookings.map((booking) => (
              <option key={booking.id}>{booking.caregiverName} • {booking.service}</option>
            ))}
          </select>
          <select className="field">
            <option>Calificación</option>
            <option>5 estrellas</option>
            <option>4 estrellas</option>
            <option>3 estrellas</option>
            <option>2 estrellas</option>
            <option>1 estrella</option>
          </select>
          <textarea className="field min-h-40" placeholder="Describe tu experiencia con el servicio recibido" />
        </div>
        <Button className="mt-6">Publicar reseña</Button>
      </section>
      <section className="space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">{review.author}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{review.caregiverName} • {review.date}</p>
              </div>
              <RatingStars value={review.rating} />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{review.comment}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
