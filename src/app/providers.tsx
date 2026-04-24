import type { ReactNode } from 'react'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ToastViewport } from '../components/ui/ToastViewport'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <ToastViewport />
    </ThemeProvider>
  )
}
