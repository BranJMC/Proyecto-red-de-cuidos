import { Link } from 'react-router-dom'

export function Logo({ dark = false, href = '/' }: { dark?: boolean; href?: string }) {
  return (
    <Link to={href} className="flex items-center gap-3 font-semibold tracking-tight">
      <img
        src="/brand/carewy-logo.png"
        alt="CareWy"
        className={`h-12 w-auto rounded-2xl object-cover shadow-sm ${dark ? 'ring-1 ring-white/10' : 'ring-1 ring-slate-200'}`}
      />
      <div className="min-w-0">
        <p className={`font-display text-xl leading-none ${dark ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
          CareWy
        </p>
        <p className={`mt-1 text-xs ${dark ? 'text-white/65' : 'text-slate-500 dark:text-slate-400'}`}>
          Plataforma de cuidado
        </p>
      </div>
    </Link>
  )
}
