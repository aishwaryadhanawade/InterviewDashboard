import { fetcher } from "../fetcher"
import type { User, ApiResponse } from "../types"

const API_BASE = "https://dummyjson.com"

export async function getUsers(params?: {
  limit?: number
  skip?: number
  search?: string
}): Promise<ApiResponse<{ users: User[]; total: number }>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.skip) queryParams.append("skip", params.skip.toString())

    let url = `${API_BASE}/users`

    if (params?.search) {
      // Use search endpoint for filtering
      url = `${API_BASE}/users/search?q=${encodeURIComponent(params.search.trim())}`
    }

    if (queryParams.toString() && !params?.search) {
      url += `?${queryParams.toString()}`
    } else if (queryParams.toString() && params?.search) {
      url += `&${queryParams.toString()}`
    }

    const response = await fetcher<{ users: User[]; total: number }>(url)
    return { data: response }
  } catch (error) {
    return { error: "Failed to fetch candidates" }
  }
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  try {
    const response = await fetcher<User>(`${API_BASE}/users/${id}`)
    return { data: response }
  } catch (error) {
    return { error: "Failed to fetch candidate details" }
  }
}
