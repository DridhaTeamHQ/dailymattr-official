import { Fragment } from "react"

import { FadeIn } from "@/components/shared/fade-in"
import { hero } from "./content"
import { TraxHeroPlayer } from "./hero-player"
import { TraxButton, TraxTag } from "./primitives"

/**
 * Cover-flow player filling the first screen, copy below, over a blurred warm wash taken
 * from the playing artwork. Figma 9278:697 (1920×1392 on the desktop frame).
 *
 * Fit to short screens (laptops, browser toolbars): rem sizes already shrink with the screen
 * width; --trax-hero-fit (0.6–1) also shrinks the player and its top padding so the cards
 * and the bar fit under the header. It is the height left below the header over the 56rem the
 * player needs (6.25rem padding + 46.75rem player + 3rem of room). Pure CSS where length ÷
 * length is supported; TraxHeroPlayer sets it from JS elsewhere (FIT_REM / MIN_FIT there).
 */
export function TraxHero() {
  return (
    <section className="relative isolate flex flex-col items-center overflow-hidden bg-[#0a0a0a] pt-10 pb-16 supports-[zoom:calc(1px/1px)]:[--trax-hero-fit:clamp(0.6,calc((100svh_-_var(--chrome-height,6.375rem))_/_56rem),1)] sm:pt-14 sm:pb-20 lg:pt-[calc(6.25rem*var(--trax-hero-fit,1))] lg:pb-[7.6875rem]">
      <BlurredArtwork />

      <div className="relative w-full px-4 sm:px-6 lg:w-[95rem] lg:px-0">
        {/* Legibility shade behind the player (Figma 9278:700: 1520×800, 24px above it) */}
        <Blob
          src="/trax/hero/shade-player.svg"
          className="inset-x-0 -top-6 h-[calc(100%+3.25rem)]"
          overhang="inset-[-25%_-13.16%]"
        />
        <TraxHeroPlayer />
      </div>

      <div className="relative mt-16 w-full max-w-[51.25rem] px-4 sm:mt-20 sm:px-6 lg:mt-[10.5rem] lg:px-0">
        {/* Shade centred on the copy (Figma 9278:701: 1040×400, 72px above it) */}
        <Blob
          src="/trax/hero/shade-copy.svg"
          className="-top-[4.5rem] left-1/2 h-[25rem] w-[65rem] -translate-x-1/2"
          overhang="inset-[-40%_-15.38%]"
        />
        <FadeIn className="relative flex flex-col items-center gap-5 text-center font-helvetica lg:gap-6">
          <TraxTag className="bg-[rgba(28,104,255,0.2)] leading-[0.8125rem]">{hero.tag}</TraxTag>

          {/* One line on desktop; on phones it breaks between the two sentences */}
          <h1 className="text-display leading-none font-medium tracking-[-0.0938rem] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
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
 * The playing artwork's colours, blurred (Figma 9278:801): a 2400×1872 gold gradient at 20%
 * with soft placeholder blobs, centred and running 240px past the hero's top and sides.
 */
function BlurredArtwork() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[-15rem] left-1/2 h-[117rem] w-[150rem] -translate-x-1/2 overflow-hidden bg-linear-to-r from-[#d6932f] via-[#b9772a] to-[#dda83e] opacity-20 blur-[6.25rem]"
    >
      <Blob src="/trax/hero/bg-gold-right.svg" className="inset-[-4.07%_-13.95%_16.86%_69.77%]" overhang="inset-[-1.72%_-2.64%]" />
      <Blob src="/trax/hero/bg-orange-left.svg" className="inset-[5.23%_68.6%_-4.07%_-15.12%]" overhang="inset-[-1.51%_-2.51%]" />
      <Blob src="/trax/hero/bg-dark-centre.svg" className="inset-[3.49%_20.93%_17.44%_20.93%]" overhang="inset-[-1.89%_-2.01%]" />
      <Blob src="/trax/hero/bg-dark-lower.svg" className="inset-[68.6%_26.74%_-12.79%_19.77%]" overhang="inset-[-3.39%_-2.18%]" />
      <Blob src="/trax/hero/bg-maroon.svg" className="inset-[79.07%_3.49%_-13.95%_52.33%]" overhang="inset-[-4.29%_-2.64%]" />
    </div>
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
