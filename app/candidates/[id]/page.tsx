"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { TopNav } from "@/components/top-nav"
import { CandidateDetailTabs } from "@/components/candidate-detail-tabs"
import { Button } from "@/components/ui/button"
import { getUserById } from "@/lib/api/users"
import type { User } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [candidate, setCandidate] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const defaultTab = searchParams.get("tab") || "profile"

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isHydrated, router])

const { id } = React.use(params)
 
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchCandidate = async () => {
      setIsLoading(true)
      const result = await getUserById(Number.parseInt(id))
      if (result.data) {
        setCandidate(result.data)
      }
      setIsLoading(false)
    }

    fetchCandidate()
  }, [id, isAuthenticated])

  if (!isHydrated || !isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container py-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading candidate details...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
            <p className="text-muted-foreground mb-4">The candidate you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/candidates">Back to Candidates</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Candidates
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <p className="text-muted-foreground text-balance">View and manage candidate information</p>
        </div>

        <CandidateDetailTabs candidate={candidate} defaultTab={defaultTab} />
      </main>
    </div>
  )
}
