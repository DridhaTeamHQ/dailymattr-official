import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { routineVideo } from "@/lib/dummy-media"

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

      {/* Media placeholder (Figma: the wide 1507px panel column, ~144px below the buttons); swap in an image or video */}
      <FadeIn className={PANEL_WIDTH}>
        <AspectRatio ratio={2.2} className="overflow-hidden rounded-xl bg-placeholder">
          <video src={routineVideo} autoPlay muted loop playsInline className="size-full object-cover" />
        </AspectRatio>
      </FadeIn>
    </section>
  )
}
