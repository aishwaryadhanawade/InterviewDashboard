"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { TopNav } from "@/components/top-nav"
import { CandidateTable } from "@/components/candidate-table"
import { CandidateSearch } from "@/components/candidate-search"
import { Pagination } from "@/components/pagination"
import { getUsers } from "@/lib/api/users"
import type { User } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const PAGE_SIZE = 10

export default function CandidatesPage() {
  const { isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()
  const [candidates, setCandidates] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isHydrated, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchCandidates = async () => {
      setIsLoading(true)
      const result = await getUsers({
        limit: PAGE_SIZE,
        skip: (currentPage - 1) * PAGE_SIZE,
        search: searchQuery,
      })

      if (result.data) {
        setCandidates(result.data.users)
        setTotal(result.data.total)
      }
      setIsLoading(false)
    }

    fetchCandidates()
  }, [currentPage, searchQuery, isAuthenticated])

  if (!isHydrated || !isAuthenticated) {
    return null
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Candidates</h1>
          <p className="text-muted-foreground text-balance">Manage and review interview candidates</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate List</CardTitle>
            <CardDescription>Search, filter, and manage candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CandidateSearch onSearch={handleSearch} />
            <CandidateTable candidates={candidates} isLoading={isLoading} />
            {!isLoading && candidates.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
