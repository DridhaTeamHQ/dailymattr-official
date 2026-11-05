import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"
import { AccordionGallery } from "./accordion-gallery"
import { explainers } from "./content"

// Figma frame: max width 1540, vertical auto layout, gap 64, padding 16 × 100.
export function ExplainersSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col items-center gap-16 px-4 py-[100px]">
      <SectionHeading
        eyebrow="For curious minds. Busy lives."
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
          className="h-9 gap-2 rounded-lg pr-1.5 pl-3.5 text-[13px] font-medium"
        >
          Browse explainers
          <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </SectionHeading>

      {/* Same column as the app preview and format cards above */}
      <AccordionGallery items={explainers} className={CONTENT_WIDTH} />
    </section>
  )
}
