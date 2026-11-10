import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { Card, Carousel } from "@/components/ui/apple-cards-carousel"
import { templateCards } from "./templates"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, padding 0 × 80. The card row uses the
// wide panel column (78.5% of the screen) with 300 × 420 cards, ~130px below the heading.
export function TemplatesSection() {
  return (
    <section className="mx-auto flex w-full max-w-[96.25rem] flex-col items-center gap-20 px-4 py-20 lg:gap-32">
      <FadeIn className="flex max-w-4xl flex-col items-center text-center">
        {/* Figma 8585:9969 — 48/57.6 −1.92px, Inter Tight Semibold #292929 to match the other section headings */}
        <h2 className="font-tight text-3xl leading-tight font-semibold tracking-[-0.0625rem] text-[#292929] sm:text-4xl lg:text-5xl lg:tracking-[-0.12rem]">
          Tailored solutions for deskless industries
        </h2>
        <p className="mt-6 text-base font-medium tracking-[-0.025rem] text-[#1c1b17] lg:text-xl lg:leading-7">
          Discover how our customers use Bounti
          <br />
          <span className="text-[#b2b2b2]">to improve their deskless workforce</span>
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/templates" />}
          className="mt-10 h-10 gap-2 rounded-lg bg-foreground pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem] text-background hover:bg-foreground/85"
        >
          Browse Templates
          <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-background/15">
            <ArrowUpRight className="size-3" />
          </span>
        </Button>
      </FadeIn>

      <FadeIn className={PANEL_WIDTH}>
        <Carousel
          items={templateCards.map((card, index) => (
            <Card key={card.title} card={card} index={index} layout />
          ))}
        />
      </FadeIn>
    </section>
  )
}
