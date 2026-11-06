import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { hero } from "./content"
import { PixButton, PixTag } from "./primitives"

/** Full-bleed hero over the phone-in-hand photo. Figma 8632:2145. */
export function PixHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0d1a2b] px-4 sm:px-6 lg:px-8">
      {/* Figma places the 2091×1176 photo at (-98, -79) of the 1920×872 frame,
          which works out to this focal point under object-cover. */}
      <Image
        src="/pix/hero-bg.png"
        alt=""
        fill
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        className="-z-10 object-cover object-[78%_26%] lg:object-[57%_26%]"
      />
      {/* Keeps the copy legible where it sits over the phone on narrow screens. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07111d]/85 via-[#07111d]/55 to-transparent lg:hidden"
      />

      <div className="mx-auto flex min-h-[560px] max-w-[1200px] items-center py-20 sm:min-h-[640px] lg:min-h-[872px] lg:py-[112px]">
        <FadeIn className="flex max-w-[540px] flex-col items-start gap-5 font-helvetica lg:gap-6">
          <PixTag>{hero.tag}</PixTag>

          <h1 className="text-[40px] leading-[1.05] font-medium tracking-[-1.5px] text-white sm:text-[52px] sm:leading-none lg:text-[64px] lg:leading-[64px] lg:tracking-[-3px]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-[500px] text-base leading-6 tracking-[-0.2px] text-white lg:text-[18px] lg:leading-7">
            {hero.description}
          </p>

          <PixButton href={hero.cta.href}>{hero.cta.label}</PixButton>
        </FadeIn>
      </div>
    </section>
  )
}
