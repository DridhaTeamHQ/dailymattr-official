import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { SiteVideo } from "@/components/shared/site-video"
import { videos } from "@/lib/videos"

// Figma frame: max width 1540, vertical auto layout, gap 64, padding 16 × 100.
export function DailyRoutineSection() {
  return (
    <section className="mx-auto flex w-full max-w-[96.25rem] flex-col items-center gap-16 px-4 py-[6.25rem] lg:gap-36">
      <SectionHeading
        eyebrow="A little curiosity, every day"
        title={
          <>
            Make staying informed
            <br />
            part of your routine.
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/download" />}
            className="h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
          >
            Get dailymattr
            <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
              <ArrowUpRight className="size-3" />
            </span>
          </Button>
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href="/stories" />}
            className="h-10 gap-1.5 rounded-lg pr-3 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
          >
            Read today&rsquo;s stories
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </SectionHeading>

      {/* Day-by-day video (1920×1080), framed at its own 16:9 ratio so nothing is cropped. Wider
          than PANEL_WIDTH (nearly edge to edge), but capped so the whole 16:9 frame fits on one
          screen below the sticky header (6rem left for the header and a small margin). */}
      <FadeIn className="mx-auto w-full max-w-full lg:w-[min(94vw,calc((100svh_-_6rem)*16/9))]">
        {/* No fill on the frame: a background bleeds through the anti-aliased rounded edge as a pale
            outline. clip-path rounds the corners without that halo, so only the video is visible. */}
        <AspectRatio ratio={16 / 9} className="[clip-path:inset(0_round_0.75rem)]">
          <SiteVideo
            video={videos.dayByDay}
            // Slight zoom crops the faint encoding seam along the video's bottom edge
            className="block size-full scale-[1.01] object-cover"
          />
        </AspectRatio>
      </FadeIn>
    </section>
  )
}
