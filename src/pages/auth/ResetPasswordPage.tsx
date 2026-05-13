import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import type { UserRole } from '../../types'

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const toast = useToast()
  const token = searchParams.get('token') ?? ''
  const role = (searchParams.get('role') ?? 'client') as UserRole
  const returnTo =
    searchParams.get('returnTo') ??
    (role === 'caregiver' ? '/caregiver/home' : role === 'admin' ? '/admin/overview' : '/client/home')

  useEffect(() => {
    if (!success) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      navigate(returnTo, { replace: true })
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [navigate, returnTo, success])

  async function handleSave() {
    if (!token) {
      toast.error('Enlace invalido', 'No encontramos el token de recuperacion en el enlace.')
      return
    }

    if (!password || password.length < 8) {
      toast.error('Contrasena invalida', 'Usa una contrasena de al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('No coincide', 'La confirmacion de contrasena no coincide.')
      return
    }

    setSaving(true)
    try {
      const response = await mockApi.resetPassword({ token, password })
      setSuccess(response.message)
      setPassword('')
      setConfirmPassword('')
      toast.success('Contrasena actualizada', response.message)
    } catch (error) {
      toast.error('No se pudo guardar', getApiErrorMessage(error, 'No fue posible actualizar la contrasena.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Nueva contrasena</h1>
      <div className="mt-8 grid gap-4">
        <input className="field" placeholder="Nueva contrasena" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <input className="field" placeholder="Confirmar contrasena" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
      </div>
      {success ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {success} <Link to={returnTo} className="font-semibold underline">Volver a la aplicacion</Link>
        </p>
      ) : null}
      <Button className="mt-6" onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar contrasena'}
      </Button>
    </section>
  )
}
