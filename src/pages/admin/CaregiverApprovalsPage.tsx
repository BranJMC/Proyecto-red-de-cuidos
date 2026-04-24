import { approvalDossiers, caregivers } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { statusTone } from '../../utils/helpers'

export function CaregiverApprovalsPage() {
  return (
    <div className="space-y-4">
      {approvalDossiers.map((dossier) => {
        const caregiver = caregivers.find((item) => item.id === dossier.caregiverId)
        if (!caregiver) return null

        return (
          <article key={caregiver.id} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-start gap-5">
              <img src={caregiver.image} alt={caregiver.name} className="size-20 rounded-[24px] object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-3xl text-slate-950 dark:text-white">{caregiver.name}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(dossier.aiDecision)}`}>
                    AI: {dossier.aiDecision}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Confianza {Math.round(dossier.aiConfidence * 100)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{dossier.aiSummary}</p>
                <div className="mt-5 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Pasos del cuidador</p>
                    <div className="mt-3 space-y-2">
                      {dossier.stepStatuses.map((step) => (
                        <div key={step.id} className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-950 dark:text-white">{step.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Documentos y filtros AI</p>
                    <div className="mt-3 space-y-2">
                      {dossier.documents.map((document) => (
                        <p key={document} className="text-sm text-slate-700 dark:text-slate-200">{document}</p>
                      ))}
                      <div className="pt-2">
                        {dossier.flags.map((flag) => (
                          <span key={flag} className="mr-2 mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>Aprobar</Button>
                <Button variant="secondary">Rechazar</Button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
