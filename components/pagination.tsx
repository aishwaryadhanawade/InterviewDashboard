"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={!canGoPrevious}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={!canGoNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
