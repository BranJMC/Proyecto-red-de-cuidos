import { motion } from 'framer-motion'
import {
  BadgeCheck,
  CreditCard,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { caregivers } from '../../services/mockData'
import { pricingPlans } from '../../utils/constants'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { BookingModal } from '../../features/booking/BookingModal'
import { Button } from '../../components/ui/Button'
import { InfoCard } from '../../components/ui/InfoCard'
import { RatingStars } from '../../components/ui/RatingStars'
import { SectionHeading } from '../../components/ui/SectionHeading'

export function LandingPage() {
  const { canInstall, install } = useInstallPrompt()

  return (
    <div className="pb-24">
      <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 shadow-lg shadow-cyan-100/60 dark:border-cyan-400/20 dark:bg-slate-900/70 dark:text-cyan-300 dark:shadow-none">
            <Sparkles className="size-4" />
            PWA + Trust & Safety First
          </div>
          <h1 className="mt-8 font-display text-5xl leading-[1.02] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            El marketplace premium para cuidado humano verificado.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Red de Cuidados conecta familias, cuidadores y equipos operativos en una sola plataforma: reservas, verificacion de identidad, chat en vivo, pagos y administracion de calidad.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/auth/register">
              <Button>Comenzar ahora</Button>
            </Link>
            <Link to="/client/search">
              <Button variant="secondary">Explorar cuidadores</Button>
            </Link>
            {canInstall ? (
              <Button variant="ghost" onClick={install}>
                Instalar app
              </Button>
            ) : null}
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ['12 min', 'Tiempo promedio de match'],
              ['98.4%', 'Reservas completadas con exito'],
              ['31 ciudades', 'Cobertura en expansion'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
                <p className="font-display text-3xl text-slate-950 dark:text-white">{value}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[40px] bg-[linear-gradient(135deg,_rgba(34,211,238,0.26),_rgba(15,23,42,0.06)_55%,_rgba(34,211,238,0.08))] blur-2xl dark:bg-[linear-gradient(135deg,_rgba(34,211,238,0.26),_rgba(15,23,42,0.36)_55%,_rgba(34,211,238,0.12))]" />
          <div className="overflow-hidden rounded-[36px] border border-white/80 bg-white/85 p-6 shadow-2xl shadow-slate-300/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/75 dark:shadow-none">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-950 p-5 text-white dark:bg-slate-900">
                <p className="text-sm text-white/60">Live operations</p>
                <p className="mt-4 font-display text-4xl">2,418</p>
                <p className="mt-2 text-sm text-white/65">Horas de cuidado reservadas esta semana</p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Verificacion</p>
                    <p className="mt-2 font-display text-2xl text-slate-950 dark:text-white">31 expedientes</p>
                  </div>
                  <BadgeCheck className="size-10 text-cyan-500" />
                </div>
                <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 w-3/4 rounded-full bg-cyan-500" />
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Top caregiver</p>
                  <p className="mt-1 font-display text-2xl text-slate-950 dark:text-white">
                    {caregivers[0].name}
                  </p>
                </div>
                <img
                  src={caregivers[0].image}
                  alt={caregivers[0].name}
                  className="size-16 rounded-2xl object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <RatingStars value={caregivers[0].rating} />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {caregivers[0].specialty}
                  </p>
                </div>
                <BookingModal caregiverName={caregivers[0].name} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Por que Red de Cuidados"
          title="Construida como una startup de alto crecimiento, no como un marketplace improvisado."
          description="Arquitectura escalable, UX mobile-first, controles de confianza y workflows listos para equipos de operaciones."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Identidad verificada" description="Cedula, biometria, OTP email y SMS en onboarding estricto." icon={<ShieldCheck className="size-5" />} />
          <InfoCard title="Mensajeria viva" description="Chat estilo messenger, typing indicator, online status y adjuntos." icon={<MessageSquareMore className="size-5" />} />
          <InfoCard title="Pagos listos" description="UI premium preparada para checkout, wallet y conciliacion." icon={<CreditCard className="size-5" />} />
          <InfoCard title="Marketplace curado" description="Matching por disponibilidad, especialidad, urgencia e idioma." icon={<UsersRound className="size-5" />} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Planes"
          title="Modelo comercial listo para consumidores, premium y enterprise."
          description="Cada plan esta disenado para escalar desde una familia hasta alianzas institucionales."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[32px] border p-8 ${
                plan.highlighted
                  ? 'border-slate-950 bg-slate-950 text-white shadow-2xl shadow-slate-950/25 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                  : 'border-slate-200 bg-white/85 dark:border-white/10 dark:bg-slate-900/70'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.24em] opacity-70">{plan.name}</p>
              <p className="mt-4 font-display text-5xl">{plan.price}</p>
              <p className="mt-4 text-sm leading-6 opacity-75">{plan.description}</p>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant={plan.highlighted ? 'secondary' : 'primary'} fullWidth>
                  Solicitar demo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
