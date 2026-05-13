import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MessageThread, NotificationItem, SavedSearch, UserRole } from '../types'

interface ToastState {
  id: string
  title: string
  description: string
}

interface AppState {
  theme: 'light' | 'dark'
  user: {
    id?: string
    name: string
    email: string
    role: UserRole
    title: string
    avatar: string
  }
  token: string | null
  authenticated: boolean
  favorites: string[]
  notifications: NotificationItem[]
  threads: MessageThread[]
  savedSearches: SavedSearch[]
  toasts: ToastState[]
  setTheme: (theme: 'light' | 'dark') => void
  setRole: (role: UserRole) => void
  setSession: (payload: {
    token: string
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      title: string
      avatar: string
    }
  }) => void
  updateUserProfile: (payload: { name: string; phone?: string; avatar?: string }) => void
  clearSession: () => void
  toggleFavorite: (caregiverId: string) => void
  setFavorites: (favorites: string[]) => void
  setNotifications: (notifications: NotificationItem[]) => void
  setThreads: (threads: MessageThread[]) => void
  setSavedSearches: (savedSearches: SavedSearch[]) => void
  pushToast: (toast: Omit<ToastState, 'id'>) => void
  dismissToast: (id: string) => void
  markNotificationsRead: () => void
}

const emptyUser = {
  id: undefined,
  name: '',
  email: '',
  role: 'client' as UserRole,
  title: '',
  avatar: '',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      user: emptyUser,
      token: null,
      authenticated: false,
      favorites: [],
      notifications: [],
      threads: [],
      savedSearches: [],
      toasts: [],
      setTheme: (theme) => set({ theme }),
      setRole: (role) =>
        set((state) => ({
          user: {
            ...state.user,
            role,
          },
        })),
      setSession: ({ token, user }) =>
        set(() => ({
          token,
          authenticated: true,
          user,
        })),
      updateUserProfile: ({ name, avatar }) =>
        set((state) => ({
          user: {
            ...state.user,
            name,
            avatar: avatar ?? state.user.avatar,
          },
        })),
      clearSession: () =>
        set(() => ({
          token: null,
          authenticated: false,
          favorites: [],
          notifications: [],
          threads: [],
          savedSearches: [],
          user: emptyUser,
        })),
      toggleFavorite: (caregiverId) =>
        set((state) => ({
          favorites: state.favorites.includes(caregiverId)
            ? state.favorites.filter((id) => id !== caregiverId)
            : [...state.favorites, caregiverId],
        })),
      setFavorites: (favorites) => set({ favorites }),
      setNotifications: (notifications) => set({ notifications }),
      setThreads: (threads) => set({ threads }),
      setSavedSearches: (savedSearches) => set({ savedSearches }),
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
    {
      name: 'red-cuidados-store',
      version: 2,
      migrate: () => ({
        theme: 'light',
        user: emptyUser,
        token: null,
        authenticated: false,
        favorites: [],
        notifications: [],
        threads: [],
        savedSearches: [],
        toasts: [],
      }),
    },
  ),
)
