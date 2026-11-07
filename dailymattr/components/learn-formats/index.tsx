import { SectionHeading } from "@/components/shared/section-heading"
import { learnFormats } from "./content"
import { FormatCard } from "./format-card"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, gap 80, padding 16 × 100.
export function LearnFormatsSection() {
  return (
    <section className="mx-auto flex w-full max-w-[96.25rem] flex-col gap-20 px-4 py-[6.25rem]">
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
        <FadeIn key={format.id}>
          <FormatCard format={format} />
        </FadeIn>
      ))}
    </section>
  )
}
