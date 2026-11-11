import Image from "next/image"
import Link from "next/link"

import { DarkArrowLink } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { formats, hero, media, press, purpose } from "./content"

// Figma sizes are px on a 1920 frame; written in rem (px ÷ 16) so laptops scale them down.
const HEADING =
  "font-helvetica text-xl leading-[1.15] font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]"

/**
 * Hero over the office photo: "About" beside the dailymattr wordmark at the bottom left, the
 * intro at the bottom right. It fills the rest of the first screen below the announcement bar
 * and nav (--chrome-height, set by the header).
 */
export function AboutHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--chrome-height,5.5rem))] items-end overflow-hidden bg-[#1c1c1e] px-4 pt-24 pb-6 sm:px-6 lg:pl-15 lg:pb-8">
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
        <h1 className="flex shrink-0 flex-wrap items-baseline gap-x-[0.4em] gap-y-2 text-[2rem] leading-none font-medium text-white sm:text-[2.5rem] lg:text-[2.25rem] xl:text-[2.75rem]">
          <span>{hero.title}</span>
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
        <p className="max-w-[36rem] font-helvetica text-base leading-7 tracking-[-0.0125rem] text-white/80 sm:text-lg lg:max-w-[30rem] lg:text-[1.1125rem] xl:max-w-[36rem]">
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
      <FadeIn className="mx-auto flex max-w-[61.25rem] flex-col items-center gap-6 text-center font-helvetica">
        <p className="text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
          {purpose.eyebrow}
        </p>
        <p className={HEADING}>{purpose.statement}</p>
      </FadeIn>
    </section>
  )
}

/** Four format cards with soft corner glows. Figma 8595:12621. */
export function AboutFormats() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <FadeIn className="flex flex-col items-center gap-4 text-center font-helvetica">
          <h2 className={HEADING}>{formats.title}</h2>
          <p className="text-lg leading-[1.875rem] tracking-[-0.0188rem] text-[#696969] lg:text-xl">
            {formats.subtitle}
          </p>
        </FadeIn>

        <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {formats.items.map((f, i) => (
            <li key={f.name}>
              <FadeIn delay={i * 0.06} className="h-full">
                <Link
                  href={f.href}
                  className="flex h-full min-h-[10rem] flex-col gap-6 rounded-2xl px-6 py-8 font-helvetica transition-transform hover:-translate-y-1 lg:min-h-[12.25rem] lg:px-8 lg:py-10"
                  style={{
                    backgroundImage: softGlow("linear-gradient(#f7f7f7, #f7f7f7)", {
                      blue: { at: "20% 20%", size: "45% 60%", alpha: 0.12 },
                      violet: { at: "85% 80%", size: "40% 60%", alpha: 0.1 },
                    }),
                  }}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white drop-shadow-[0px_1px_1px_rgba(16,24,40,0.06)] drop-shadow-[0px_4px_6px_rgba(16,24,40,0.04)]">
                    <Image src={f.icon} alt="" width={24} height={24} className="size-6" />
                  </span>
                  <span className="text-3xl leading-none font-medium tracking-[-0.0938rem] text-[#1c1b17] lg:text-display lg:leading-11">
                    {f.name}
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Downloadable press files on white cards. Figma 8595:12622. */
export function AboutPress() {
  return (
    <section id="press" className="bg-[#f5f5f7] px-4 py-24 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <FadeIn>
          <h2 className={HEADING}>{press.title}</h2>
        </FadeIn>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {press.items.map((item, i) => (
            <li key={item.label}>
              <FadeIn delay={(i % 3) * 0.06} className="h-full">
                <a
                  href={item.href}
                  className="group flex h-full min-h-[6rem] items-center gap-4 rounded-2xl bg-white px-7 py-6 font-helvetica transition-shadow hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eaf1ff]">
                    <Image src={item.icon} alt="" width={24} height={24} className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1 text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">
                    {item.label}
                  </span>
                  <Image
                    src="/about/press-download.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Glowing contact panel. Figma 8595:12706. */
export function AboutMedia() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-[10rem]">
      <FadeIn className="mx-auto max-w-[75rem]">
        <div
          className="flex flex-col items-start gap-8 overflow-hidden rounded-3xl border border-[rgba(57,121,255,0.12)] p-8 font-helvetica sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-20"
          style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
        >
          <div className="flex max-w-[47.9rem] flex-col gap-4">
            <h2 className={HEADING}>{media.title}</h2>
            <p className="max-w-[40rem] text-lg leading-[1.875rem] tracking-[-0.0188rem] text-[#696969] lg:text-xl">
              {media.body}
            </p>
          </div>
          <DarkArrowLink href={media.cta.href} className="shrink-0">
            {media.cta.label}
          </DarkArrowLink>
        </div>
      </FadeIn>
    </section>
  )
}
