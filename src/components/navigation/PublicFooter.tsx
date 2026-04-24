import { Link } from 'react-router-dom'
import { footerNav } from '../../utils/constants'
import { Logo } from '../branding/Logo'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            Startup-grade caregiving marketplace con verificacion, pagos, soporte,
            operaciones y experiencia PWA lista para demo comercial.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-400">
          {footerNav.map((item) => (
            <Link key={item.href} to={item.href} className="transition hover:text-slate-950 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
