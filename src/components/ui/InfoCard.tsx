import type { ReactNode } from 'react'

export function InfoCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <article className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-lg shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-5 inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
        {icon}
      </div>
      <h3 className="font-display text-xl text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  )
}
