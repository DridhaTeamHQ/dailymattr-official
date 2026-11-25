import { Suspense } from "react"
import type { Metadata } from "next"
import { ArrowUpRight, CalendarDays, CircleAlert, Eye, EyeOff, Newspaper } from "lucide-react"

import { PageHeader } from "@/components/cms/page-header"
import { StatCard } from "@/components/cms/stat-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { loadNews, NEWS_PAGE_SIZE, parseNewsFilters, PixSetupError, type NewsOverview } from "@/lib/news/data"
import { websiteUrl } from "@/lib/seo/website"

import { percent } from "../seo/load"
import { NewsBrowser } from "./news-browser"

export const metadata: Metadata = { title: "News" }

/**
 * Every story published in Pix, newest first, and whether each one shows in the website's
 * news section. Customize on a story switches it on or off the website.
 */
export default function NewsPage({ searchParams }: PageProps<"/news">) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="News"
        description="Every story published in Pix. Choose which ones appear in the website's news section."
        actions={
          websiteUrl ? (
            <a
              href={`${websiteUrl}/news`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              View news section
              <ArrowUpRight data-icon="inline-end" />
            </a>
          ) : null
        }
      />
      <Suspense fallback={<NewsSkeleton />}>
        <NewsBoard searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function NewsBoard({ searchParams }: Pick<PageProps<"/news">, "searchParams">) {
  await requireApprovedUser()
  const filters = parseNewsFilters(await searchParams)

  let news: NewsOverview
  try {
    news = await loadNews(filters)
  } catch (error) {
    console.error("[news] Couldn't load the Pix stories:", error)
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Couldn&apos;t read the stories from Pix</AlertTitle>
        <AlertDescription>
          {error instanceof PixSetupError
            ? error.message
            : "The Pix database didn't answer. Check PIX_DATABASE_URL, then reload the page."}
        </AlertDescription>
      </Alert>
    )
  }

  const { totals } = news
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published in Pix"
          value={totals.published.toLocaleString("en-IN")}
          icon={Newspaper}
          tone="blue"
          footer={<span>Every published story</span>}
        />
        <StatCard
          label="Showing on website"
          value={totals.showing.toLocaleString("en-IN")}
          icon={Eye}
          tone="green"
          footer={
            <>
              <Badge variant="success">{percent(totals.showing, totals.published)}</Badge>
              of stories
            </>
          }
        />
        <StatCard
          label="Hidden"
          value={totals.hidden.toLocaleString("en-IN")}
          icon={EyeOff}
          tone="amber"
          footer={
            <>
              <Badge variant="warning">{percent(totals.hidden, totals.published)}</Badge>
              turned off here
            </>
          }
        />
        <StatCard
          label="Published today"
          value={totals.today.toLocaleString("en-IN")}
          icon={CalendarDays}
          tone="violet"
          footer={<span>India time</span>}
        />
      </div>

      <NewsBrowser
        filters={filters}
        items={news.items}
        matching={news.matching}
        sectionCounts={news.sectionCounts}
        pageSize={NEWS_PAGE_SIZE}
      />
    </>
  )
}

function NewsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-28 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[3/5] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
