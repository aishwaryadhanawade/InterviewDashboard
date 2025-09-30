"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { day: "Mon", interviews: 12 },
  { day: "Tue", interviews: 15 },
  { day: "Wed", interviews: 8 },
  { day: "Thu", interviews: 18 },
  { day: "Fri", interviews: 14 },
]

export function InterviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Interview Distribution</CardTitle>
        <CardDescription>Number of interviews scheduled per day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            interviews: {
              label: "Interviews",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="interviews" fill="var(--color-interviews)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
