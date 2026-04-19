import { HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight">
      <div
        className={`flex size-11 items-center justify-center rounded-2xl ${
          dark ? 'bg-white/12 text-white' : 'bg-slate-950 text-white'
        } shadow-lg shadow-cyan-500/10`}
      >
        <HeartHandshake className="size-5" />
      </div>
      <div>
        <p className={`font-display text-lg ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
          Red de Cuidados
        </p>
        <p className={`text-xs ${dark ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'}`}>
          Trust-first care marketplace
        </p>
      </div>
    </Link>
  )
}
