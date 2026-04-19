import { Link, NavLink } from 'react-router-dom'
import { publicNav } from '../../utils/constants'
import { Logo } from '../branding/Logo'
import { Button } from '../ui/Button'
import { MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {publicNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-sm transition ${
                  isActive
                    ? 'text-slate-950 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link to="/demo">
            <Button variant="secondary">Demo mode</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="ghost">Ingresar</Button>
          </Link>
          <Link to="/auth/register">
            <Button>Crear cuenta</Button>
          </Link>
        </div>
        <MobileMenu items={[...publicNav, { label: 'Demo', href: '/demo' }, { label: 'Ingresar', href: '/auth/login' }]} />
      </div>
    </header>
  )
}
