"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { TopNav } from "@/components/top-nav"
import { KPICards } from "@/components/kpi-cards"
import { DashboardFilters } from "@/components/dashboard-filters"
import { InterviewChart } from "@/components/interview-chart"

const initialData = [
  { day: "Mon", interviews: 12, role: "frontend", date: "2025-09-06" },
  { day: "Tue", interviews: 15, role: "backend", date: "2025-08-07" },
  { day: "Wed", interviews: 8, role: "fullstack", date: "2025-09-08" },
  { day: "Thu", interviews: 18, role: "frontend", date: "2025-09-09" },
  { day: "Fri", interviews: 14, role: "backend", date: "2025-10-01" },
]


export default function DashboardPage() {
  const { isAuthenticated, isHydrated } = useAuth()
  const router = useRouter()

  const [chartData, setChartData] = useState(initialData)

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isHydrated, router])

  if (!isHydrated) return null
  if (!isAuthenticated) return null

  const handleFilterChange = (filters: any) => {
  console.log("Dashboard filters changed:", filters)

  let filteredData = initialData

  // Filter by role
  if (filters.role && filters.role !== "all") {
    filteredData = filteredData.filter((item) => item.role === filters.role)
  }

  // Filter by date range
  if (filters.dateFrom) {
    filteredData = filteredData.filter(
      (item) => new Date(item.date) >= new Date(filters.dateFrom)
    )
  }

  if (filters.dateTo) {
    filteredData = filteredData.filter(
      (item) => new Date(item.date) <= new Date(filters.dateTo)
    )
  }

  setChartData(filteredData)
}


  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard</h1>
          <p className="text-muted-foreground text-balance">
            Overview of interview metrics and performance
          </p>
        </div>

        <div className="space-y-6">
          <KPICards interviewsThisWeek={67} averageFeedbackScore={7.8} noShows={3} />

          <DashboardFilters onFilterChange={handleFilterChange} />

          <InterviewChart data={chartData} />
        </div>
      </main>
    </div>
  )
}
