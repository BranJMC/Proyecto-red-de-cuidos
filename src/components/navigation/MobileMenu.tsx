import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NavItem } from '../../types'

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900"
        onClick={() => setOpen((value) => !value)}
      >
        <Menu className="size-5 text-slate-700 dark:text-slate-100" />
      </button>
      {open ? (
        <div className="absolute inset-x-4 top-20 z-40 rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-xl dark:border-white/10 dark:bg-slate-950/95">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
