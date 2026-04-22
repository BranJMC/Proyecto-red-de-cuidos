import { motion } from 'framer-motion'
import {
  BadgeCheck,
  BriefcaseMedical,
  HeartHandshake,
  KeyRound,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { InfoCard } from '../../components/ui/InfoCard'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import type { UserRole } from '../../types'

type EntryRole = Extract<UserRole, 'client' | 'caregiver'>

const roleCards: {
  role: EntryRole
  title: string
  subtitle: string
  description: string
  icon: ReactNode
}[] = [
  {
    role: 'client',
    title: 'Ingresar como cliente',
    subtitle: 'Necesito contratar cuidado',
    description: 'Reserva cuidadores verificados, sube comprobantes y recibe seguimiento durante el servicio.',
    icon: <HeartHandshake className="size-6" />,
  },
  {
    role: 'caregiver',
    title: 'Ingresar como cuidador',
    subtitle: 'Quiero ofrecer mis servicios',
    description: 'Registra tu perfil profesional, completa verificacion obligatoria y administra reservas.',
    icon: <BriefcaseMedical className="size-6" />,
  },
]

export function LandingPage() {
  const { canInstall, install } = useInstallPrompt()

  return (
    <div className="pb-24">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 shadow-lg shadow-cyan-100/60 dark:border-cyan-400/20 dark:bg-slate-900/70 dark:text-cyan-300 dark:shadow-none">
            <Sparkles className="size-4" />
            App movil de cuidado verificado
          </div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Primero elige como quieres entrar.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Red de Cuidados separa la experiencia desde el inicio: familias que necesitan apoyo y cuidadores que desean trabajar con verificacion, agenda, comprobantes y seguridad operativa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {canInstall ? <Button onClick={install}>Instalar app</Button> : null}
            <Link to="/demo">
              <Button variant="secondary">Ver demo de dashboards</Button>
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            El acceso admin se mantiene fuera de esta pantalla publica y solo queda disponible para operaciones internas.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[48px] bg-[linear-gradient(135deg,_rgba(34,211,238,0.28),_rgba(15,23,42,0.06)_55%,_rgba(16,185,129,0.16))] blur-2xl dark:bg-[linear-gradient(135deg,_rgba(34,211,238,0.24),_rgba(15,23,42,0.45)_55%,_rgba(16,185,129,0.14))]" />
          <div className="rounded-[42px] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-slate-300/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none sm:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {roleCards.map((item) => (
                <Link
                  key={item.role}
                  to={`/auth/access/${item.role}`}
                  className="group rounded-[30px] border border-slate-200 bg-white/75 p-5 text-left text-slate-950 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100/50 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:hover:shadow-none"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-600 transition group-hover:bg-slate-950 group-hover:text-white dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-hover:bg-cyan-400 dark:group-hover:text-slate-950">
                      {item.icon}
                    </span>
                    <BadgeCheck className="size-5 text-cyan-500 opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                  <h2 className="mt-2 font-display text-2xl">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Que hace Red de Cuidados"
          title="Una plataforma completa para contratar y operar servicios de cuidado con mas confianza."
          description="Despues de elegir tu rol, la app te lleva a una experiencia pensada para familias o cuidadores, con flujos separados, seguridad y seguimiento."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Identidad verificada" description="Cedula, biometria, OTP email y SMS en onboarding estricto para cuidadores." icon={<ShieldCheck className="size-5" />} />
          <InfoCard title="Reserva guiada" description="Calendario, rango horario, estimacion de precio y comprobante en un solo flujo." icon={<UserRoundCheck className="size-5" />} />
          <InfoCard title="Mensajeria viva" description="Chat, evidencia por hora, entrada y salida del servicio para mayor tranquilidad." icon={<MessageSquareMore className="size-5" />} />
          <InfoCard title="Comprobantes con AI" description="Los pagos se validan por comprobante con revision automatica y apoyo humano." icon={<BadgeCheck className="size-5" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ['Para familias', 'Encuentra apoyo por horas, emergencias, adulto mayor, infancia, discapacidad o asistencia en casa.'],
            ['Para cuidadores', 'Administra zonas, tarifas, agenda, documentos, resenas y recordatorios de proximos servicios.'],
            ['Para operaciones', 'El equipo interno revisa aprobaciones, comprobantes, reportes, fraude, auditoria y backups diarios.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[32px] border border-slate-200 bg-white/85 p-7 shadow-lg shadow-slate-200/30 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
              <KeyRound className="size-6 text-cyan-500" />
              <h3 className="mt-5 font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
