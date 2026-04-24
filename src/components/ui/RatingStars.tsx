export function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index + 1 <= Math.round(value) ? 'opacity-100' : 'opacity-30'}>
          ★
        </span>
      ))}
    </div>
  )
}
