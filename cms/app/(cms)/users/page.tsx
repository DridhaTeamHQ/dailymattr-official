import { Suspense } from "react"
import type { Metadata } from "next"
import { format } from "date-fns"

import { PageHeader } from "@/components/cms/page-header"
import { UserAvatar } from "@/components/cms/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireAdmin } from "@/lib/dal"
import type { User, UserStatus } from "@/lib/generated/prisma/client"
import { listUsers } from "@/lib/users"

import { UserActions } from "./user-actions"

export const metadata: Metadata = { title: "Users" }

/** Amber while waiting, green once approved, red when rejected. */
const statusBadge = { pending: "warning", approved: "success", rejected: "destructive" } as const

const tabs: { status: UserStatus; label: string; empty: string }[] = [
  { status: "pending", label: "Pending", empty: "No one is waiting for approval." },
  { status: "approved", label: "Approved", empty: "No approved users yet." },
  { status: "rejected", label: "Rejected", empty: "No rejected users." },
]

/** Admins only: approve or reject people who signed in with Google. */
export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="New Google sign-ins wait here until an admin accepts or rejects them."
      />
      <Suspense fallback={<UsersSkeleton />}>
        <UsersTabs />
      </Suspense>
    </div>
  )
}

async function UsersTabs() {
  await requireAdmin()
  const all = await listUsers()
  const byStatus = (status: UserStatus) => all.filter((user) => user.status === status)

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        {tabs.map((tab) => {
          const count = byStatus(tab.status).length
          return (
            <TabsTrigger key={tab.status} value={tab.status}>
              {tab.label}
              <Badge variant={count ? statusBadge[tab.status] : "secondary"} className="tabular-nums">
                {count}
              </Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.status} value={tab.status}>
          <UsersTable users={byStatus(tab.status)} status={tab.status} empty={tab.empty} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function UsersTable({ users, status, empty }: { users: User[]; status: UserStatus; empty: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>{status === "pending" ? "Requested" : "Reviewed"}</TableHead>
            <TableHead className="hidden lg:table-cell">Last sign-in</TableHead>
            <TableHead className="pr-4 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="pl-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} image={user.image} />
                    <div className="max-w-48 min-w-0 sm:max-w-64">
                      <p className="truncate font-medium" title={user.name ?? undefined}>
                        {user.name ?? user.email}
                      </p>
                      <p className="truncate text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "info" : "outline"}>
                    {user.role === "admin" ? "Admin" : "Member"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <ReviewCell user={user} status={status} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : "-"}
                </TableCell>
                <TableCell className="pr-4 text-right">
                  {user.role === "admin" ? (
                    // Admins come from AUTH_ADMIN_EMAILS, so their access can't be changed here.
                    <span className="text-xs text-muted-foreground">Always allowed</span>
                  ) : (
                    <UserActions userId={user.id} label={user.name ?? user.email} status={user.status} />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function ReviewCell({ user, status }: { user: User; status: UserStatus }) {
  if (status === "pending") return formatDate(user.createdAt)
  if (!user.reviewedAt) return "-"
  return (
    <div className="leading-tight">
      <p>{formatDate(user.reviewedAt)}</p>
      {user.reviewedBy && <p className="text-xs">by {user.reviewedBy}</p>}
    </div>
  )
}

function formatDate(date: Date) {
  return format(date, "d MMM yyyy, h:mm a")
}

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-9 w-80" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
