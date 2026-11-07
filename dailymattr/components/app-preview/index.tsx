import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { FormatTabs } from "./format-tabs"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: vertical auto layout, gap 48, padding 16 × 100, centered, fill #f5f5f7.
export function AppPreviewSection() {
  return (
    <section className="flex w-full flex-col items-center gap-12 bg-[#f5f5f7] px-4 py-[6.25rem]">
      <SectionHeading
        eyebrow="For curious minds. Busy lives."
        title={
          <>
            Open the app.
            <br />
            Find your way into the story.
          </>
        }
      >
        <Button
          nativeButton={false}
          render={<Link href="/download" />}
          className="h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
        >
          Take a look inside
          <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </SectionHeading>

      <FadeIn className="w-full">
        <FormatTabs />
      </FadeIn>
    </section>
  )
}
