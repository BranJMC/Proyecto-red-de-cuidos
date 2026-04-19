import { Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

const roles: { role: UserRole; title: string; description: string }[] = [
  {
    role: 'client',
    title: 'Cliente',
    description: 'Familias que buscan cuidado infantil, adulto mayor o apoyo por horas.',
  },
  {
    role: 'caregiver',
    title: 'Cuidador',
    description: 'Profesionales verificados con onboarding seguro, documentos y disponibilidad.',
  },
  {
    role: 'admin',
    title: 'Admin',
    description: 'Operaciones, aprobaciones, riesgo y metricas de toda la plataforma.',
  },
]

export function RegisterRoleSelector() {
  const selectedRole = useAppStore((state) => state.user.role)
  const setRole = useAppStore((state) => state.setRole)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {roles.map((item) => (
        <button
          key={item.role}
          type="button"
          onClick={() => setRole(item.role)}
          className={`rounded-[28px] border p-5 text-left transition ${
            selectedRole === item.role
              ? 'border-slate-950 bg-slate-950 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
              : 'border-slate-200 bg-white/80 hover:border-cyan-500 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-400'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl">{item.title}</h3>
            {selectedRole === item.role ? <Check className="size-5" /> : null}
          </div>
          <p className={`text-sm ${selectedRole === item.role ? 'text-white/75 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
            {item.description}
          </p>
        </button>
      ))}
    </div>
  )
}
