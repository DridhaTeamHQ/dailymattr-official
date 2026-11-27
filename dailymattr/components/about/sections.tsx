import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import buildingPhoto from "@/public/logo_animation/Building image. 1.png"
import { hero, media, purpose } from "./content"

// Figma sizes are px on a 1920 frame; written in rem (px ÷ 16) so laptops scale them down.
const HEADING =
  "text-xl leading-[1.15] font-bold tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]"

/**
 * Hero over the office photo: "About" beside the dailymattr wordmark at the bottom left, the
 * intro at the bottom right. It fills the rest of the first screen below the announcement bar
 * and nav (--chrome-height, set by the header).
 */
export function AboutHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--chrome-height,5.5rem))] items-end overflow-hidden bg-[#1c1c1e] px-4 pt-24 pb-6 sm:px-6 lg:pl-15 lg:pb-20">
      <Image
        src="/cover-images/about_page_poster.JPG"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Darkens only the bottom of the photo, where the copy sits; the top stays clear. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1c1c1e]/90 via-[#1c1c1e]/40 via-45% to-transparent"
      />

      <FadeIn className="flex w-full flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        {/* One font size drives the whole title: the wordmark is sized in em, so it scales with
            "About" at every breakpoint. Baseline-aligned: the wordmark slot's bottom edge is the
            wordmark's baseline. */}
        <h1 className="flex shrink-0 flex-wrap items-baseline gap-x-[0.4em] gap-y-2 text-[2rem] leading-none font-bold text-white sm:text-[2.5rem] lg:text-[2.25rem] xl:text-[2.75rem]">
          {/* Scaled so the x-height of "bout" (Inter Tight ≈ 0.545em) equals the wordmark's
              lowercase height (41 of its 66.8-unit ascender height at 0.75em ≈ 0.46em). */}
          <span className="text-[0.845em]">{hero.title}</span>
          {/* The slot spans the wordmark from its ascenders (top of the art) to its baseline
              (66.8 of the 91.67-unit art height), so the "y" descender overhangs below by 37.2%.
              Height 0.75em ≈ the cap height of "About"; width keeps the art's 459 : 66.8 ratio. */}
          <span className="relative block h-[0.75em] w-[5.153em] shrink-0">
            <span className="absolute inset-x-0 top-0 bottom-[-37.2%]">
              {/* eslint-disable-next-line @next/next/no-img-element -- stretched vector art */}
              <img src="/about/wordmark.svg" alt="dailymattr" className="block size-full max-w-none" />
            </span>
          </span>
        </h1>
        <p className="max-w-[36rem] text-base leading-7 tracking-[-0.0125rem] text-white/80 sm:text-lg lg:max-w-[30rem] lg:text-[1.1125rem] xl:max-w-[36rem]">
          {hero.body}
        </p>
      </FadeIn>
    </section>
  )
}

/** Eyebrow + large centred statement. Figma 8595:12573. */
export function AboutPurpose() {
  return (
    <section className="bg-[#f5f5f7] px-4 py-24 sm:px-6 lg:py-[10rem]">
      <FadeIn className="mx-auto flex max-w-[61.25rem] flex-col items-center gap-6 text-center">
        <p className="text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
          {purpose.eyebrow}
        </p>
        <p className={HEADING}>
          {purpose.statement.map(({ text, muted }) =>
            muted ? (
              <span key={text} className="text-[rgba(28,28,30,0.5)]">
                {text}
              </span>
            ) : (
              text
            ),
          )}
        </p>
      </FadeIn>
    </section>
  )
}

/** Darkens the bottom and right edges of the photo. Figma 9144:290. */
const mediaPhotoOverlay = [
  "linear-gradient(61.72deg, rgba(0, 0, 0, 0) 58.77%, rgba(0, 0, 0, 0.7) 99.7%)",
  "linear-gradient(179.03deg, rgba(0, 0, 0, 0) 10.72%, rgba(0, 0, 0, 0.7) 97.92%)",
].join(", ")

/**
 * Frosted contact card over a full-bleed photo of the dailymattr building (Figma's image,
 * public/logo_animation/Building image. 1.png). Figma 9144:289: 1920×747 frame, card 9144:311
 * at left 207 / bottom 84, 290 tall.
 */
export function AboutMedia() {
  return (
    // data-full-bleed: the footer adds Figma's 97px top gap after a page-ending photo.
    <section data-full-bleed className="relative isolate flex px-4 pt-48 pb-6 sm:px-6 sm:pt-64 sm:pb-10 lg:h-[46.6875rem] lg:items-end lg:px-0 lg:pt-0 lg:pb-[5.25rem] lg:pl-[12.9375rem]">
      {/* Framed as Figma crops it (9144:290): the photo is 141.63% of the frame's height,
          bottom-aligned, so the top of the tower runs off the frame and the blue logo sits a
          third of the way down, above the card. Figma also stretches it about 1.3× sideways;
          here it keeps its true proportions. Taller still on phones, where the card covers
          more of the section. Only the photo is clipped (not the section), so the card's
          fade-up isn't cut off at the section's bottom edge. */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[160%] lg:h-[141.63%]">
          <Image
            src={buildingPhoto}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 64rem) 100vw, 200vw"
            className="object-cover object-[42%_bottom] lg:object-bottom"
          />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: mediaPhotoOverlay }} />

      <FadeIn className="w-full lg:w-auto">
        {/*
          Figma draws this with its Glass effect (frost 15, depth 11, light −45° at 0.8,
          refraction 0.96, dispersion 0.77) over a 20% white fill. CSS has no Glass, so:
          frost 15 → blur(7.5px) (Figma radius ≈ 2σ) and depth → a faint 11px inner glow.
          No white light rim on the edge, only the faint blue border.
        */}
        <div className="flex flex-col items-start gap-8 overflow-hidden rounded-3xl border border-[rgba(57,121,255,0.12)] bg-white/20 p-6 shadow-[inset_0_0_11px_rgba(255,255,255,0.08)] backdrop-blur-[7.5px] backdrop-saturate-[1.15] sm:p-12 lg:h-[18.125rem] lg:flex-row lg:gap-0 lg:p-20">
          <div className="flex flex-col gap-4 lg:w-[37.0625rem]">
            <h2 className="text-xl leading-[1.15] font-bold tracking-[-0.0625rem] text-white sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]">
              {media.title}
            </h2>
            <p className="max-w-[40rem] text-lg leading-[1.875rem] tracking-[-0.0188rem] text-white lg:w-[40rem] lg:text-xl">
              {media.bodyLines[0]} <br className="hidden lg:block" />
              {media.bodyLines[1]}
            </p>
          </div>

          <div className="shrink-0 lg:w-[14.1875rem]">
            <Link
              href={media.cta.href}
              className="flex h-10 w-fit items-center gap-2.5 rounded-[0.8125rem] bg-white py-2 pr-2 pl-4 transition-[translate,background-color] hover:-translate-y-px hover:bg-white/90"
            >
              <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-[#1c1c1e]">
                {media.cta.label}
              </span>
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-[rgba(57,121,255,0.2)]">
                <Image src="/shared/arrow-up-right-blue.svg" alt="" width={12} height={12} className="block size-3" />
              </span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
