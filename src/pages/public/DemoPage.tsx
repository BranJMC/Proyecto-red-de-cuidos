import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'
import { demoUsers } from '../../utils/constants'

const destinations: Record<UserRole, string> = {
  client: '/client/home',
  caregiver: '/caregiver/home',
  admin: '/admin/overview',
}

export function DemoPage() {
  const navigate = useNavigate()
  const enterDemo = useAppStore((state) => state.enterDemo)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">Demo mode</p>
        <h1 className="mt-4 font-display text-6xl text-slate-950 dark:text-white">Explora cada rol sin login.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-500 dark:text-slate-400">
          Cambia entre cliente, cuidador y admin con datos realistas para revisar la plataforma completa.
        </p>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {(Object.keys(demoUsers) as UserRole[]).map((role, index) => {
          const user = demoUsers[role]
          return (
            <motion.button
              key={role}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => {
                enterDemo(role)
                navigate(destinations[role])
              }}
              className="group rounded-[36px] border border-slate-200 bg-white/90 p-8 text-left shadow-xl shadow-slate-200/30 transition hover:-translate-y-1 hover:border-cyan-500 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none"
            >
              <img src={user.avatar} alt={user.name} className="size-20 rounded-[26px] object-cover" />
              <p className="mt-6 text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">{role}</p>
              <h2 className="mt-3 font-display text-4xl text-slate-950 dark:text-white">Enter as {role[0].toUpperCase() + role.slice(1)} Demo</h2>
              <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">{user.title}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                Abrir dashboard <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
