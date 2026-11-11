import Image from "next/image"
import Link from "next/link"

import { DarkArrowLink } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { formats, hero, media, press, purpose } from "./content"

// Figma sizes are px on a 1920 frame; written in rem (px ÷ 16) so laptops scale them down.
const HEADING =
  "font-helvetica text-3xl leading-[1.15] font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]"

/** Dark hero: "About" beside the dailymattr wordmark. Figma 8595:12572. */
export function AboutHero() {
  return (
    <section className="bg-[#1c1c1e] px-4 py-24 sm:px-6 lg:py-[11.25rem]">
      <FadeIn className="mx-auto flex flex-col items-center gap-6 text-center lg:gap-8">
        <h1 className="flex flex-wrap items-end justify-center gap-x-4 gap-y-2 lg:gap-x-6">
          <span className="text-[2.75rem] leading-none font-medium text-white lg:text-[4.25rem] lg:leading-[5.25rem]">
            {hero.title}
          </span>
          {/* The wordmark art overhangs its 459 × 61 slot (Figma insets −32.56% / −17.71%). */}
          <span className="relative block h-[2.5rem] w-[18.8rem] shrink-0 lg:h-[3.8125rem] lg:w-[28.6875rem]">
            <span className="absolute inset-x-0 top-[-32.56%] bottom-[-17.71%]">
              {/* eslint-disable-next-line @next/next/no-img-element -- stretched vector art */}
              <img src="/about/wordmark.svg" alt="dailymattr" className="block size-full max-w-none" />
            </span>
          </span>
        </h1>
        <p className="max-w-[40.75rem] font-helvetica text-lg leading-7 tracking-[-0.0125rem] text-white/60 lg:text-[1.3125rem] lg:leading-7">
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
