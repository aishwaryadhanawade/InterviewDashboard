"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface InterviewChartProps {
  data: { day: string; interviews: number }[]
}

export function InterviewChart({ data }: InterviewChartProps) {
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
            <BarChart data={data}>
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
