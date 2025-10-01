"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "./role-guard"

export function TopNav() {
  const { session, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">IM</span>
            </div>
            <span className="hidden font-semibold sm:inline-block">Interview Management</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/dashboard" className="text-foreground/60 transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/candidates" className="text-foreground/60 transition-colors hover:text-foreground">
              Candidates
            </Link>
            <RoleGuard roles={["admin"]}>
              <Link href="/admin/roles" className="text-foreground/60 transition-colors hover:text-foreground">
                Role Management
              </Link>
            </RoleGuard>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session && (
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-muted-foreground">Role:</span>
              <span className="rounded-md bg-muted px-2 py-1 font-medium capitalize">
                {session.role.replace("_", " ")}
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{session ? getInitials(session.username) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">{session?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
