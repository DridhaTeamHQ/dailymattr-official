"use client"

import { useTransition } from "react"
import Link from "next/link"
import { LogOut, Users } from "lucide-react"

import { signOutAction } from "@/app/actions"
import { UserAvatar } from "@/components/cms/user-avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MenuUser = { name: string | null; email: string; image: string | null; role: "admin" | "member" }

/** Account menu in the top nav. For admins it's also the only way to reach /users. */
export function UserMenu({ user, pendingCount }: { user: MenuUser; pendingCount: number }) {
  const [signingOut, startSignOut] = useTransition()
  const isAdmin = user.role === "admin"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex items-center gap-3 rounded-full py-1 pr-1 pl-3 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted"
      >
        <span className="hidden text-right leading-tight sm:block">
          <span className="block max-w-48 truncate text-sm font-medium">{user.name ?? user.email}</span>
          <span className="block text-xs text-muted-foreground">{isAdmin ? "Admin" : "Editor"}</span>
        </span>
        <UserAvatar name={user.name} email={user.email} image={user.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 py-2 text-foreground">
            <UserAvatar name={user.name} email={user.email} image={user.image} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </div>
            {isAdmin && <Badge variant="info">Admin</Badge>}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/users" />}>
            <Users />
            Users
            {pendingCount > 0 && (
              <Badge variant="warning" className="ml-auto tabular-nums" aria-label={`${pendingCount} pending`}>
                {pendingCount}
              </Badge>
            )}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => startSignOut(() => signOutAction())}
        >
          <LogOut />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
