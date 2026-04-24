export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-white/10 dark:bg-slate-900/60">
      <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
