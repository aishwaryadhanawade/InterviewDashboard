"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { TopNav } from "@/components/top-nav"
import { KPICards } from "@/components/kpi-cards"
import { DashboardFilters } from "@/components/dashboard-filters"
import { InterviewChart } from "@/components/interview-chart"

export default function DashboardPage() {
  const { isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isHydrated, router])

  if (!isHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  const handleFilterChange = (filters: any) => {
    console.log("[v0] Dashboard filters changed:", filters)
    // Filter logic would be implemented here
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-balance">Overview of interview metrics and performance</p>
        </div>

        <div className="space-y-6">
          <KPICards interviewsThisWeek={67} averageFeedbackScore={7.8} noShows={3} />

          <DashboardFilters onFilterChange={handleFilterChange} />

          <InterviewChart />
        </div>
      </main>
    </div>
  )
}
