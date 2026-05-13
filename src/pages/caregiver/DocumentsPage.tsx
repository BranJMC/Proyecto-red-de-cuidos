import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BadgeCheck, FileText, ShieldCheck, UserCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { FileUploader } from '../../components/ui/FileUploader'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { CaregiverApplicationDocument, CaregiverApplicationStatus } from '../../types'

const documentsToUpload: Array<{
  type: CaregiverApplicationDocument['documentType']
  label: string
  helper: string
  required: boolean
}> = [
  { type: 'face_photo', label: 'Foto del rostro', helper: 'Obligatoria. Se usara en tu perfil y para validar visualmente tu identidad.', required: true },
  { type: 'national_id_front', label: 'Frente de cedula', helper: 'Documento obligatorio para la revision administrativa.', required: true },
  { type: 'national_id_back', label: 'Reverso de cedula', helper: 'Documento obligatorio para la revision administrativa.', required: true },
  { type: 'curriculum', label: 'Curriculum', helper: 'Obligatorio para evaluar experiencia y trayectoria.', required: true },
  { type: 'hoja_de_vida', label: 'Hoja de vida', helper: 'Respaldo complementario de tu postulacion.', required: true },
  { type: 'certification', label: 'Certificados y cursos', helper: 'Opcional pero recomendado para reforzar tu perfil ante admin y AI.', required: false },
]

function statusLabel(status?: CaregiverApplicationStatus['status']) {
  switch (status) {
    case 'approved':
      return 'Aprobado'
    case 'pending':
      return 'Pendiente'
    case 'rejected':
      return 'Rechazado'
    default:
      return 'Borrador'
  }
}

function statusTone(status?: CaregiverApplicationStatus['status']) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
    case 'pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
    case 'rejected':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
}

export function DocumentsPage() {
  const user = useAppStore((state) => state.user)
  const updateUserProfile = useAppStore((state) => state.updateUserProfile)
  const toast = useToast()
  const [applicationStatus, setApplicationStatus] = useState<CaregiverApplicationStatus | null>(null)
  const [idNumber, setIdNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingType, setUploadingType] = useState<CaregiverApplicationDocument['documentType'] | null>(null)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getCaregiverApplicationStatus(user.id).then(setApplicationStatus)
  }, [user.id])

  const documentsByType = useMemo(
    () => new Map((applicationStatus?.documents ?? []).map((document) => [document.documentType, document])),
    [applicationStatus],
  )

  // Reutilizamos el mismo estado "pending" para nuevas postulaciones y para pedir retiro del servicio.
  const isRemovalPending =
    applicationStatus?.status === 'pending' &&
    ((applicationStatus.rejectionReason ?? '').toLowerCase().includes('eliminar servicio') ||
      (applicationStatus.aiSummary ?? '').toLowerCase().includes('eliminar servicio'))

  const currentFacePhoto = applicationStatus?.facePhotoUrl ?? user.avatar

  async function refreshStatus() {
    if (!user.id) {
      return
    }

    const nextStatus = await mockApi.getCaregiverApplicationStatus(user.id)
    setApplicationStatus(nextStatus)
    if (nextStatus.facePhotoUrl) {
      updateUserProfile({ name: user.name, avatar: nextStatus.facePhotoUrl })
    }
  }

  async function handleSubmitApplication() {
    if (!user.id) {
      return
    }

    if (!idNumber.trim()) {
      toast.error('Falta la cedula', 'Debes escribir tu numero de cedula antes de enviar la postulacion.')
      return
    }

    setSubmitting(true)
    try {
      const response = await mockApi.submitCaregiverApplication({ caregiverId: user.id, idNumber: idNumber.trim() })
      if (response.missingDocuments.length) {
        toast.error(
          'Faltan documentos',
          `No se pudo revisar tu expediente porque faltan: ${response.missingDocuments.join(', ')}. Debes subirlos en "Documentos para postulacion".`,
        )
      } else {
        toast.success('Solicitud enviada', 'Tu postulacion fue enviada al admin y a la revision automatica.')
      }
      await refreshStatus()
    } catch {
      toast.error('No se pudo enviar', 'Revisa que la documentacion obligatoria este completa e intenta otra vez.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancelApplication() {
    if (!user.id) {
      return
    }

    setSubmitting(true)
    try {
      await mockApi.cancelCaregiverApplication(user.id)
      await refreshStatus()
      toast.success('Solicitud cancelada', 'Tu postulacion quedo retirada y puedes ajustarla antes de reenviarla.')
    } catch {
      toast.error('No se pudo cancelar', 'Intenta nuevamente en unos segundos.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRequestRemoval() {
    if (!user.id) {
      return
    }

    const confirmed = window.confirm('Tu servicio quedara suspendido mientras el admin revisa la solicitud. Deseas continuar?')
    if (!confirmed) {
      return
    }

    setSubmitting(true)
    try {
      await mockApi.requestCaregiverServiceRemoval(user.id)
      await refreshStatus()
      toast.success('Solicitud enviada', 'Tu solicitud para eliminar el servicio quedo pendiente de aprobacion del admin.')
    } catch {
      toast.error('No se pudo enviar', 'Intenta nuevamente en unos segundos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            {currentFacePhoto ? (
              <img src={currentFacePhoto} alt={user.name} className="size-24 rounded-[28px] object-cover shadow-sm" />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-[28px] bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <UserCircle2 className="size-12" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Perfil</p>
              <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">{user.name || 'Perfil del cuidador'}</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(applicationStatus?.status)}`}>
                  {statusLabel(applicationStatus?.status)}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStatus?.canOfferServices ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {applicationStatus?.canOfferServices ? 'Servicio visible para clientes' : 'Servicio aun no visible'}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-sm rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/50">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Resumen de revision</p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{applicationStatus?.aiSummary ?? 'Todavia no has enviado tu expediente.'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Postulacion de cuidador</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completa la identidad y manda tu perfil para revision de admin e IA.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Numero de cedula</p>
              <input
                className="field"
                placeholder="Ejemplo: 1-2345-6789"
                value={idNumber}
                onChange={(event) => setIdNumber(event.target.value)}
                disabled={applicationStatus?.status === 'pending' && !isRemovalPending}
              />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
              <p className="text-sm font-medium text-slate-950 dark:text-white">Estado actual</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <li>Documentos obligatorios completos: {applicationStatus?.hasRequiredDocuments ? 'si' : 'no'}</li>
                <li>Fecha de envio: {applicationStatus?.submittedAt ?? 'Aun no enviada'}</li>
                <li>Ultima revision: {applicationStatus?.reviewedAt ?? 'Pendiente'}</li>
              </ul>
            </div>

            {applicationStatus?.missingDocuments?.length ? (
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">Documentos faltantes</p>
                    <p className="mt-1">{applicationStatus.missingDocuments.join(', ')}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {applicationStatus?.rejectionReason ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">{isRemovalPending ? 'Solicitud de retiro en revision' : 'Motivo de rechazo'}</p>
                    <p className="mt-1">{applicationStatus.rejectionReason}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {applicationStatus?.previousRejectionReason ? (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-800/55 dark:text-slate-200">
                <p className="font-semibold text-slate-950 dark:text-white">Observacion anterior del admin</p>
                <p className="mt-1">{applicationStatus.previousRejectionReason}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {applicationStatus?.status === 'pending' ? (
              isRemovalPending ? (
                <Button disabled className="opacity-80">Solicitud de retiro pendiente</Button>
              ) : (
                <Button variant="secondary" disabled={submitting} onClick={handleCancelApplication}>
                  {submitting ? 'Procesando...' : 'Declinar la solicitud'}
                </Button>
              )
            ) : applicationStatus?.status === 'approved' ? (
              <Button variant="secondary" disabled={submitting} onClick={handleRequestRemoval}>
                {submitting ? 'Enviando...' : 'Solicitar eliminar mi servicio'}
              </Button>
            ) : (
              <Button disabled={submitting} onClick={handleSubmitApplication}>
                {submitting ? 'Enviando...' : 'Solicitar ofrecer servicio'}
              </Button>
            )}
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900/75">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-slate-950 dark:text-white">Documentos para postulacion</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sube tus requisitos. Si actualizas uno ya aprobado, volvera a revision del admin.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {documentsToUpload.map((item) => {
              const currentDocument = documentsByType.get(item.type)
              return (
                <div key={item.type} className="space-y-3 rounded-[26px] border border-slate-200 bg-slate-50/85 p-4 dark:border-white/10 dark:bg-slate-800/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-slate-950 dark:text-white">{item.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.helper}</p>
                    </div>
                    {item.required ? (
                      <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-cyan-400 dark:text-slate-950">
                        Obligatorio
                      </span>
                    ) : null}
                  </div>

                  <FileUploader
                    label={currentDocument?.fileName ?? 'Subir archivo'}
                    helper={currentDocument?.status ? `Estado actual: ${currentDocument.status}` : 'Selecciona el archivo para adjuntarlo a tu expediente.'}
                    accept=".pdf,.png,.jpg,.jpeg"
                    busy={uploadingType === item.type}
                    fileName={currentDocument?.fileName}
                    statusLabel={currentDocument?.status}
                    onSelect={async (file) => {
                      if (!user.id) {
                        return
                      }

                      setUploadingType(item.type)
                      try {
                        await mockApi.uploadCaregiverDocument({ caregiverId: user.id, documentType: item.type, file })
                        await refreshStatus()
                        toast.success('Documento subido', 'Ya quedo guardado en tu expediente.')
                      } catch {
                        toast.error('No se pudo subir', 'Revisa tu conexion e intenta otra vez.')
                      } finally {
                        setUploadingType(null)
                      }
                    }}
                  />

                  {currentDocument?.aiSummary ? (
                    <div className="rounded-2xl bg-white px-3 py-3 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                      <p className="font-semibold text-slate-950 dark:text-white">Revision visible</p>
                      <p className="mt-1 leading-6">{currentDocument.aiSummary}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {currentFacePhoto ? (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck className="size-4 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Foto que veran admin y clientes</p>
              </div>
              <img src={currentFacePhoto} alt="Foto de perfil del cuidador" className="h-48 w-full rounded-[22px] object-cover" />
            </div>
          ) : null}
        </article>
      </section>
    </div>
  )
}
