import { MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from '../../contexts/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
    >
      {theme === 'dark' ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
      {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    </button>
  )
}
