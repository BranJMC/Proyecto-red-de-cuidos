import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  fullWidth,
  ...props
}: ButtonProps) {
  const variants: Record<Variant, string> = {
    primary:
      'bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300',
    secondary:
      'bg-white/80 text-slate-950 ring-1 ring-slate-200 hover:bg-white dark:bg-slate-900 dark:text-white dark:ring-white/10 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition ${
        variants[variant]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
