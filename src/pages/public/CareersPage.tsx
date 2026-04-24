export function CareersPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-slate-950 dark:text-white">Careers</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {['Frontend Engineer', 'Trust & Safety Lead', 'Care Operations Manager'].map((role) => (
          <article key={role} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">{role}</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">San Jose / Hybrid · Full-time</p>
          </article>
        ))}
      </div>
    </section>
  )
}
