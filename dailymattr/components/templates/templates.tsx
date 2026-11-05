import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CarouselCard } from "@/components/ui/apple-cards-carousel"
import { dummyImage, dummyVideo } from "@/lib/dummy-media"

// Card copy from the Figma frame. Add `src` (image URL) to replace each placeholder fill.
// The popup shows the template's vertical (9:16) video edge to edge beside these details.
function TemplateDetails({ title }: { title: string }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{title}.</span> Template details go
        here — what the course covers, who it&rsquo;s for and how long it takes.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/templates" />}
        className="mt-6 h-10 w-full gap-2 rounded-lg bg-foreground text-sm font-medium text-background hover:bg-foreground/85 sm:mt-auto"
      >
        Use Template
        <span className="flex size-5 items-center justify-center rounded-[5px] bg-background/15">
          <ArrowUpRight className="size-3" />
        </span>
      </Button>
    </>
  )
}

function TemplateVideo({ index }: { index: number }) {
  return (
    <video
      src={dummyVideo(index)}
      poster={dummyImage(500 + index * 6, 540, 960)}
      autoPlay
      muted
      loop
      playsInline
      className="size-full object-cover"
    />
  )
}

const cards = [
  { category: "Compliance training", title: "HACCP" },
  { category: "Onboarding", title: "Health & Safety" },
  { category: "Employee training", title: "Fire Safety and Prevention" },
  { category: "Compliance training", title: "Whistleblowing" },
  { category: "Staff development", title: "Upselling and Cross Selling Techniques" },
  // Additional placeholder templates — rename or replace as needed.
  { category: "Compliance training", title: "Food Allergens" },
  { category: "Onboarding", title: "Workplace Hygiene" },
  { category: "Staff development", title: "Customer Service Basics" },
  { category: "Compliance training", title: "Data Protection" },
]

export const templateCards: CarouselCard[] = cards.map((c, i) => ({
  ...c,
  cta: "Use Template",
  src: dummyImage(500 + i * 6, 800, 1200),
  content: <TemplateDetails title={c.title} />,
  media: <TemplateVideo index={i} />,
}))
