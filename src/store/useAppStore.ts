import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  caregivers,
  messageThreads,
  notifications,
  savedSearches,
} from '../services/mockData'
import { demoUsers } from '../utils/constants'
import type { NotificationItem, SavedSearch, UserRole } from '../types'

interface ToastState {
  id: string
  title: string
  description: string
}

interface AppState {
  theme: 'light' | 'dark'
  user: {
    name: string
    email: string
    role: UserRole
    title: string
    avatar: string
  }
  demoMode: boolean
  favorites: string[]
  notifications: NotificationItem[]
  threads: typeof messageThreads
  savedSearches: SavedSearch[]
  toasts: ToastState[]
  setTheme: (theme: 'light' | 'dark') => void
  setRole: (role: UserRole) => void
  enterDemo: (role: UserRole) => void
  exitDemo: () => void
  toggleFavorite: (caregiverId: string) => void
  pushToast: (toast: Omit<ToastState, 'id'>) => void
  dismissToast: (id: string) => void
  markNotificationsRead: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      user: demoUsers.client,
      demoMode: true,
      favorites: caregivers.slice(0, 3).map((caregiver) => caregiver.id),
      notifications,
      threads: messageThreads,
      savedSearches,
      toasts: [],
      setTheme: (theme) => set({ theme }),
      setRole: (role) =>
        set(() => ({
          user: demoUsers[role],
        })),
      enterDemo: (role) =>
        set(() => ({
          demoMode: true,
          user: demoUsers[role],
        })),
      exitDemo: () =>
        set(() => ({
          demoMode: false,
          user: demoUsers.client,
        })),
      toggleFavorite: (caregiverId) =>
        set((state) => ({
          favorites: state.favorites.includes(caregiverId)
            ? state.favorites.filter((id) => id !== caregiverId)
            : [...state.favorites, caregiverId],
        })),
      pushToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { id: crypto.randomUUID(), ...toast }],
        })),
      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({ ...item, read: true })),
        })),
    }),
    { name: 'red-cuidados-store' },
  ),
)
