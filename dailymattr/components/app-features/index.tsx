import { SectionHeading } from "@/components/shared/section-heading"
import { FeatureTabs } from "./feature-tabs"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, gap 63, padding 48 × 100.
export function AppFeaturesSection() {
  return (
    <section className="mx-auto flex w-full max-w-[96.25rem] flex-col items-center gap-[3.9375rem] px-4 py-[6.25rem] lg:px-12">
      <SectionHeading
        eyebrow="For curious minds. Busy lives."
        title={
          <>
            Easy to follow.
            <br />
            Built around your curiosity.
          </>
        }
      />

      <FadeIn className="w-full">
        <FeatureTabs />
      </FadeIn>
    </section>
  )
}
