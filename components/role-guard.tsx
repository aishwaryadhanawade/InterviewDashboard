"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import { hasPermission, permissions } from "@/lib/rbac"
import type { UserRole } from "@/lib/types"

interface RoleGuardProps {
  children: ReactNode
  permission?: keyof typeof permissions.admin
  roles?: UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, permission, roles, fallback = null }: RoleGuardProps) {
  const { session, isHydrated } = useAuth()

  if (!isHydrated) {
    return null
  }

  if (!session) {
    return <>{fallback}</>
  }

  // Check role-based access
  if (roles && !roles.includes(session.role)) {
    return <>{fallback}</>
  }

  // Check permission-based access
  if (permission && !hasPermission(session.role, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
