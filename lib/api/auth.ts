import { fetcher } from "../fetcher"
import type { LoginCredentials, AuthSession, ApiResponse } from "../types"
import { storage } from "../storage"

const API_BASE = "https://dummyjson.com"

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
  try {
    // Sanitize inputs
    const sanitizedUsername = credentials.username.trim()
    const sanitizedPassword = credentials.password.trim()

    const response = await fetcher<{
      id: number
      username: string
      email: string
      token: string
    }>(`${API_BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: sanitizedUsername,
        password: sanitizedPassword,
      }),
    })

    const session: AuthSession = {
      userId: response.id,
      username: response.username,
      email: response.email,
      token: response.token,
      role: credentials.role,
      expiresAt: Date.now() + 3600000, // 1 hour
    }

    // Store session securely (no password)
    storage.setJSON("auth_session", session)

    return { data: session }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Invalid credentials. Please try again." }
  }
}

export function logout(): void {
  storage.remove("auth_session")
}

export function getSession(): AuthSession | null {
  const session = storage.getJSON<AuthSession>("auth_session")

  if (!session) return null

  // Check if session expired
  if (Date.now() > session.expiresAt) {
    logout()
    return null
  }

  return session
}
