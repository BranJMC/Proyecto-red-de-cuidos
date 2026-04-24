export function TestimonialsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-slate-950 dark:text-white">Testimonials</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ['“Es la primera vez que contratar cuidado se siente premium.”', 'Familia Gutierrez'],
          ['“El onboarding transmite seriedad real.”', 'Monica Arias'],
          ['“El panel admin parece listo para operar mañana.”', 'Investor demo'],
        ].map(([quote, author]) => (
          <article key={author} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">{quote}</p>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{author}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
