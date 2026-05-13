import { BriefcaseMedical, HeartHandshake, ShieldCheck } from 'lucide-react'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

type EntryRole = UserRole
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
    defaultEmail: '',
  },
  caregiver: {
    title: 'Acceso para cuidadores',
    eyebrow: 'Quiero ofrecer mis servicios',
    description: 'Ingresa o crea tu cuenta profesional. Para trabajar, primero debes completar la verificacion obligatoria.',
    icon: <BriefcaseMedical className="size-6" />,
    defaultEmail: '',
  },
  admin: {
    title: 'Acceso administrativo',
    eyebrow: 'Operacion interna',
    description: 'El acceso admin usa credenciales predeterminadas y no permite registro publico ni recuperacion automatica.',
    icon: <ShieldCheck className="size-6" />,
    defaultEmail: 'admin@redcuidados.com',
  },
}

const adminDefaultPassword = 'RedCuidados2026'
const adminDefaultEmail = 'admin@redcuidados.com'

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

function isEntryRole(value: string | undefined): value is EntryRole {
  return value === 'client' || value === 'caregiver' || value === 'admin'
}

export function RoleAccessPage() {
  const { role } = useParams()
  const safeRole: EntryRole = isEntryRole(role) ? role : 'client'
  const copy = roleCopy[safeRole]
  const navigate = useNavigate()
  const toast = useToast()
  const setSession = useAppStore((state) => state.setSession)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [submitting, setSubmitting] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(copy.defaultEmail)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState(role === 'admin' ? adminDefaultPassword : '')
  const [message, setMessage] = useState('')

  if (!isEntryRole(role)) {
    return <Navigate to="/" replace />
  }

  const roleLabel = role === 'client' ? 'cliente' : role === 'caregiver' ? 'cuidador' : 'admin'
  const adminMode = role === 'admin'
  const canRegister = !adminMode
  const canRecover = !adminMode

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (authMode === 'recover') {
        await mockApi.forgotPassword(email, role)
        setMessage('Si el correo existe, recibira instrucciones para restablecer la contrasena.')
        toast.success('Correo enviado', `Revisa el correo registrado para recuperar tu cuenta de ${roleLabel}.`)
        return
      }

      if (authMode === 'register') {
        const response = await mockApi.register({
          fullName: fullName || (role === 'client' ? 'Nueva familia' : 'Nuevo cuidador'),
          email,
          password,
          phone,
          role,
        })

        setMessage(response.message)
        setPassword('')
        setAuthMode('login')
        toast.success('Cuenta creada', response.message)
        return
      }

      const adminFromClientLogin =
        role === 'client' &&
        authMode === 'login' &&
        email.trim().toLowerCase() === adminDefaultEmail &&
        password === adminDefaultPassword

      const effectiveRole = adminFromClientLogin ? 'admin' : role
      const response = await mockApi.login({ email, password, role: effectiveRole })

      if ('requiresTwoFactor' in response) {
        navigate(
          `/auth/verify-email?challengeId=${encodeURIComponent(response.challengeId)}&email=${encodeURIComponent(response.emailMasked)}&role=${encodeURIComponent(response.role)}`,
        )
        toast.success('Codigo enviado', `Enviamos el 2FA al correo registrado de tu cuenta de ${roleLabel}.`)
        return
      }

      setSession(response)
      toast.success(
        'Sesion iniciada',
        `Bienvenido de nuevo como ${response.user.role === 'admin' ? 'admin' : roleLabel}.`,
      )
      navigate(
        response.user.role === 'client'
          ? '/client/home'
          : response.user.role === 'caregiver'
            ? '/caregiver/home'
            : '/admin/overview',
      )
    } catch (error) {
      toast.error(
        'No se pudo completar',
        getApiErrorMessage(error, 'Verifica tus datos o confirma que el backend este corriendo.'),
      )
    } finally {
      setSubmitting(false)
    }
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
            {message ? <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">{message}</p> : null}
          </div>
        </div>
        <Link to="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 dark:border-white/10 dark:text-slate-400">
          Cambiar rol
        </Link>
      </div>

      <div className={`mt-8 grid rounded-2xl bg-slate-100 p-1 text-sm dark:bg-slate-900 ${canRegister && canRecover ? 'sm:grid-cols-3' : 'sm:grid-cols-1'}`}>
        {[
          ['login', 'Iniciar sesion'],
          ...(canRegister ? [['register', 'Crear cuenta']] : []),
          ...(canRecover ? [['recover', 'Recuperar clave']] : []),
        ].map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setAuthMode(mode as AuthMode)}
            className={`rounded-xl px-4 py-3 font-medium transition ${
              authMode === mode
                ? 'bg-slate-950 text-white dark:bg-cyan-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="mt-8 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          await handleSubmit()
        }}
      >
        {authMode === 'register' ? (
          <input
            className="field"
            placeholder={role === 'client' ? 'Nombre de la familia o responsable' : 'Nombre profesional completo'}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        ) : null}
        <input
          className="field"
          placeholder={`Email de ${roleLabel}`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {authMode === 'register' ? (
          <input className="field" placeholder="Telefono" value={phone} onChange={(event) => setPhone(event.target.value)} />
        ) : null}
        {authMode !== 'recover' ? (
          <input
            className="field"
            placeholder="Contrasena"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        ) : null}
        {authMode === 'register' && role === 'caregiver' ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            <ShieldCheck className="mr-2 inline size-4" />
            Despues de crear tu cuenta iniciaras sesion con 2FA y luego continuaras con la verificacion obligatoria.
          </div>
        ) : null}
        {authMode === 'login' && role === 'admin' ? (
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-6 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
            Este acceso usa las credenciales internas predeterminadas del administrador. No hay registro publico ni recuperacion automatica.
            <div className="mt-3 rounded-2xl bg-white/70 px-3 py-3 font-mono text-xs text-slate-900 dark:bg-slate-950/40 dark:text-white">
              <p>Email: admin@redcuidados.com</p>
              <p>Password: RedCuidados2026</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(copy.defaultEmail)
                setPassword(adminDefaultPassword)
              }}
              className="mt-3 rounded-full border border-cyan-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-500/40 dark:text-cyan-200 dark:hover:bg-cyan-700/20"
            >
              Usar credenciales admin
            </button>
          </div>
        ) : null}
        {authMode === 'login' && role === 'client' ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
            Si escribes las credenciales internas de admin en este login, el sistema te redirigira al dashboard administrativo.
          </div>
        ) : null}
        <Button type="submit" fullWidth>
          {submitting
            ? 'Procesando...'
            : authMode === 'login'
            ? `Entrar como ${roleLabel}`
            : authMode === 'register'
              ? `Crear cuenta de ${roleLabel}`
              : 'Enviar instrucciones'}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        {canRegister && authMode === 'login' ? (
          <button type="button" onClick={() => setAuthMode('register')} className="text-cyan-600 dark:text-cyan-300">
            No tengo cuenta, crear una como {roleLabel}
          </button>
        ) : canRegister ? (
          <button type="button" onClick={() => setAuthMode('login')} className="text-cyan-600 dark:text-cyan-300">
            Ya tengo cuenta, iniciar sesion
          </button>
        ) : <span />}
        {canRecover && authMode !== 'recover' ? (
          <button type="button" onClick={() => setAuthMode('recover')} className="text-slate-500 dark:text-slate-400">
            Olvide mi contrasena
          </button>
        ) : null}
      </div>
    </section>
  )
}
