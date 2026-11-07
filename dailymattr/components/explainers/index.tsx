import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"
import { AccordionGallery } from "./accordion-gallery"
import { explainers } from "./content"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, gap 64, padding 16 × 100.
export function ExplainersSection() {
  return (
    <section className="mx-auto flex w-full max-w-[96.25rem] flex-col items-center gap-16 px-4 py-[6.25rem]">
      <SectionHeading
        eyebrow="Follow your curiosity"
        title={
          <>
            Something worth watching.
            <br />
            Something worth talking about.
          </>
        }
        description="Find a fresh perspective on the subjects that keep coming up in your conversations."
      >
        <Button
          nativeButton={false}
          render={<Link href="/explainers" />}
          className="h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
        >
          Browse explainers
          <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </SectionHeading>

      {/* Figma: the wide 1507px panel column (78.5% of the screen); active panel 2× the others */}
      <FadeIn className={PANEL_WIDTH}>
        <AccordionGallery items={explainers} activeGrow={2} />
      </FadeIn>
    </section>
  )
}
