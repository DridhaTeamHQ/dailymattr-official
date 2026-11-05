import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"

// Figma frame: max width 1540, vertical auto layout, gap 64, padding 16 × 100.
export function DailyRoutineSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col items-center gap-16 px-4 py-[100px]">
      <SectionHeading
        eyebrow="A little curiosity, every day"
        title={
          <>
            Make staying informed
            <br />
            part of your routine.
          </>
        }
        description="Start with today’s stories. Come back tomorrow with new questions."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/download" />}
            className="h-9 gap-2 rounded-lg pr-1.5 pl-3.5 text-[13px] font-medium"
          >
            Get dailymattr
            <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
              <ArrowUpRight className="size-3" />
            </span>
          </Button>
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href="/stories" />}
            className="h-9 gap-1.5 rounded-lg pr-2.5 pl-3.5 text-[13px] font-medium"
          >
            Read today&rsquo;s stories
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </SectionHeading>

      {/* Media placeholder — same column as the sections above; swap in an image or video */}
      <div className={CONTENT_WIDTH}>
        <AspectRatio ratio={2.2} className="overflow-hidden rounded-xl bg-placeholder" />
      </div>
    </section>
  )
}
