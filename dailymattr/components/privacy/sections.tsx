import Image from "next/image"

import { DarkArrowLink } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { cn } from "@/lib/utils"
import { ContentsNav } from "./contents-nav"
import { cta, hero, sections } from "./content"

const sectionId = (i: number) => `section-${i + 1}`

/**
 * Dark band: eyebrow, then the two-line title on the left and the intro on the right.
 * Figma 9144:324 (1920×575): eyebrow at 240px, copy row 1668px wide ending 120px above the
 * bottom. Sizes in rem (px ÷ 16) so laptops scale them.
 */
export function PrivacyHero() {
  return (
    // Side margins keep Figma's 126/1920 proportion at every desktop width, so the copy never
    // runs to the screen edges on laptops.
    <section className="bg-[#1c1c1e] px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-[6.5625vw] lg:pt-[15rem] lg:pb-[7.5rem]">
      <FadeIn className="mx-auto flex max-w-[104.25rem] flex-col gap-5 lg:gap-[1.6875rem]">
        <p className="font-helvetica text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
          {hero.eyebrow}
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="text-[2.5rem] leading-[1.15] font-medium text-white sm:text-5xl sm:leading-[1.2] lg:text-[3.5rem] lg:leading-[4.25rem] lg:whitespace-nowrap">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Paragraph widths shrink with the 21→18px type so the lines break as in Figma. */}
          <div className="flex flex-col gap-6 font-helvetica text-base leading-7 tracking-[-0.0125rem] text-white/60 lg:gap-6 lg:text-lg">
            <p className="max-w-[37.875rem]">{hero.body[0]}</p>
            <p className="max-w-[33.75rem]">{hero.body[1]}</p>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

/** Sticky contents beside the numbered policy sections. Figma 8697:528. */
export function PrivacyPolicy() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] pt-6 lg:grid-cols-[17.5rem_minmax(0,46.5rem)] lg:gap-24 lg:px-10 lg:pt-[6.25rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain">
            <ContentsNav items={sections.map((s, i) => ({ id: sectionId(i), label: s.nav }))} />
          </div>
        </aside>

        <article>
          {sections.map((s, i) => (
            <section
              key={s.title}
              id={sectionId(i)}
              aria-labelledby={`${sectionId(i)}-title`}
              className={cn("scroll-mt-24 py-[2.125rem]", i === 0 ? "pt-0" : "border-t border-[#ececf0]")}
            >
              <p className="text-xs leading-[1.3125rem] font-bold tracking-[0.1875rem] text-[#3979ff]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2
                id={`${sectionId(i)}-title`}
                className="pt-2.5 text-2xl leading-tight font-bold tracking-[-0.03125rem] text-[#141417] lg:text-[1.6875rem] lg:leading-[2.1094rem]"
              >
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </section>
  )
}

/** Closing CTA panel with the lock tile. Figma 8697:1616. */
export function PrivacyChoices() {
  return (
    <section className="bg-white px-4 pt-12 pb-20 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto max-w-[75rem]">
        <div
          className="flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-[rgba(57,121,255,0.12)] p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-8 lg:px-20 lg:py-[4.5rem]"
          style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
        >
          <span className="grid size-[4.5rem] shrink-0 place-items-center rounded-[1.25rem] bg-white shadow-[0px_0px_0px_1px_rgba(57,121,255,0.14),0px_24px_64px_0px_rgba(57,121,255,0.16),0px_8px_24px_0px_rgba(142,115,240,0.1)]">
            <Image src="/privacy/lock.svg" alt="" width={32} height={32} className="size-8" />
          </span>
          <h2 className="flex-1 font-helvetica text-3xl leading-none font-medium tracking-[-0.0938rem] text-[#1c1b17] lg:text-display lg:leading-11">
            {cta.title}
          </h2>
          <DarkArrowLink href={cta.button.href} className="shrink-0">
            {cta.button.label}
          </DarkArrowLink>
        </div>
      </FadeIn>
    </section>
  )
}
