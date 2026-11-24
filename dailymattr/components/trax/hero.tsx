import { Fragment } from "react"

import { FadeIn } from "@/components/shared/fade-in"
import { hero } from "./content"
import { TraxHeroPlayer } from "./hero-player"
import { TraxHeroState } from "./hero-state"
import { HeroWash } from "./hero-wash"
import { TraxButton, TraxTag } from "./primitives"

/**
 * Cover-flow player filling the first screen, copy below, over a blurred wash in the playing
 * cover's colours (HeroWash). Figma 9278:697 (1920×1392 on the desktop frame).
 *
 * Fit to short screens (laptops, browser toolbars, small windows) at every width: rem sizes
 * already shrink with the screen width; --trax-hero-fit (0.6–1) also shrinks the player and
 * its top padding so the cards and the bar fit under the header. It is the height left below
 * the header over the height the player needs at that breakpoint, --trax-hero-need: top
 * padding + cards (37.75rem × the stage's width zoom) + bar and its margin + a little room.
 *   base 2.5 + 15.86 + 6.5 + 1.5 ≈ 26.5rem    sm 3.5 + 22.65 + 7.5 + 2 ≈ 35.75rem
 *   md   3.5 + 26.43 + 7.5 + 2 ≈ 39.5rem      lg 6.25 + 37.75 + 9 + 3 = 56rem
 * Pure CSS where length ÷ length is supported; TraxHeroPlayer sets it from JS elsewhere.
 *
 * Clipped (overflow: clip), not overflow: hidden: the wash and the wide card stage run past the
 * section, and a hidden-overflow box still scrolls when something inside takes focus, which
 * slid the cards up under the nav (or sideways). A clipped box can't scroll.
 */
export function TraxHero() {
  return (
    <section className="relative isolate flex flex-col items-center overflow-clip bg-[#0a0a0a] pt-[calc(2.5rem*var(--trax-hero-fit,1))] pb-16 [--trax-hero-need:26.5rem] supports-[zoom:calc(1px/1px)]:[--trax-hero-fit:clamp(0.6,calc((100svh_-_var(--chrome-height,6.375rem))_/_var(--trax-hero-need)),1)] sm:pt-[calc(3.5rem*var(--trax-hero-fit,1))] sm:pb-20 sm:[--trax-hero-need:35.75rem] md:[--trax-hero-need:39.5rem] lg:pt-[calc(6.25rem*var(--trax-hero-fit,1))] lg:pb-[7.6875rem] lg:[--trax-hero-need:56rem]">
      <TraxHeroState>
        <HeroWash />

        <div className="relative w-full px-4 sm:px-6 lg:w-[95rem] lg:px-0">
          {/* Legibility shade behind the player (Figma 9278:700: 1520×800, 24px above it) */}
          <Blob
            src="/trax/hero/shade-player.svg"
            className="inset-x-0 -top-6 h-[calc(100%+3.25rem)]"
            overhang="inset-[-25%_-13.16%]"
          />
          <TraxHeroPlayer />
        </div>
      </TraxHeroState>

      <div className="relative mt-16 w-full max-w-[51.25rem] px-4 sm:mt-20 sm:px-6 lg:mt-[10.5rem] lg:px-0">
        {/* Shade centred on the copy (Figma 9278:701: 1040×400, 72px above it) */}
        <Blob
          src="/trax/hero/shade-copy.svg"
          className="-top-[4.5rem] left-1/2 h-[25rem] w-[65rem] -translate-x-1/2"
          overhang="inset-[-40%_-15.38%]"
        />
        <FadeIn className="relative flex flex-col items-center gap-5 text-center lg:gap-6">
          <TraxTag className="bg-[rgba(28,104,255,0.2)] leading-[0.8125rem]">{hero.tag}</TraxTag>

          {/* One line on desktop; on phones it breaks between the two sentences */}
          <h1 className="text-display leading-none font-bold tracking-[-0.0938rem] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.titleLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">{line}</span>
              </Fragment>
            ))}
          </h1>

          <p className="max-w-[40rem] text-base leading-6 tracking-[-0.0125rem] text-white/72 lg:text-lg lg:leading-7">
            {hero.description}
          </p>

          <TraxButton href={hero.cta.href}>{hero.cta.label}</TraxButton>
        </FadeIn>
      </div>
    </section>
  )
}

/**
 * Soft vector art exported from Figma. Each SVG carries its blur, so the file is larger than
 * its slot by `overhang` and is stretched over that box (preserveAspectRatio="none").
 */
function Blob({ src, className, overhang }: { src: string; className: string; overhang: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className={`absolute ${overhang}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- stretched vector */}
        <img src={src} alt="" className="block size-full max-w-none" />
      </div>
    </div>
  )
}
