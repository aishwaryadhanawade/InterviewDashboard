import { fetcher } from "../fetcher"
import type { Post, ApiResponse } from "../types"

const API_BASE = "https://dummyjson.com"

export async function getPostsByUserId(userId: number): Promise<ApiResponse<{ posts: Post[] }>> {
  try {
    const response = await fetcher<{ posts: Post[] }>(`${API_BASE}/posts/user/${userId}`)
    return { data: response }
  } catch (error) {
    return { error: "Failed to fetch feedback" }
  }
}

export async function submitFeedback(data: {
  userId: number
  overallScore: number
  strengths: string
  areasForImprovement: string
}): Promise<ApiResponse<Post>> {
  try {
    // Sanitize inputs
    const sanitizedData = {
      title: `Feedback - Score: ${data.overallScore}/10`,
      body: `Strengths: ${data.strengths.trim()}\n\nAreas for Improvement: ${data.areasForImprovement.trim()}`,
      userId: data.userId,
    }

    const response = await fetcher<Post>(`${API_BASE}/posts/add`, {
      method: "POST",
      body: JSON.stringify(sanitizedData),
    })

    return { data: response }
  } catch (error) {
    return { error: "Failed to submit feedback" }
  }
}
