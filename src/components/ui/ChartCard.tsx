import type { ReactNode } from 'react'

export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
      <div className="mb-6">
        <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}
