import { type ReactNode, useEffect, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [setTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
