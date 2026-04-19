import { caregivers } from '../../services/mockData'
import { useAppStore } from '../../store/useAppStore'
import { EmptyState } from '../../components/ui/EmptyState'

export function FavoritesPage() {
  const favorites = useAppStore((state) => state.favorites)
  const items = caregivers.filter((caregiver) => favorites.includes(caregiver.id))

  if (!items.length) {
    return <EmptyState title="Sin favoritos" description="Guarda perfiles destacados para reservar mas rapido." />
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((caregiver) => (
        <div key={caregiver.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <img src={caregiver.image} alt={caregiver.name} className="h-56 w-full rounded-[24px] object-cover" />
          <h2 className="mt-5 font-display text-3xl text-slate-950 dark:text-white">{caregiver.name}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
        </div>
      ))}
    </div>
  )
}
