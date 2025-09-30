export type UserRole = "admin" | "ta_member" | "panelist"

export interface AuthSession {
  userId: number
  username: string
  email: string
  role: UserRole
  token: string
  expiresAt: number
}

export interface LoginCredentials {
  username: string
  password: string
  role: UserRole
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image: string
  company: {
    department: string
    name: string
    title: string
  }
  role?: string
  university?: string
}

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
