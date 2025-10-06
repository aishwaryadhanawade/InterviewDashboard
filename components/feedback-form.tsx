"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { submitFeedback } from "@/lib/api/posts"
import { Loader2 } from "lucide-react"
import { Post } from "@/lib/types"

const feedbackSchema = z.object({
  overallScore: z.number().min(1, "Score must be at least 1").max(10, "Score must be at most 10"),
  strengths: z.string().min(10, "Please provide at least 10 characters").trim(),
  areasForImprovement: z.string().min(10, "Please provide at least 10 characters").trim(),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

interface FeedbackFormProps {
  userId: number
  onSuccess?: (newPost:Post) => void
}

export function FeedbackForm({ userId, onSuccess }: FeedbackFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  })

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)

    try {
      const result = await submitFeedback({
        userId,
        overallScore: data.overallScore,
        strengths: data.strengths,
        areasForImprovement: data.areasForImprovement,
      })

      if (result.error) {
        toast({
          title: "Submission Failed",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been recorded successfully.",
      })

      reset()
      if (result.data) {
        onSuccess?.(result.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>Provide your assessment of the candidate</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="overallScore">Overall Score (1-10)</Label>
            <Input
              id="overallScore"
              type="number"
              min="1"
              max="10"
              placeholder="Enter score"
              disabled={isSubmitting}
              {...register("overallScore", { valueAsNumber: true })}
              aria-invalid={errors.overallScore ? "true" : "false"}
            />
            {errors.overallScore && (
              <p className="text-sm text-destructive" role="alert">
                {errors.overallScore.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="strengths">Strengths</Label>
            <Textarea
              id="strengths"
              placeholder="Describe the candidate's strengths..."
              rows={4}
              disabled={isSubmitting}
              {...register("strengths")}
              aria-invalid={errors.strengths ? "true" : "false"}
            />
            {errors.strengths && (
              <p className="text-sm text-destructive" role="alert">
                {errors.strengths.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
            <Textarea
              id="areasForImprovement"
              placeholder="Describe areas where the candidate can improve..."
              rows={4}
              disabled={isSubmitting}
              {...register("areasForImprovement")}
              aria-invalid={errors.areasForImprovement ? "true" : "false"}
            />
            {errors.areasForImprovement && (
              <p className="text-sm text-destructive" role="alert">
                {errors.areasForImprovement.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
