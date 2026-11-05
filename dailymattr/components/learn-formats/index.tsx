import { SectionHeading } from "@/components/shared/section-heading"
import { learnFormats } from "./content"
import { FormatCard } from "./format-card"

// Figma frame: max width 1540, vertical auto layout, gap 80, padding 16 × 100.
export function LearnFormatsSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col gap-20 px-4 py-[100px]">
      <SectionHeading
        className="mx-auto"
        eyebrow="Made for the way you learn"
        title={
          <>
            Some stories need a glance.
            <br />
            Others deserve a closer look.
          </>
        }
      />

      {learnFormats.map((format) => (
        <FormatCard key={format.id} format={format} />
      ))}
    </section>
  )
}
