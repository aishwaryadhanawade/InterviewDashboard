import type { UserRole } from "./types"

export const permissions = {
  admin: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewCandidateDetails: true,
    canSubmitFeedback: false,
    canManageRoles: true,
    canViewAllFeedback: true,
  },
  ta_member: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewCandidateDetails: true,
    canSubmitFeedback: false,
    canManageRoles: false,
    canViewAllFeedback: true,
  },
  panelist: {
    canViewDashboard: true,
    canViewCandidates: true,
    canViewCandidateDetails: true,
    canSubmitFeedback: true,
    canManageRoles: false,
    canViewAllFeedback: false,
  },
}

export function hasPermission(role: UserRole | undefined, permission: keyof typeof permissions.admin): boolean {
  if (!role) return false
  return permissions[role][permission]
}

export function canAccessRoute(role: UserRole | undefined, route: string): boolean {
  if (!role) return false

  if (route.startsWith("/admin")) {
    return role === "admin"
  }

  return true
}
