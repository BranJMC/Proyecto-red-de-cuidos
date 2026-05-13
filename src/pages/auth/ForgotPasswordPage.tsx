import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

export function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const toast = useToast()
  const role = (searchParams.get('role') ?? 'client') as UserRole

  async function handleSubmit() {
    setSending(true)
    try {
      const response = await mockApi.forgotPassword(email, role)
      setMessage(response.message)
      toast.success('Correo enviado', response.message)
    } catch (error) {
      toast.error('No se pudo enviar', getApiErrorMessage(error, 'No pudimos iniciar la recuperacion.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Recuperar contrasena</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Enviaremos un enlace seguro al correo de tu cuenta.</p>
      <input className="field mt-8" placeholder="tu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} />
      {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">{message}</p> : null}
      <Button className="mt-6" onClick={handleSubmit} disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar enlace'}
      </Button>
    </section>
  )
}

