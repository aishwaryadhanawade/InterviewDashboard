"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { login } from "@/lib/api/auth"
import type { UserRole } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "ta_member", "panelist"]).optional(),
  // role: z.enum(["admin", "ta_member", "panelist"], {
  //   required_error: "Please select a role",
  // }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login: setSession } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    role: "panelist", 
  },
});

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
       const role = data.role ?? "panelist";
      const result = await login({
        
        username: data.username,
        password: data.password,
        role,
      })

      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.data) {
        setSession(result.data)
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.data.username}!`,
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-balance">Interview Management</CardTitle>
          <CardDescription className="text-balance">Sign in to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                disabled={isLoading}
                {...register("username")}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                disabled={isLoading}
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select disabled={isLoading}  onValueChange={(value) => setValue("role", value as UserRole)}>
                <SelectTrigger id="role" aria-invalid={errors.role ? "true" : "false"}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="ta_member">TA Member</SelectItem>
                  <SelectItem value="panelist">Panelist</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Test Credentials:</p>
            <p className="text-xs text-muted-foreground">
              Username: <span className="font-mono text-foreground">emilys</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Password: <span className="font-mono text-foreground">emilyspass</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
