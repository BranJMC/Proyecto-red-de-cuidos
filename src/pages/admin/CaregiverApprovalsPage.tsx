import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Eye, FileText, ShieldCheck, UserRoundSearch } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import type { ApprovalDossier, CaregiverApplicationDocument } from '../../types'

function badgeTone(status: 'pending' | 'approved' | 'rejected') {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
    case 'rejected':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
    default:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
  }
}

function isImageDocument(document: CaregiverApplicationDocument) {
  const name = (document.fileName ?? '').toLowerCase()
  const url = (document.fileUrl ?? '').toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.webp'].some((extension) => name.endsWith(extension) || url.endsWith(extension))
}

function statusLabel(status: ApprovalDossier['status']) {
  switch (status) {
    case 'approved':
      return 'Aprobado'
    case 'rejected':
      return 'Rechazado'
    default:
      return 'Por revisar'
  }
}

export function CaregiverApprovalsPage() {
  const [approvalDossiers, setApprovalDossiers] = useState<ApprovalDossier[]>([])
  const [selectedDossierId, setSelectedDossierId] = useState<string>('')
  const [selectedDocument, setSelectedDocument] = useState<CaregiverApplicationDocument | null>(null)
  const [decisionReason, setDecisionReason] = useState('')
  const [busyDecision, setBusyDecision] = useState<'approve' | 'reject' | 'suspend' | ''>('')
  const toast = useToast()

  useEffect(() => {
    mockApi.getApprovalDossiers().then((items) => {
      setApprovalDossiers(items)
      setSelectedDossierId((current) => current || items[0]?.id || '')
    })
  }, [])

  const pendingDossiers = useMemo(
    () => approvalDossiers.filter((item) => item.status !== 'approved'),
    [approvalDossiers],
  )

  const approvedDossiers = useMemo(
    () => approvalDossiers.filter((item) => item.status === 'approved'),
    [approvalDossiers],
  )

  const selectedDossier =
    approvalDossiers.find((item) => item.id === selectedDossierId) ?? pendingDossiers[0] ?? approvedDossiers[0] ?? null

  async function refreshDossiers() {
    const items = await mockApi.getApprovalDossiers()
    setApprovalDossiers(items)
    setSelectedDossierId((current) => {
      const next = items.find((item) => item.id === current)
      return next?.id ?? items[0]?.id ?? ''
    })
  }

  async function handleDecision(decision: 'approve' | 'reject' | 'suspend') {
    if (!selectedDossier) {
      return
    }

    if ((decision === 'reject' || decision === 'suspend') && !decisionReason.trim()) {
      toast.error('Falta el comentario', 'Escribe un motivo para que el cuidador entienda por que fue rechazada o suspendida la solicitud.')
      return
    }

    setBusyDecision(decision)
    try {
      await mockApi.decideApproval(selectedDossier.id, decision, { reason: decisionReason.trim() || undefined })
      await refreshDossiers()
      setDecisionReason('')
      setSelectedDocument(null)
      toast.success('Decision guardada', 'La revision del cuidador se actualizo correctamente.')
    } catch {
      toast.error('No se pudo guardar', 'La decision no pudo sincronizarse con la base.')
    } finally {
      setBusyDecision('')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Aprobaciones</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">Revision visual de cuidadores y expedientes</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
          A la izquierda quedan los expedientes por revisar o que fueron rechazados, a la derecha los cuidadores aprobados. Al seleccionar una tarjeta puedes revisar el perfil completo, ver los archivos y decidir con comentario.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/75">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                <UserRoundSearch className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">Pendientes por revisar</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{pendingDossiers.length} expedientes en cola</p>
              </div>
            </div>
          </div>

          <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {pendingDossiers.length ? pendingDossiers.map((dossier) => (
              <button
                key={dossier.id}
                type="button"
                onClick={() => setSelectedDossierId(dossier.id)}
                className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${
                  selectedDossier?.id === dossier.id
                    ? 'border-cyan-400 bg-cyan-50/80 dark:border-cyan-300 dark:bg-cyan-400/10'
                    : 'border-slate-200 bg-slate-50/90 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/55'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={dossier.caregiverAvatar || 'https://placehold.co/96x96?text=CG'}
                    alt={dossier.caregiverName}
                    className="size-16 rounded-[20px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950 dark:text-white">{dossier.caregiverName}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeTone(dossier.status)}`}>
                        {statusLabel(dossier.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dossier.profileSummary?.headline || dossier.roleFit}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{dossier.aiSummary}</p>
                    {dossier.previousRejectionReason ? (
                      <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">Rechazo previo: {dossier.previousRejectionReason}</p>
                    ) : null}
                  </div>
                </div>
              </button>
            )) : <p className="rounded-[24px] bg-slate-50/90 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/55 dark:text-slate-400">No hay solicitudes pendientes por revisar.</p>}
          </div>
        </article>

        <article className="rounded-[32px] border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/75">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-slate-950 dark:text-white">Cuidadores aprobados</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{approvedDossiers.length} perfiles habilitados</p>
              </div>
            </div>
          </div>

          <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {approvedDossiers.length ? approvedDossiers.map((dossier) => (
              <button
                key={dossier.id}
                type="button"
                onClick={() => setSelectedDossierId(dossier.id)}
                className={`w-full rounded-[26px] border px-4 py-4 text-left transition ${
                  selectedDossier?.id === dossier.id
                    ? 'border-cyan-400 bg-cyan-50/80 dark:border-cyan-300 dark:bg-cyan-400/10'
                    : 'border-slate-200 bg-slate-50/90 hover:border-slate-300 dark:border-white/10 dark:bg-slate-800/55'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={dossier.caregiverAvatar || 'https://placehold.co/96x96?text=CG'}
                    alt={dossier.caregiverName}
                    className="size-16 rounded-[20px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-950 dark:text-white">{dossier.caregiverName}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeTone(dossier.status)}`}>
                        {statusLabel(dossier.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{dossier.profileSummary?.headline || dossier.roleFit}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Visible para clientes. Puedes quitar el permiso si el expediente deja de cumplir.
                    </p>
                  </div>
                </div>
              </button>
            )) : <p className="rounded-[24px] bg-slate-50/90 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/55 dark:text-slate-400">Todavia no hay cuidadores aprobados.</p>}
          </div>
        </article>
      </section>

      {selectedDossier ? (
        <section className="rounded-[34px] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <article className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-800/55">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedDossier.caregiverAvatar || 'https://placehold.co/128x128?text=CG'}
                    alt={selectedDossier.caregiverName}
                    className="size-24 rounded-[28px] object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-3xl text-slate-950 dark:text-white">{selectedDossier.caregiverName}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeTone(selectedDossier.status)}`}>
                        {statusLabel(selectedDossier.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedDossier.profileSummary?.headline || selectedDossier.roleFit}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{selectedDossier.profileSummary?.bio || selectedDossier.aiSummary}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-4 dark:bg-slate-900/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Experiencia y tarifa</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{selectedDossier.profileSummary?.yearsExperience ?? 0} anos de experiencia</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">USD {selectedDossier.profileSummary?.pricePerHour ?? 0}/hora</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-4 dark:bg-slate-900/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Idiomas</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{selectedDossier.profileSummary?.languages?.join(', ') || 'Sin datos'}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white px-4 py-4 dark:bg-slate-900/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Cobertura y servicios</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                    Provincias/cantones: {selectedDossier.profileSummary?.serviceZones?.join(', ') || 'Sin zonas registradas'}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                    Modalidades: {selectedDossier.profileSummary?.serviceTypes?.join(', ') || 'Sin modalidades registradas'}
                  </p>
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-800/55">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-amber-500" />
                  <div>
                    <h3 className="font-display text-2xl text-slate-950 dark:text-white">Observaciones de revision</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Deja un comentario al rechazar o suspender el permiso.</p>
                  </div>
                </div>

                {selectedDossier.previousRejectionReason ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
                    <p className="font-semibold">Motivo anterior de rechazo</p>
                    <p className="mt-1">{selectedDossier.previousRejectionReason}</p>
                  </div>
                ) : null}

                {selectedDossier.rejectionReason ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
                    <p className="font-semibold text-slate-950 dark:text-white">Motivo actual registrado</p>
                    <p className="mt-1">{selectedDossier.rejectionReason}</p>
                  </div>
                ) : null}

                <textarea
                  className="field mt-4 min-h-36"
                  placeholder="Escribe aqui por que fue rechazada la solicitud, que documento falta o por que quieres quitar el permiso del servicio."
                  value={decisionReason}
                  onChange={(event) => setDecisionReason(event.target.value)}
                />

                <div className="mt-5 flex flex-wrap gap-3">
                  {selectedDossier.status !== 'approved' ? (
                    <>
                      <Button onClick={() => handleDecision('approve')} disabled={busyDecision !== ''}>
                        {busyDecision === 'approve' ? 'Aprobando...' : 'Aprobar solicitud'}
                      </Button>
                      <Button variant="secondary" onClick={() => handleDecision('reject')} disabled={busyDecision !== ''}>
                        {busyDecision === 'reject' ? 'Rechazando...' : 'Rechazar con comentario'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={() => handleDecision('suspend')} disabled={busyDecision !== ''}>
                      {busyDecision === 'suspend' ? 'Quitando permiso...' : 'Quitar permiso al servicio'}
                    </Button>
                  )}
                </div>
              </article>
            </div>

            <article className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-800/55">
              <div className="flex items-center gap-3">
                <Eye className="size-5 text-cyan-500" />
                <div>
                  <h3 className="font-display text-2xl text-slate-950 dark:text-white">Expediente visual</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Revisa fotos y archivos tal como los subio el cuidador.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(selectedDossier.documentItems?.length ?? 0) > 0 ? selectedDossier.documentItems?.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => setSelectedDocument(document)}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900/70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-950 dark:text-white">{document.label}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${document.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : document.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'}`}>
                        {document.status}
                      </span>
                    </div>

                    {document.fileUrl ? (
                      isImageDocument(document) ? (
                        <img src={document.fileUrl} alt={document.label} className="mt-4 h-56 w-full rounded-[22px] object-cover" />
                      ) : (
                        <a
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-300 px-4 text-center text-sm text-cyan-700 hover:bg-cyan-50/60 dark:border-white/10 dark:text-cyan-300 dark:hover:bg-cyan-400/5"
                        >
                          <FileText className="mb-3 size-6" />
                          Abrir archivo
                        </a>
                      )
                    ) : (
                      <div className="mt-4 flex min-h-40 items-center justify-center rounded-[22px] border border-dashed border-slate-300 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                        Sin vista previa disponible
                      </div>
                    )}

                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{document.fileName}</p>
                    {document.aiSummary ? (
                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{document.aiSummary}</p>
                    ) : null}
                  </button>
                )) : <p className="rounded-[24px] bg-white px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">Este cuidador aun no tiene documentos visibles en el expediente.</p>}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {selectedDocument && selectedDossier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-2xl dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-white/10">
              <div>
                <h3 className="font-display text-2xl text-slate-950 dark:text-white">{selectedDocument.label}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedDossier.caregiverName} | {selectedDocument.fileName}</p>
              </div>
              <Button variant="secondary" onClick={() => setSelectedDocument(null)}>Cerrar</Button>
            </div>

            <div className="grid max-h-[calc(92vh-84px)] gap-0 overflow-hidden xl:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-auto bg-slate-100 p-4 dark:bg-slate-900">
                {selectedDocument.fileUrl ? (
                  isImageDocument(selectedDocument) ? (
                    <img src={selectedDocument.fileUrl} alt={selectedDocument.label} className="mx-auto max-h-[72vh] w-full rounded-[24px] object-contain bg-white dark:bg-slate-950" />
                  ) : (
                    <iframe title={selectedDocument.label} src={selectedDocument.fileUrl} className="h-[72vh] w-full rounded-[24px] bg-white dark:bg-slate-950" />
                  )
                ) : (
                  <div className="flex h-[72vh] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
                    No hay archivo disponible
                  </div>
                )}
              </div>

              <div className="overflow-auto p-6">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Revision del documento</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                    <p><span className="font-semibold">Estado actual:</span> {selectedDocument.status}</p>
                    <p><span className="font-semibold">Archivo:</span> {selectedDocument.fileName}</p>
                    <p><span className="font-semibold">Resumen visible:</span> {selectedDocument.aiSummary || 'Sin resumen automatico'}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-800/55">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Decision del admin</p>
                  <textarea
                    className="field mt-3 min-h-36"
                    placeholder="Escribe aqui por que apruebas o por que deniegas esta solicitud."
                    value={decisionReason}
                    onChange={(event) => setDecisionReason(event.target.value)}
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedDossier.status !== 'approved' ? (
                      <>
                        <Button onClick={() => handleDecision('approve')} disabled={busyDecision !== ''}>
                          {busyDecision === 'approve' ? 'Aprobando...' : 'Aceptar solicitud'}
                        </Button>
                        <Button variant="secondary" onClick={() => handleDecision('reject')} disabled={busyDecision !== ''}>
                          {busyDecision === 'reject' ? 'Denegando...' : 'Denegar solicitud'}
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" onClick={() => handleDecision('suspend')} disabled={busyDecision !== ''}>
                        {busyDecision === 'suspend' ? 'Suspendiendo...' : 'Quitar permiso al servicio'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
