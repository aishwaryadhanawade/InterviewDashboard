"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthSession } from "@/lib/types"
import { getSession, logout as logoutApi } from "@/lib/api/auth"

interface AuthContextType {
  session: AuthSession | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [role, setRole] = useState<AuthSession | null>(null)

  useEffect(() => {
    // Hydrate session from storage
    const storedSession = getSession()
    setSession(storedSession)
    setIsHydrated(true)
  }, [])

  const login = (newSession: AuthSession) => {
    setSession(newSession)
  }

  const logout = () => {
    logoutApi()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isHydrated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
