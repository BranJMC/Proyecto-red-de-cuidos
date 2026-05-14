import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { RatingStars } from '../../components/ui/RatingStars'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { Booking, Review } from '../../types'
import { serviceLabel } from '../../utils/helpers'

export function ClientReviewsPage() {
  const [clientBookings, setClientBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getBookingsByUser(user.id, 'client').then(setClientBookings)
    mockApi.getReviews().then(setReviews)
  }, [user.id])

  async function publishReview() {
    const booking = clientBookings.find((item) => item.id === selectedBookingId)
    if (!booking || !user.id || !comment.trim()) {
      toast.error('Faltan datos', 'Selecciona una reserva y escribe tu comentario antes de publicar.')
      return
    }

    await mockApi.createReview({
      bookingId: booking.id,
      clientId: user.id,
      caregiverId: booking.caregiverId,
      rating,
      comment,
    })
    setReviews(await mockApi.getReviews())
    setComment('')
    toast.success('Resena publicada', 'Tu resena ya quedo guardada en la base de datos.')
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Escribir una resena</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Solo puedes resenar cuidadores con los que ya tengas servicios registrados.
        </p>
        <div className="mt-8 grid gap-4">
          <select className="field" value={selectedBookingId} onChange={(event) => setSelectedBookingId(event.target.value)}>
            <option value="">Selecciona un cuidador</option>
            {clientBookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.caregiverName} • {serviceLabel(booking.service)}
              </option>
            ))}
          </select>
          <select className="field" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            <option value={5}>5 estrellas</option>
            <option value={4}>4 estrellas</option>
            <option value={3}>3 estrellas</option>
            <option value={2}>2 estrellas</option>
            <option value={1}>1 estrella</option>
          </select>
          <textarea
            className="field min-h-40"
            placeholder="Describe tu experiencia con el servicio recibido"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <Button className="mt-6" onClick={publishReview}>Publicar resena</Button>
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
