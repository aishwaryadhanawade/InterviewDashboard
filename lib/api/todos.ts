import { fetcher } from "../fetcher"
import type { Todo, ApiResponse } from "../types"

const API_BASE = "https://dummyjson.com"

export async function getTodosByUserId(userId: number): Promise<ApiResponse<{ todos: Todo[] }>> {
  try {
    const response = await fetcher<{ todos: Todo[] }>(`${API_BASE}/todos/user/${userId}`)
    return { data: response }
  } catch (error) {
    return { error: "Failed to fetch schedule" }
  }
}
