import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, SquareCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { FadeIn } from "@/components/shared/fade-in"

// Copy from the Figma frame.
const points = [
  "Train 100% of your employees with a single tap",
  "Identify, manage, and close skill gaps",
  "Run daily operations with checklists and ensure compliance",
]

/** Image (2/3) + blue newsletter card (1/3), in the shared content column. */
export function NewsletterSection({ image }: { image?: string }) {
  return (
    <section className="w-full px-4 py-20">
      <div className={cn(CONTENT_WIDTH, "grid gap-3 lg:grid-cols-[2fr_1fr]")}>
        <FadeIn className="relative aspect-[1.87] overflow-hidden rounded-2xl bg-placeholder lg:aspect-auto lg:min-h-[360px]">
          {image && (
            <Image src={image} alt="" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
          )}
        </FadeIn>

        <FadeIn className="flex flex-col rounded-2xl bg-primary p-6 text-primary-foreground" delay={0.1}>
          <span className="w-fit rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold tracking-wider text-background uppercase">
            Get the newsletter
          </span>
          <h2 className="mt-4 text-2xl leading-tight font-medium tracking-tight lg:text-3xl">
            Five stories.
            <br />
            One useful email.
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Get five selected news summaries delivered to your inbox with sources linked for
            further reading.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {points.map((p) => (
              <li key={p} className="flex gap-2 text-sm">
                <SquareCheck className="mt-0.5 size-4 shrink-0 fill-primary-foreground text-primary" />
                {p}
              </li>
            ))}
          </ul>
          <Button
            nativeButton={false}
            render={<Link href="/newsletter" />}
            className="mt-8 h-10 w-full gap-2 rounded-lg bg-foreground text-sm font-medium text-background hover:bg-foreground/85 lg:mt-auto"
          >
            Book a demo
            <span className="flex size-5 items-center justify-center rounded-[5px] bg-background/15">
              <ArrowUpRight className="size-3" />
            </span>
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}
