import { Suspense } from "react"
import Link from "next/link"
import {
  ChevronRight,
  CircleCheckBig,
  EyeOff,
  FilePlus2,
  FileText,
  PenLine,
  Search,
  Settings2,
  type LucideIcon,
} from "lucide-react"

import { IconChip, type Tone } from "@/components/cms/icon-chip"
import { PageHeader } from "@/components/cms/page-header"
import { WebsiteUnavailable } from "@/components/cms/seo/website-unavailable"
import { StatCard } from "@/components/cms/stat-card"
import { UserAvatar } from "@/components/cms/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireApprovedUser } from "@/lib/dal"

import { loadSeoOverview, percent } from "./seo/load"

/** CMS home: where Google sign-in lands once an admin has approved the account. */
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  const user = await requireApprovedUser()
  const firstName = user.name?.split(" ")[0]
  const seo = await loadSeoOverview()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back${firstName ? `, ${firstName}` : ""}. Here's how the website's SEO is set up.`}
      />

      {seo.error !== null ? (
        <WebsiteUnavailable url={seo.websiteUrl} message={seo.error} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Website pages"
              value={seo.totals.pages}
              icon={FileText}
              tone="green"
              footer={<span>Every page with SEO</span>}
            />
            <StatCard
              label="Customized"
              value={seo.totals.customized}
              icon={PenLine}
              tone="teal"
              footer={
                <>
                  <Badge variant="info">{percent(seo.totals.customized, seo.totals.pages)}</Badge>
                  edited in the CMS
                </>
              }
            />
            <StatCard
              label="Hidden from search"
              value={seo.totals.hidden}
              icon={EyeOff}
              tone="orange"
              footer={
                <>
                  <Badge variant="warning">{percent(seo.totals.hidden, seo.totals.pages)}</Badge>
                  noindex
                </>
              }
            />
            <StatCard
              label="All checks passed"
              value={seo.totals.passing}
              icon={CircleCheckBig}
              tone="amber"
              footer={
                <>
                  <Badge variant="success">{percent(seo.totals.passing, seo.totals.pages)}</Badge>
                  of pages
                </>
              }
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recently edited</CardTitle>
                <CardDescription>The latest SEO changes made in the CMS</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                {seo.recent.length === 0 ? (
                  <p className="px-(--card-spacing) py-8 text-center text-sm text-muted-foreground">
                    Nothing edited yet. Every page is using the website&apos;s defaults.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-(--card-spacing)">Page</TableHead>
                        <TableHead>Edited by</TableHead>
                        <TableHead className="pr-(--card-spacing) text-right">When</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seo.recent.map((edit) => (
                        <TableRow key={edit.path}>
                          <TableCell className="pl-(--card-spacing)">
                            <Link href={`/seo/edit?path=${encodeURIComponent(edit.path)}`} className="block max-w-72">
                              <span className="block truncate font-medium hover:underline">{edit.title}</span>
                              <code className="block truncate font-mono text-xs text-muted-foreground">{edit.path}</code>
                            </Link>
                          </TableCell>
                          <TableCell>
                            {edit.by ? (
                              <div className="flex items-center gap-2">
                                <UserAvatar name={null} email={edit.by} image={null} size="sm" />
                                <span className="max-w-48 truncate text-muted-foreground">{edit.by}</span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="pr-(--card-spacing) text-right text-muted-foreground">{edit.at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Jump straight to a task</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1 px-2">
                <QuickAction href="/seo" icon={Search} tone="green" title="Edit page SEO" hint="Titles, descriptions, share cards" />
                <QuickAction href="/seo/settings" icon={Settings2} tone="teal" title="Site settings" hint="Name, title template, verification" />
                <QuickAction href="/seo/new" icon={FilePlus2} tone="orange" title="Add a page" hint="A new address on the website" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function QuickAction({
  href,
  icon,
  tone,
  title,
  hint,
}: {
  href: string
  icon: LucideIcon
  tone: Tone
  title: string
  hint: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <IconChip icon={icon} tone={tone} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{hint}</span>
      </span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-14 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}
