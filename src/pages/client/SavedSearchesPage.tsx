import { savedSearches } from '../../services/mockData'

export function SavedSearchesPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {savedSearches.map((search) => (
        <article key={search.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <h2 className="font-display text-2xl text-slate-950 dark:text-white">{search.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {search.filters.map((filter) => (
              <span key={filter} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{filter}</span>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{search.matches} caregivers matched today</p>
        </article>
      ))}
    </div>
  )
}
