import { FadeIn } from "@/components/shared/fade-in"
import { howItWorks, type PixStep } from "./content"
import { PixSectionIntro } from "./primitives"

function StepCard({ step }: { step: PixStep }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[16px] border border-[#ebebeb] bg-white p-6 font-helvetica lg:min-h-[226px] lg:p-7">
      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#eaf1ff] text-[15px] leading-none font-medium tracking-[0.3px] text-[#3979ff]">
        {step.number}
      </span>
      <h3 className="text-[18px] leading-6 font-medium tracking-[-0.2px] text-black lg:max-w-[224px]">
        {step.title}
      </h3>
      <p className="text-[16px] leading-6 tracking-[-0.2px] text-[#696969] lg:max-w-[224px]">
        {step.description}
      </p>
    </div>
  )
}

/** Four numbered steps. Figma 8632:2163. */
export function PixHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-white px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-[160px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <PixSectionIntro eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {howItWorks.steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.06} className="h-full">
              <StepCard step={step} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
