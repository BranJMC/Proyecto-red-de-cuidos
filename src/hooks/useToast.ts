import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useToast() {
  const pushToast = useAppStore((state) => state.pushToast)
  return useMemo(
    () => ({
      success(title: string, description: string) {
        pushToast({ title, description })
      },
    }),
    [pushToast],
  )
}
