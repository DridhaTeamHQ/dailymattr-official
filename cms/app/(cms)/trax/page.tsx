import { Suspense } from "react"
import type { Metadata } from "next"
import { ArrowUpRight, CircleAlert, Disc3, Headphones, LayoutGrid, Star } from "lucide-react"

import { PageHeader } from "@/components/cms/page-header"
import { StatCard } from "@/components/cms/stat-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { loadTrax } from "@/lib/formats/data"
import { uploadSetupProblem } from "@/lib/media/storage"
import { websiteUrl } from "@/lib/seo/website"

import { TraxBoard } from "./trax-board"

export const metadata: Metadata = { title: "Trax" }

/**
 * The website's Trax episodes: the hero's cover-flow player (and the big featured player's
 * playlist) and the featured cards under it. Add, replace, reorder, hide.
 */
export default function TraxPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trax"
        description="The audio episodes on the website's Trax page. Add new ones, replace current ones, set titles and descriptions."
        actions={
          websiteUrl ? (
            <a
              href={`${websiteUrl}/formats/trax`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              View Trax page
              <ArrowUpRight data-icon="inline-end" />
            </a>
          ) : null
        }
      />
      <Suspense fallback={<BoardSkeleton />}>
        <TraxContent />
      </Suspense>
    </div>
  )
}

async function TraxContent() {
  await requireApprovedUser()
  let episodes: Awaited<ReturnType<typeof loadTrax>>
  try {
    episodes = await loadTrax()
  } catch (error) {
    console.error("[trax] Couldn't load:", error)
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Couldn&apos;t read the Trax episodes</AlertTitle>
        <AlertDescription>The CMS database didn&apos;t answer. Reload the page in a moment.</AlertDescription>
      </Alert>
    )
  }

  const live = episodes.filter((e) => e.published)
  const start = live.find((e) => e.heroStart && e.inHero)
  const problem = uploadSetupProblem()
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Episodes on website"
          value={live.length}
          icon={Headphones}
          tone="blue"
          footer={<span>of {episodes.length} in the CMS</span>}
        />
        <StatCard
          label="In the cover-flow"
          value={live.filter((e) => e.inHero).length}
          icon={Disc3}
          tone="violet"
          footer={<span>Hero and big featured player</span>}
        />
        <StatCard
          label="Featured cards"
          value={live.filter((e) => e.inFeaturedCards).length}
          icon={LayoutGrid}
          tone="green"
          footer={<span>The page is designed for 3</span>}
        />
        <StatCard
          label="Opens on"
          value={<span className="block truncate text-xl leading-9">{start?.title ?? "First episode"}</span>}
          icon={Star}
          tone="amber"
          footer={<span>Centre card when the page loads</span>}
        />
      </div>
      <TraxBoard episodes={episodes} websiteUrl={websiteUrl} uploads={{ ready: !problem, problem }} />
    </>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
  )
}
