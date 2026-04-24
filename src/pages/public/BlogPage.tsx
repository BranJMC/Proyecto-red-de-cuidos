export function BlogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-slate-950 dark:text-white">Blog & news</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ['Como evaluar cuidadores de noche', 'Trust & Safety'],
          ['El futuro del cuidado asistido por operaciones', 'Ops'],
          ['Por que subir comprobantes mejora la confianza', 'Payments'],
        ].map(([title, tag]) => (
          <article key={title} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">{tag}</p>
            <h2 className="mt-3 font-display text-2xl text-slate-950 dark:text-white">{title}</h2>
          </article>
        ))}
      </div>
    </section>
  )
}
