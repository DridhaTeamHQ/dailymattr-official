import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { experiences, type TraxExperience } from "./content"
import { TraxSectionIntro } from "./primitives"

function ExperienceCard({ item }: { item: TraxExperience }) {
  return (
    <div className="flex h-full flex-col items-start gap-4 rounded-[1rem] bg-[#f7f7f7] p-6 font-helvetica sm:p-8 lg:min-h-[14.75rem] lg:p-10">
      <span className="grid size-12 shrink-0 place-items-center rounded-[0.75rem] bg-white shadow-[0px_1px_1px_rgba(16,24,40,0.06),0px_4px_6px_rgba(16,24,40,0.04)]">
        <Image src={item.icon} alt="" width={24} height={24} />
      </span>
      <h3 className="text-xl leading-7 font-medium tracking-[-0.025rem] text-black">{item.title}</h3>
      <p className="max-w-[19rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969]">
        {item.description}
      </p>
    </div>
  )
}

/** Three listening formats. Figma 8595:11904. */
export function TraxExperiences() {
  return (
    <section className="bg-white px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <TraxSectionIntro eyebrow={experiences.eyebrow} title={experiences.title} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {experiences.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06} className="h-full">
              <ExperienceCard item={item} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
