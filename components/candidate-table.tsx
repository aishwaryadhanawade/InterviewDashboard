"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare } from "lucide-react"
import type { User } from "@/lib/types"
import { RoleGuard } from "./role-guard"

interface CandidateTableProps {
  candidates: User[]
  isLoading?: boolean
}

export function CandidateTable({ candidates, isLoading }: CandidateTableProps) {
  const [sortField, setSortField] = useState<keyof User | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button
                onClick={() => handleSort("firstName")}
                className="flex items-center gap-1 font-medium hover:text-foreground"
              >
                Name
              </button>
            </TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">
                {candidate.firstName} {candidate.lastName}
              </TableCell>
              <TableCell>{candidate.company?.department || "N/A"}</TableCell>
              <TableCell>{candidate.company?.title || "N/A"}</TableCell>
              <TableCell>
                <Badge variant={candidate.id % 3 === 0 ? "default" : "secondary"}>
                  {candidate.id % 3 === 0 ? "Scheduled" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/candidates/${candidate.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <RoleGuard permission="canSubmitFeedback">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/candidates/${candidate.id}?tab=feedback`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Feedback
                      </Link>
                    </Button>
                  </RoleGuard>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
