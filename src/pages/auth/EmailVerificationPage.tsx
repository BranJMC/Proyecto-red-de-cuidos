import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { OtpInput } from '../../components/ui/OtpInput'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const setSession = useAppStore((state) => state.setSession)
  const [otpCode, setOtpCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const challengeId = searchParams.get('challengeId') ?? ''
  const emailMasked = searchParams.get('email') ?? 'tu correo registrado'
  const role = (searchParams.get('role') ?? 'client') as UserRole

  async function handleVerify() {
    if (!challengeId || otpCode.length !== 6) {
      toast.error('Codigo incompleto', 'Ingresa los 6 digitos del codigo enviado por correo.')
      return
    }

    setSubmitting(true)
    try {
      const response = await mockApi.verifyLoginOtp({ challengeId, code: otpCode })
      setSession(response)
      toast.success('Acceso confirmado', 'Tu 2FA fue validado correctamente.')
      navigate(role === 'client' ? '/client/home' : role === 'caregiver' ? '/caregiver/home' : '/admin/overview')
    } catch (error) {
      toast.error('No se pudo validar', getApiErrorMessage(error, 'El codigo no pudo validarse.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (!challengeId) {
      toast.error('Sesion expirada', 'Vuelve al login para solicitar un codigo nuevo.')
      return
    }

    setResending(true)
    try {
      const response = await mockApi.resendLoginOtp(challengeId)
      navigate(
        `/auth/verify-email?challengeId=${encodeURIComponent(response.challengeId)}&email=${encodeURIComponent(response.emailMasked)}&role=${encodeURIComponent(role)}`,
        { replace: true },
      )
      setOtpCode('')
      toast.success('Codigo reenviado', 'Enviamos un nuevo codigo 2FA al correo registrado.')
    } catch (error) {
      toast.error('No se pudo reenviar', getApiErrorMessage(error, 'No pudimos reenviar el codigo.'))
    } finally {
      setResending(false)
    }
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Verifica tu email</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Ingresa el codigo de 6 digitos que enviamos a <span className="font-semibold text-slate-950 dark:text-white">{emailMasked}</span>.
      </p>
      <div className="mt-8">
        <OtpInput value={otpCode} onChange={setOtpCode} />
      </div>
      <div className="mt-6 flex gap-3">
        <Button onClick={handleVerify} disabled={submitting}>
          {submitting ? 'Validando...' : 'Confirmar codigo'}
        </Button>
        <Button variant="secondary" onClick={handleResend} disabled={resending}>
          {resending ? 'Reenviando...' : 'Reenviar'}
        </Button>
      </div>
    </section>
  )
}

