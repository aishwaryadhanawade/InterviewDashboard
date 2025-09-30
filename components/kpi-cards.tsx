"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, UserX } from "lucide-react"

interface KPICardsProps {
  interviewsThisWeek: number
  averageFeedbackScore: number
  noShows: number
}

export function KPICards({ interviewsThisWeek, averageFeedbackScore, noShows }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interviews This Week</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviewsThisWeek}</div>
          <p className="text-xs text-muted-foreground">Scheduled interviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Feedback Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageFeedbackScore.toFixed(1)}/10</div>
          <p className="text-xs text-muted-foreground">Overall performance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{noShows}</div>
          <p className="text-xs text-muted-foreground">Missed interviews</p>
        </CardContent>
      </Card>
    </div>
  )
}
