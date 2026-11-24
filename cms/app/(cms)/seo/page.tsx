import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { CircleCheckBig, EyeOff, FileText, PenLine, Plus, Settings2 } from "lucide-react"

import { PageHeader } from "@/components/cms/page-header"
import { WebsiteUnavailable } from "@/components/cms/seo/website-unavailable"
import { StatCard } from "@/components/cms/stat-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { normalizePath } from "@/lib/seo/fields"

import { loadSeoOverview, percent } from "./load"
import { SeoTable } from "./seo-table"

export const metadata: Metadata = { title: "SEO" }

/**
 * Every page on the website with its SEO status, one folder at a time: /seo shows the
 * top level, /seo?in=/news the pages inside /news. Click a page to edit it.
 */
export default function SeoPage({ searchParams }: PageProps<"/seo">) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SEO"
        description="Titles, descriptions, share cards and indexing for every page on the website."
        actions={
          <>
            <Link href="/seo/settings" className={buttonVariants({ variant: "outline" })}>
              <Settings2 data-icon="inline-start" />
              Site settings
            </Link>
            <Link href="/seo/new" className={buttonVariants()}>
              <Plus data-icon="inline-start" />
              Add page
            </Link>
          </>
        }
      />
      <Suspense fallback={<ListSkeleton />}>
        <SeoList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function SeoList({ searchParams }: Pick<PageProps<"/seo">, "searchParams">) {
  await requireApprovedUser()
  const { in: rawFolder } = await searchParams
  const folder = typeof rawFolder === "string" ? normalizePath(rawFolder) : null

  const seo = await loadSeoOverview()
  if (seo.error !== null) return <WebsiteUnavailable url={seo.websiteUrl} message={seo.error} />
  const { items, totals } = seo

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pages"
          value={totals.pages}
          icon={FileText}
          tone="green"
          footer={<span>On the website and added here</span>}
        />
        <StatCard
          label="Customized"
          value={totals.customized}
          icon={PenLine}
          tone="teal"
          footer={
            <>
              <Badge variant="info">{percent(totals.customized, totals.pages)}</Badge>
              of pages
            </>
          }
        />
        <StatCard
          label="Hidden from search"
          value={totals.hidden}
          icon={EyeOff}
          tone="orange"
          footer={
            <>
              <Badge variant="warning">{percent(totals.hidden, totals.pages)}</Badge>
              noindex, not in the sitemap
            </>
          }
        />
        <StatCard
          label="All checks passed"
          value={totals.passing}
          icon={CircleCheckBig}
          tone="amber"
          footer={
            <>
              <Badge variant="success">{percent(totals.passing, totals.pages)}</Badge>
              of pages
            </>
          }
        />
      </div>
      {/* Keyed by folder, so search, filter and paging start fresh in each folder. */}
      <SeoTable key={folder ?? "/"} items={items} folder={folder === "/" ? null : folder} />
    </>
  )
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  )
}
