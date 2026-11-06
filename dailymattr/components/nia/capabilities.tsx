import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { capabilities } from "./content"

/** Three-up value cards. Figma node 8856:9255. */
export function NiaCapabilities() {
  return (
    <section className="border-y border-white/5 bg-[#121214] px-4 py-24 sm:px-6 lg:px-8 lg:py-[160px]">
      <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((card, i) => (
          <FadeIn key={card.id} delay={i * 0.1}>
            <div className="flex h-full flex-col gap-4 rounded-[16px] border border-white/8 bg-gradient-to-b from-[#17171a] to-[#131315] p-10 drop-shadow-[0px_30px_30px_rgba(0,0,0,0.1)]">
              <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-white/28 bg-white/12 shadow-[0px_0px_22px_0px_rgba(255,255,255,0.22)]">
                <Image src={card.icon} alt="" width={24} height={24} className="block" />
              </span>
              <p className="text-[20px] leading-7 font-medium tracking-[-0.4px] text-white">
                {card.title}
              </p>
              <p className="max-w-[302px] text-[16px] leading-6 tracking-[-0.2px] text-white/55">
                {card.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
