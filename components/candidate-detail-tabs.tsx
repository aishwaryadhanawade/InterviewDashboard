"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FeedbackForm } from "./feedback-form"
import { RoleGuard } from "./role-guard"
import { getTodosByUserId } from "@/lib/api/todos"
import { getPostsByUserId } from "@/lib/api/posts"
import type { User, Todo, Post } from "@/lib/types"
import { Mail, Phone, Building, CheckCircle2, Circle, Calendar } from "lucide-react"

interface CandidateDetailTabsProps {
  candidate: User
  defaultTab?: string
}

export function CandidateDetailTabs({ candidate, defaultTab = "profile" }: CandidateDetailTabsProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingTodos, setIsLoadingTodos] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoadingTodos(true)
      const result = await getTodosByUserId(candidate.id)
      if (result.data) {
        setTodos(result.data.todos)
      }
      setIsLoadingTodos(false)
    }

    const fetchPosts = async () => {
      setIsLoadingPosts(true)
      const result = await getPostsByUserId(candidate.id)
      if (result.data) {
        setPosts(result.data.posts)
      }
      setIsLoadingPosts(false)
    }

    fetchTodos()
    fetchPosts()
  }, [candidate.id])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
            <CardDescription>Basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={candidate.image || "/placeholder.svg"}
                  alt={`${candidate.firstName} ${candidate.lastName}`}
                />
                <AvatarFallback>{getInitials(candidate.firstName, candidate.lastName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p className="text-muted-foreground">{candidate.company?.title || "N/A"}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{candidate.company?.department || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{candidate.company?.name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Resume</h4>
              <a
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  alert("Resume download would be implemented here")
                }}
              >
                Download Resume (PDF)
              </a>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Interview Schedule</CardTitle>
            <CardDescription>Upcoming and past interview tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTodos ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : todos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No scheduled interviews</p>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    {todo.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{todo.todo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={todo.completed ? "default" : "secondary"}>
                      {todo.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <RoleGuard permission="canSubmitFeedback">
          <FeedbackForm
            userId={candidate.id}
            onSuccess={(newPost) => {
      // Prepend the new feedback to the existing posts list
      setPosts((prevPosts) => [newPost, ...prevPosts])
    }}
          />
        </RoleGuard>

        <Card>
          <CardHeader>
            <CardTitle>Previous Feedback</CardTitle>
            <CardDescription>Feedback submitted by interviewers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No feedback submitted yet</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{post.title}</h4>
                      <div className="flex gap-1">
                        {post?.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{post.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{post?.reactions?.likes} likes</span>
                      <span>{post?.reactions?.dislikes} dislikes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
