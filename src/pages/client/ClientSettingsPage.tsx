import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

export function ClientSettingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const user = useAppStore((state) => state.user)
  const clearSession = useAppStore((state) => state.clearSession)
  const updateUserProfile = useAppStore((state) => state.updateUserProfile)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getAccountProfile(user.id)
      .then((profile) => {
        setFullName(profile.fullName)
        setEmail(profile.email)
        setPhone(profile.phone)
      })
      .catch(() => {
        clearSession()
        toast.error('Sesion invalida', 'Tu sesion ya no coincide con una cuenta activa. Inicia sesion de nuevo.')
        navigate('/', { replace: true })
      })
  }, [clearSession, navigate, toast, user.id])

  async function handleSave() {
    if (!user.id) {
      return
    }

    setSaving(true)
    try {
      await mockApi.updateAccountProfile({ userId: user.id, fullName, phone })
      updateUserProfile({ name: fullName, phone })
      toast.success('Perfil actualizado', 'Tus datos de cuenta ya quedaron guardados en la base.')
    } catch (error) {
      toast.error('No se pudo guardar', getApiErrorMessage(error, 'No pudimos actualizar tu perfil.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (!user.id) {
      return
    }

    const confirmed = window.confirm('Esta accion eliminara tu cuenta y sus datos relacionados de la base. Deseas continuar?')
    if (!confirmed) {
      return
    }

    setDeleting(true)
    try {
      await mockApi.deleteAccount(user.id)
      clearSession()
      toast.success('Cuenta eliminada', 'Tu cuenta fue eliminada correctamente.')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error('No se pudo eliminar', getApiErrorMessage(error, 'No pudimos eliminar tu cuenta.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="font-display text-3xl text-slate-950 dark:text-white">Perfil y ajustes</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder="Nombre completo" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <input className="field" placeholder="Email" value={email} disabled />
        <input className="field" placeholder="Telefono" value={phone} onChange={(event) => setPhone(event.target.value)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button variant="secondary" onClick={handleDeleteAccount} disabled={deleting}>
          {deleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
        </Button>
      </div>
    </section>
  )
}
