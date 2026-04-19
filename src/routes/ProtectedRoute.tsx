import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const role = useAppStore((state) => state.user.role)

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
