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

      <div className="mx-auto flex min-h-[35rem] max-w-[75rem] items-center py-20 sm:min-h-[40rem] lg:min-h-[54.5rem] lg:py-[7rem]">
        <FadeIn className="flex max-w-[33.75rem] flex-col items-start gap-5 font-helvetica lg:gap-6">
          <PixTag>{hero.tag}</PixTag>

          <h1 className="text-display leading-none font-medium tracking-[-0.0938rem] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-[31.25rem] text-base leading-6 tracking-[-0.0125rem] text-white lg:text-lg lg:leading-7">
            {hero.description}
          </p>

          <PixButton href={hero.cta.href}>{hero.cta.label}</PixButton>
        </FadeIn>
      </div>
    </section>
  )
}
