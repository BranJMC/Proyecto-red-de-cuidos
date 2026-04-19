import { caregivers } from '../../services/mockData'
import { Button } from '../../components/ui/Button'

export function CaregiverApprovalsPage() {
  return (
    <div className="space-y-4">
      {caregivers.map((caregiver) => (
        <article key={caregiver.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center gap-5">
            <img src={caregiver.image} alt={caregiver.name} className="size-20 rounded-[24px] object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-3xl text-slate-950 dark:text-white">{caregiver.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
            </div>
            <div className="flex gap-3">
              <Button>Aprobar</Button>
              <Button variant="secondary">Rechazar</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
