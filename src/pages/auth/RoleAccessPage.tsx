import { BriefcaseMedical, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { CaregiverOnboardingWizard } from '../../features/verification/CaregiverOnboardingWizard'
import { useToast } from '../../hooks/useToast'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

type EntryRole = Extract<UserRole, 'client' | 'caregiver'>
type AuthMode = 'login' | 'register' | 'recover'

const roleCopy: Record<EntryRole, {
  title: string
  eyebrow: string
  description: string
  icon: ReactNode
  defaultEmail: string
}> = {
  client: {
    title: 'Acceso para clientes',
    eyebrow: 'Necesito contratar cuidado',
    description: 'Ingresa o crea una cuenta para reservar cuidadores verificados, revisar perfiles y subir comprobantes.',
    icon: <HeartHandshake className="size-6" />,
    defaultEmail: 'ana@familia.com',
  },
  caregiver: {
    title: 'Acceso para cuidadores',
    eyebrow: 'Quiero ofrecer mis servicios',
    description: 'Ingresa o crea tu cuenta profesional. Para trabajar, primero debes completar la verificacion obligatoria.',
    icon: <BriefcaseMedical className="size-6" />,
    defaultEmail: 'monica@cuidados.com',
  },
}

function isEntryRole(value: string | undefined): value is EntryRole {
  return value === 'client' || value === 'caregiver'
}

export function RoleAccessPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const setRole = useAppStore((state) => state.setRole)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [showCaregiverVerification, setShowCaregiverVerification] = useState(false)

  if (!isEntryRole(role)) {
    return <Navigate to="/" replace />
  }

  const copy = roleCopy[role]
  const roleLabel = role === 'client' ? 'cliente' : 'cuidador'

  if (showCaregiverVerification) {
    return (
      <section className="space-y-6">
        <div className="rounded-[36px] border border-amber-200 bg-amber-50/90 p-6 dark:border-amber-400/20 dark:bg-amber-400/10">
          <p className="text-sm uppercase tracking-[0.22em] text-amber-700 dark:text-amber-200">Verificacion requerida</p>
          <h1 className="mt-2 font-display text-3xl text-slate-950 dark:text-white">Completa tu verificacion antes de acceder</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Tu cuenta de cuidador fue creada, pero no podras ofrecer servicios hasta completar cedula, foto facial, OTP, curriculum y hoja de vida.
          </p>
        </div>
        <CaregiverOnboardingWizard preAccess />
      </section>
    )
  }

  const handleSubmit = () => {
    setRole(role)

    if (authMode === 'recover') {
      toast.success('Codigo enviado', `Enviamos instrucciones para recuperar tu cuenta de ${roleLabel}.`)
      return
    }

    if (authMode === 'register' && role === 'caregiver') {
      toast.success('Cuenta creada', 'Ahora completa la verificacion obligatoria para poder trabajar.')
      setShowCaregiverVerification(true)
      return
    }

    toast.success(
      authMode === 'register' ? 'Cuenta creada' : 'Sesion iniciada',
      `Acceso simulado como ${roleLabel}, listo para conectar al backend.`,
    )
    navigate(role === 'client' ? '/client/home' : '/caregiver/home')
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
            {copy.icon}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">{copy.eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl text-slate-950 dark:text-white">{copy.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{copy.description}</p>
          </div>
        </div>
        <Link to="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-white/10 dark:text-slate-400">
          Cambiar rol
        </Link>
      </div>

      <div className="mt-8 grid rounded-2xl bg-slate-100 p-1 text-sm dark:bg-slate-900 sm:grid-cols-3">
        {[
          ['login', 'Iniciar sesion'],
          ['register', 'Crear cuenta'],
          ['recover', 'Recuperar clave'],
        ].map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setAuthMode(mode as AuthMode)}
            className={`rounded-xl px-4 py-3 font-medium transition ${
              authMode === mode
                ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        {authMode === 'register' ? (
          <input className="field" placeholder={role === 'client' ? 'Nombre de la familia o responsable' : 'Nombre profesional completo'} />
        ) : null}
        <input className="field" placeholder={`Email de ${roleLabel}`} type="email" defaultValue={copy.defaultEmail} />
        {authMode === 'register' ? <input className="field" placeholder="Telefono" /> : null}
        {authMode !== 'recover' ? (
          <input className="field" placeholder="Contrasena" type="password" defaultValue="RedCuidados2026" />
        ) : null}
        {authMode === 'register' && role === 'caregiver' ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            <ShieldCheck className="mr-2 inline size-4" />
            Despues de crear tu cuenta pasaras a verificacion obligatoria antes de entrar al dashboard.
          </div>
        ) : null}
        <Button type="submit" fullWidth>
          {authMode === 'login'
            ? `Entrar como ${roleLabel}`
            : authMode === 'register'
              ? `Crear cuenta de ${roleLabel}`
              : 'Enviar instrucciones'}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        {authMode === 'login' ? (
          <button type="button" onClick={() => setAuthMode('register')} className="text-cyan-600 dark:text-cyan-300">
            No tengo cuenta, crear una como {roleLabel}
          </button>
        ) : (
          <button type="button" onClick={() => setAuthMode('login')} className="text-cyan-600 dark:text-cyan-300">
            Ya tengo cuenta, iniciar sesion
          </button>
        )}
        {authMode !== 'recover' ? (
          <button type="button" onClick={() => setAuthMode('recover')} className="text-slate-500 dark:text-slate-400">
            Olvide mi contrasena
          </button>
        ) : null}
      </div>
    </section>
  )
}
