import { ArrowLeft, FileBadge2, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookingWizard } from '../../components/ui/BookingWizard'
import { RatingStars } from '../../components/ui/RatingStars'
import { mockApi } from '../../services/api'
import type { ApprovalDossier, Caregiver } from '../../types'
import { aiDecisionLabel, serviceLabel } from '../../utils/helpers'

export function CaregiverProfilePage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null)
  const [approvalDossiers, setApprovalDossiers] = useState<ApprovalDossier[]>([])

  useEffect(() => {
    mockApi.getCaregiverBySlug(slug).then(setCaregiver)
    mockApi.getApprovalDossiers().then(setApprovalDossiers)
  }, [slug])

  const caregiverDossier = useMemo(
    () => approvalDossiers.find((dossier) => dossier.caregiverId === caregiver?.id),
    [approvalDossiers, caregiver?.id],
  )

  if (!caregiver) {
    return <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">Cargando perfil...</div>
  }

  return (
    <section className="mx-auto max-w-[1520px] px-4 py-16 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-200"
      >
        <ArrowLeft className="size-4" />
        Volver a los cuidadores
      </button>
      <div className="grid gap-6 2xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <article className="overflow-hidden rounded-[38px] border border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
            <div className="bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_38%),linear-gradient(135deg,_rgba(15,23,42,0.02),_rgba(15,23,42,0.08))] p-7 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-start gap-5">
                  <img
                    src={caregiver.image}
                    alt={caregiver.name}
                    className="size-28 rounded-[30px] object-cover ring-4 ring-white/70 dark:ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-display text-4xl text-slate-950 dark:text-white">{caregiver.name}</h1>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        Verificado
                      </span>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">
                        {caregiver.rank}
                      </span>
                    </div>
                    <p className="mt-2 text-base text-slate-500 dark:text-slate-400">{caregiver.specialty}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4 text-cyan-500" />
                        {caregiver.city}, {caregiver.neighborhood}
                      </span>
                      <span>{caregiver.experienceYears} anos de experiencia</span>
                      <span>{caregiver.serviceCount} servicios</span>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <RatingStars value={caregiver.rating} />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{caregiver.reviews} resenas</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{caregiver.about}</p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Tarifa</p>
                    <p className="mt-2 font-display text-3xl text-slate-950 dark:text-white">${caregiver.pricePerHour}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">por hora</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Cobertura</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{caregiver.zones.slice(0, 3).join(' | ')}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Modalidades</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {caregiver.serviceTypes.slice(0, 3).map((service) => serviceLabel(service)).join(' | ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section className="rounded-[36px] border border-slate-200 bg-white/90 p-7 shadow-xl shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/80 dark:shadow-none">
            <div className="flex items-center gap-3">
              <FileBadge2 className="size-5 text-cyan-500" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Perfil profesional</p>
                <h2 className="mt-1 font-display text-3xl text-slate-950 dark:text-white">Confianza y respaldo</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">Certificaciones</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {caregiver.certifications.map((certification) => (
                    <span
                      key={certification}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {certification}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">Idiomas y horarios</p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {caregiver.languages.join(' | ')}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {caregiver.workingDays.join(' | ')} | {caregiver.workingHours.join(' | ')}
                </p>
              </div>
            </div>

            {caregiverDossier ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                  <div className="flex flex-wrap items-center gap-3">
                    <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-300" />
                    <p className="font-medium text-emerald-800 dark:text-emerald-200">
                      Revision automatica: {aiDecisionLabel(caregiverDossier.aiDecision)} | confianza {(caregiverDossier.aiConfidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-700 dark:text-emerald-200">{caregiverDossier.aiSummary}</p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-cyan-500" />
                    <h3 className="font-display text-xl text-slate-950 dark:text-white">Checklist visible para la reserva</h3>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {caregiverDossier.documents.map((document) => (
                      <div
                        key={document}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <span>{document}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Revisado
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <BookingWizard caregiver={caregiver} />
      </div>
    </section>
  )
}
