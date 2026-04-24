import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

export function ToastViewport() {
  const toasts = useAppStore((state) => state.toasts)
  const dismissToast = useAppStore((state) => state.dismissToast)

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 3500),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [dismissToast, toasts])

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pointer-events-auto w-80 rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/90 dark:shadow-none"
          >
            <p className="font-medium text-slate-950 dark:text-white">{toast.title}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{toast.description}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
