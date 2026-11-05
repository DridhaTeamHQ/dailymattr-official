import Link from "next/link"
import { ArrowUpRight, LayoutTemplate } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { Card, Carousel } from "@/components/ui/apple-cards-carousel"
import { templateCards } from "./templates"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, gap 80, padding 0 × 80. The card row
// uses the shared content column so it lines up with the sections above.
export function TemplatesSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col items-center gap-20 px-4 py-20">
      <FadeIn className="flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-destructive uppercase">
          <LayoutTemplate className="size-3.5" />
          Templates
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Tailored solutions for deskless industries
        </h2>
        <p className="mt-6 text-sm text-foreground sm:text-base">
          Discover how our customers use Bounti
          <br />
          <span className="text-muted-foreground">to improve their deskless workforce</span>
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/templates" />}
          className="mt-6 h-9 gap-2 rounded-lg bg-foreground pr-1.5 pl-3.5 text-[13px] font-medium text-background hover:bg-foreground/85"
        >
          Browse Templates
          <span className="flex size-5 items-center justify-center rounded-[5px] bg-background/15">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </FadeIn>

      <FadeIn className={CONTENT_WIDTH}>
        <Carousel
          items={templateCards.map((card, index) => (
            <Card key={card.title} card={card} index={index} layout />
          ))}
        />
      </FadeIn>
    </section>
  )
}
