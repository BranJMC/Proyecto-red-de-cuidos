import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { BackupRecord } from '../../types'
import { statusTone } from '../../utils/helpers'

export function AdminSettingsPage() {
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([])
  const [verificationSlaHours, setVerificationSlaHours] = useState(6)
  const [supportPremiumEnabled, setSupportPremiumEnabled] = useState(true)
  const [paymentAiEnabled, setPaymentAiEnabled] = useState(true)
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    mockApi.getBackupRecords().then(setBackupRecords)
    mockApi.getPlatformSettings().then((settings) => {
      setVerificationSlaHours(settings.verificationSlaHours)
      setSupportPremiumEnabled(settings.supportPremiumEnabled)
      setPaymentAiEnabled(settings.paymentAiEnabled)
      setPushNotificationsEnabled(settings.pushNotificationsEnabled)
    })
  }, [])

  async function createBackup() {
    await mockApi.createBackup()
    setBackupRecords(await mockApi.getBackupRecords())
    toast.success('Backup generado', 'El respaldo manual ya quedo registrado.')
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await mockApi.updatePlatformSettings({
        verificationSlaHours,
        supportPremiumEnabled,
        paymentAiEnabled,
        pushNotificationsEnabled,
        updatedBy: user.id,
      })
      toast.success('Configuracion guardada', 'Los cambios globales de la plataforma ya quedaron guardados.')
    } catch {
      toast.error('No se pudo guardar', 'La configuracion no pudo persistirse en la base.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <h2 className="font-display text-3xl text-slate-950 dark:text-white">Configuracion de plataforma</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">SLA verificacion (horas)</label>
            <input className="field" value={verificationSlaHours} onChange={(event) => setVerificationSlaHours(Number(event.target.value) || 0)} />
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-800/60">
            Soporte premium activo
            <input type="checkbox" className="size-4 accent-cyan-500" checked={supportPremiumEnabled} onChange={(event) => setSupportPremiumEnabled(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-800/60">
            Revision AI para comprobantes
            <input type="checkbox" className="size-4 accent-cyan-500" checked={paymentAiEnabled} onChange={(event) => setPaymentAiEnabled(event.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-slate-800/60">
            Push notifications
            <input type="checkbox" className="size-4 accent-cyan-500" checked={pushNotificationsEnabled} onChange={(event) => setPushNotificationsEnabled(event.target.checked)} />
          </label>
        </div>
        <Button className="mt-6" onClick={saveSettings} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </section>
      <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-950 dark:text-white">Backup diario de actividad</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Respaldo diario de mensajes, bookings, aprobaciones, comprobantes y actividad operativa.
            </p>
          </div>
          <Button onClick={createBackup}>Generar backup manual</Button>
        </div>
        <div className="mt-6 space-y-3">
          {backupRecords.map((record) => (
            <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
              <div>
                <p className="font-medium text-slate-950 dark:text-white">{record.scope}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {record.generatedAt} | {record.size}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(record.status)}`}>
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
