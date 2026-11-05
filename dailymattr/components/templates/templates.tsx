import type { CarouselCard } from "@/components/ui/apple-cards-carousel"

// Card copy from the Figma frame. Add `src` (image URL) to replace each placeholder fill.
function TemplateDetails({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-muted p-4 md:p-5">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{title}.</span> Template details go
        here — what the course covers, who it&rsquo;s for and how long it takes.
      </p>
      <div className="mt-4 aspect-video max-h-[40svh] w-full rounded-lg bg-placeholder" />
    </div>
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

export const templateCards: CarouselCard[] = cards.map((c) => ({
  ...c,
  cta: "Use Template",
  content: <TemplateDetails title={c.title} />,
}))
