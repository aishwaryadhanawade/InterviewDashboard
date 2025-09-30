"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUsers } from "@/lib/api/users"
import type { User, UserRole } from "@/lib/types"
import { Shield, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RoleManagementPage() {
  const { isAuthenticated, isHydrated, session } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRoles, setUserRoles] = useState<Record<number, UserRole>>({})

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }

    if (isHydrated && isAuthenticated && session?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isHydrated, session, router])

  useEffect(() => {
    if (!isAuthenticated || session?.role !== "admin") return

    const fetchUsers = async () => {
      setIsLoading(true)
      const result = await getUsers({ limit: 20 })
      if (result.data) {
        setUsers(result.data.users)
        // Initialize mock roles
        const initialRoles: Record<number, UserRole> = {}
        result.data.users.forEach((user) => {
          initialRoles[user.id] = ["admin", "ta_member", "panelist"][user.id % 3] as UserRole
        })
        setUserRoles(initialRoles)
      }
      setIsLoading(false)
    }

    fetchUsers()
  }, [isAuthenticated, session])

  if (!isHydrated || !isAuthenticated || session?.role !== "admin") {
    return null
  }

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUserRoles((prev) => ({
      ...prev,
      [userId]: newRole,
    }))

    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole.replace("_", " ")}`,
    })
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "default"
      case "ta_member":
        return "secondary"
      case "panelist":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-balance">Role Management</h1>
          </div>
          <p className="text-muted-foreground text-balance">Manage user roles and permissions</p>
        </div>

        <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Admin Only Access</p>
              <p className="text-sm text-muted-foreground">
                This page is only accessible to administrators. Role changes are simulated on the frontend.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Assign and manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.company?.department || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(userRoles[user.id])}>
                            {userRoles[user.id]?.replace("_", " ") || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={userRoles[user.id]}
                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                          >
                            <SelectTrigger className="w-[140px] ml-auto">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="ta_member">TA Member</SelectItem>
                              <SelectItem value="panelist">Panelist</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Role Permissions Matrix</CardTitle>
            <CardDescription>Overview of permissions for each role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">TA Member</TableHead>
                    <TableHead className="text-center">Panelist</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">View Dashboard</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">View Candidates</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Submit Feedback</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">No</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">No</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">View All Feedback</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">No</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Manage Roles</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">Yes</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">No</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">No</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
