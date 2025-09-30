"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardFiltersProps {
  onFilterChange: (filters: {
    role?: string
    interviewer?: string
    dateFrom?: string
    dateTo?: string
  }) => void
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [filters, setFilters] = useState({
    role: "",
    interviewer: "",
    dateFrom: "",
    dateTo: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      role: "",
      interviewer: "",
      dateFrom: "",
      dateTo: "",
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="role-filter">Role</Label>
            <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="fullstack">Full Stack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewer-filter">Interviewer</Label>
            <Input
              id="interviewer-filter"
              placeholder="Search interviewer"
              value={filters.interviewer}
              onChange={(e) => handleFilterChange("interviewer", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-from">Date From</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to">Date To</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
