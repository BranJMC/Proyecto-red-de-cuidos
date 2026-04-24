import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RegisterRoleSelector } from '../../features/auth/RegisterRoleSelector'
import { CaregiverOnboardingWizard } from '../../features/verification/CaregiverOnboardingWizard'
import { Button } from '../../components/ui/Button'
import { useAppStore } from '../../store/useAppStore'

export function RegisterPage() {
  const role = useAppStore((state) => state.user.role)
  const [showCaregiverFlow, setShowCaregiverFlow] = useState(false)

  if (showCaregiverFlow && role === 'caregiver') {
    return (
      <section className="space-y-6">
        <div className="rounded-[36px] border border-amber-200 bg-amber-50/90 p-6 dark:border-amber-400/20 dark:bg-amber-400/10">
          <h1 className="font-display text-3xl text-slate-950 dark:text-white">Verificación obligatoria antes de entrar</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Tu cuenta de cuidador fue creada, pero no podrás acceder ni trabajar hasta completar la verificación completa, incluyendo currículum y hoja de vida.
          </p>
        </div>
        <CaregiverOnboardingWizard preAccess />
      </section>
    )
  }

  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Crea tu cuenta</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Elige tu perfil y continua con onboarding seguro.
      </p>
      <div className="mt-8">
        <RegisterRoleSelector />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder="Nombre completo" />
        <input className="field" placeholder="Email" />
        <input className="field" placeholder="Telefono" />
        <input className="field" placeholder="Contrasena" type="password" />
      </div>
      <Button className="mt-8" onClick={() => setShowCaregiverFlow(role === 'caregiver')}>
        Continuar registro
      </Button>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-cyan-600 dark:text-cyan-300">
          Inicia sesion
        </Link>
      </p>
    </section>
  )
}
