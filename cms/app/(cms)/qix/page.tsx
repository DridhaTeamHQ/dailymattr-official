import { Suspense } from "react"
import type { Metadata } from "next"
import { ArrowUpRight, CircleAlert, Clapperboard, Film, GalleryHorizontal, House, ListOrdered } from "lucide-react"

import { PageHeader } from "@/components/cms/page-header"
import { StatCard } from "@/components/cms/stat-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { loadQix } from "@/lib/formats/data"
import { uploadSetupProblem } from "@/lib/media/storage"
import { websiteUrl } from "@/lib/seo/website"

import { QixBoard } from "./qix-board"

export const metadata: Metadata = { title: "Qix" }

/**
 * The website's Qix videos: the stories in the top carousel ("See the bigger picture"), the
 * Qix page's story row ("A world of stories") and the home page's ("One place to catch up"),
 * and the numbered clips in "The experience". Add, replace, reorder, hide.
 */
export default function QixPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Qix"
        description="The videos on the website's Qix page. Add new ones, replace current ones, reorder or hide them."
        actions={
          websiteUrl ? (
            <a
              href={`${websiteUrl}/formats/qix`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              View Qix page
              <ArrowUpRight data-icon="inline-end" />
            </a>
          ) : null
        }
      />
      <Suspense fallback={<BoardSkeleton />}>
        <QixContent />
      </Suspense>
    </div>
  )
}

async function QixContent() {
  await requireApprovedUser()
  let data: Awaited<ReturnType<typeof loadQix>>
  try {
    data = await loadQix()
  } catch (error) {
    console.error("[qix] Couldn't load:", error)
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Couldn&apos;t read the Qix videos</AlertTitle>
        <AlertDescription>The CMS database didn&apos;t answer. Reload the page in a moment.</AlertDescription>
      </Alert>
    )
  }

  const live = data.stories.filter((s) => s.published)
  const problem = uploadSetupProblem()
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Stories on website"
          value={live.length}
          icon={Film}
          tone="blue"
          footer={<span>of {data.stories.length} in the CMS</span>}
        />
        <StatCard
          label="In the top carousel"
          value={live.filter((s) => s.inHero).length}
          icon={Clapperboard}
          tone="violet"
          footer={<span>“See the bigger picture”, Qix page</span>}
        />
        <StatCard
          label="In the Qix row"
          value={live.filter((s) => s.inGallery).length}
          icon={GalleryHorizontal}
          tone="green"
          footer={<span>“A world of stories”</span>}
        />
        <StatCard
          label="On the home page"
          value={live.filter((s) => s.inHome).length}
          icon={House}
          tone="teal"
          footer={<span>“One place to catch up”</span>}
        />
        <StatCard
          label="Experience steps"
          value={data.steps.filter((s) => s.published).length}
          icon={ListOrdered}
          tone="amber"
          footer={<span>The page is designed for 4</span>}
        />
      </div>
      <QixBoard
        stories={data.stories}
        steps={data.steps}
        websiteUrl={websiteUrl}
        uploads={{ ready: !problem, problem }}
      />
    </>
  )
}

function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-72 rounded-full" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
