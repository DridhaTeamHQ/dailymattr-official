import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/section-heading"
import { FormatTabs } from "./format-tabs"

// Figma frame: vertical auto layout, gap 48, padding 16 × 100, centered.
export function AppPreviewSection() {
  return (
    <section className="flex w-full flex-col items-center gap-12 px-4 py-[100px]">
      <SectionHeading
        eyebrow="For curious minds. Busy lives."
        title={
          <>
            Open the app.
            <br />
            Find your way into the story.
          </>
        }
        description="Start with a quick update. Follow your curiosity into an explainer. Choose the format that fits the moment."
      >
        <Button
          nativeButton={false}
          render={<Link href="/download" />}
          className="h-9 gap-2 rounded-lg pr-1.5 pl-3.5 text-[13px] font-medium"
        >
          Take a look inside
          <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </SectionHeading>

      <FormatTabs />
    </section>
  )
}
