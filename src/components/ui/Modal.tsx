import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl dark:bg-slate-950"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
              <button
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
