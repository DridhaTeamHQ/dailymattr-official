import Image from "next/image"

import { AnchorLink } from "@/components/shared/anchor-link"
import { FadeIn } from "@/components/shared/fade-in"
import { hero, pillars } from "./content"
import { QixHeroArc } from "./hero-arc"

/**
 * Dark hero: centred copy over a moving perspective arc of Qix thumbnails, with the three content
 * pillars below the first screen. Figma 9278:960 (1920×1204 under a 1080px viewport).
 *
 * The whole composition is sized in em off one font-size, so it scales as a unit:
 * - lg+: Figma px ÷ 16, shrunk (to 0.7rem at most) so the copy and the arc fit the screen
 *   height left under the header; 59.5rem is the 952px the design shows above the fold.
 * - below lg: the copy keeps body sizes, and the arc gets its own width-based size
 *   (see QixHeroArc) so phones still see the centre cards.
 */
export function QixHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-0 lg:pb-[6em] lg:text-[length:clamp(0.7rem,calc((100svh_-_var(--chrome-height,6.375rem))_/_59.5),1rem)]">
      <div className="relative lg:h-[62.5em]">
        {/* Figma 9278:984: 64px down, 32px between title, copy and button */}
        <FadeIn className="relative z-10 flex flex-col items-center gap-6 text-center lg:gap-[2em] lg:pt-[4em]">
          <h1 className="text-[2.5em] leading-[1.1] font-medium tracking-[-0.039em] text-white sm:text-[3em] lg:text-[4em] lg:leading-[1.125]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Figma's box is 760px of Inter; 680px of Inter Tight keeps its break after "our" */}
          <p className="max-w-[28.3333em] text-[1em] leading-[1.5] tracking-[-0.0083em] text-white/64 sm:text-[1.125em] sm:leading-[1.5556] lg:text-[1.5em] lg:leading-[1.3333]">
            {hero.description}
          </p>

          <WatchButton />
        </FadeIn>

        <QixHeroArc />
      </div>

      <Pillars />
    </section>
  )
}

/** Dark pill with a lime glow resting on its top edge; glides down to the gallery. Figma 9278:987 (168×56). */
function WatchButton() {
  return (
    <div className="relative">
      {/* Figma 9278:988: a 96×8 glow; the art overhangs its slot to carry the blur */}
      <span aria-hidden className="pointer-events-none absolute top-[-0.25em] left-1/2 h-[0.5em] w-[6em] -translate-x-1/2">
        <span className="absolute inset-[-100%_-8.33%]">
          <Image src="/qix/hero/cta-glow.svg" alt="" width={112} height={24} className="block size-full max-w-none" />
        </span>
      </span>

      <AnchorLink
        href={hero.cta.href}
        className="relative flex h-[3.5em] min-w-[10.5em] items-center justify-center gap-[0.75em] rounded-[1.75em] bg-[#0b0b0b] px-[1.75em] text-[1em] leading-[1.5] font-medium tracking-[-0.0125em] whitespace-nowrap text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] transition-[translate,background-color,box-shadow] hover:-translate-y-px hover:bg-[#141414] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
      >
        {hero.cta.label}
        <Image src="/qix/hero/arrow-right.svg" alt="" width={20} height={20} className="block size-[1.25em]" />
      </AnchorLink>
    </div>
  )
}

/** The three content pillars under the arc. Figma 9278:993: 400px columns, 104px apart. */
function Pillars() {
  return (
    <div className="relative z-10 mx-auto mt-10 grid max-w-[25em] gap-8 text-center md:max-w-none md:grid-cols-3 md:gap-6 lg:mt-[1em] lg:grid-cols-[repeat(3,minmax(0,25em))] lg:justify-center lg:gap-x-[6.5em]">
      {pillars.items.map((item, i) => (
        <FadeIn key={item.title} delay={i * 0.06} className="flex flex-col items-center gap-2 lg:gap-[0.75em]">
          <h2 className="text-[1.25em] leading-[1.4] font-medium tracking-[-0.0167em] text-white lg:text-[1.5em] lg:leading-[1.3333]">
            {item.title}
          </h2>
          <p className="text-[0.9375em] leading-[1.6] text-white/56 lg:text-[1em] lg:leading-[1.5]">{item.description}</p>
        </FadeIn>
      ))}
    </div>
  )
}
