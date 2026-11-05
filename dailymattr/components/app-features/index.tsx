import { SectionHeading } from "@/components/shared/section-heading"
import { FeatureTabs } from "./feature-tabs"
import { FadeIn } from "@/components/shared/fade-in"

// Figma frame: max width 1540, vertical auto layout, gap 63, padding 48 × 100.
export function AppFeaturesSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1540px] flex-col items-center gap-[63px] px-4 py-[100px] lg:px-12">
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
