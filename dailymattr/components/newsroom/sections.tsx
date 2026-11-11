import Image from "next/image"

import { ContentsNav } from "@/components/privacy/contents-nav"
import { DarkArrowLink } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { cn } from "@/lib/utils"
import { cta, hero, sections } from "./content"

// Same layout as the Privacy Policy page (components/privacy/sections.tsx), with Newsroom copy.

const sectionId = (i: number) => `section-${i + 1}`

/**
 * Centred intro copy over the newsroom photo. It fills the rest of the first screen below
 * the announcement bar and nav (--chrome-height, set by the header).
 */
export function NewsroomHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--chrome-height,5.5rem))] flex-col overflow-hidden bg-[#0e0e0e] px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24 lg:pb-10">
      <Image
        src="/cover-images/newsroom_poster.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Slowly fades the bottom of the photo into the page background (#0e0e0e) below, so
          there is no hard edge where the article starts. Eased stops keep the ramp smooth. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(to_top,#0e0e0e_0%,rgba(14,14,14,0.92)_15%,rgba(14,14,14,0.7)_35%,rgba(14,14,14,0.4)_60%,rgba(14,14,14,0.15)_82%,transparent_100%)]"
      />

      {/* The title block stays centred in the space above; the body copy sits at the bottom. */}
      <div className="mx-auto flex w-full max-w-[75rem] flex-1 flex-col items-center gap-10">
        {/* No wash over the photo here, so a soft shadow keeps the white title legible. */}
        <FadeIn className="my-auto flex flex-col items-center gap-5 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] lg:gap-6">
          <p className="font-helvetica text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="text-[2.75rem] leading-[1.05] font-medium sm:text-5xl lg:text-6xl lg:leading-16 lg:whitespace-nowrap text-white">
            {hero.title.join(" ")}
          </h1>
          <p className="max-w-[36rem] text-lg leading-7 font-semibold text-white lg:text-xl">
            {hero.lead}
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="flex flex-col items-center gap-5 text-center lg:gap-6">
          {hero.body.map((p) => (
            <p key={p} className="max-w-[36rem] text-base leading-7 text-white/60 lg:text-lg">
              {p}
            </p>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}

/** Sticky contents beside the numbered sections. */
export function NewsroomArticle() {
  return (
    <section className="bg-[#0e0e0e] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] pt-6 lg:grid-cols-[17.5rem_minmax(0,46.5rem)] lg:gap-24 lg:px-10 lg:pt-14">
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
              className={cn("scroll-mt-24 py-[2.125rem]", i === 0 ? "pt-0" : "border-t border-white/8")}
            >
              <p className="text-xs leading-[1.3125rem] font-bold tracking-[0.1875rem] text-[#3979ff]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2
                id={`${sectionId(i)}-title`}
                className="pt-2.5 text-2xl leading-tight font-bold tracking-[-0.03125rem] text-white lg:text-[1.6875rem] lg:leading-[2.1094rem]"
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

/** Closing CTA panel with the newspaper tile. */
export function NewsroomCta() {
  return (
    <section className="bg-[#0e0e0e] px-4 pt-12 pb-20 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto max-w-[75rem]">
        <div
          className="flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-[rgba(57,121,255,0.22)] p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-8 lg:px-20 lg:py-[4.5rem]"
          style={{ backgroundImage: softGlow("linear-gradient(#141418, #141418)") }}
        >
          <span className="grid size-[4.5rem] shrink-0 place-items-center rounded-[1.25rem] bg-[#18181b] shadow-[0px_0px_0px_1px_rgba(57,121,255,0.24),0px_24px_64px_0px_rgba(57,121,255,0.16),0px_8px_24px_0px_rgba(142,115,240,0.1)]">
            <Image src="/newsroom/newspaper.svg" alt="" width={32} height={32} className="size-8" />
          </span>
          <h2 className="flex-1 font-helvetica text-3xl leading-none font-medium tracking-[-0.0938rem] text-white lg:text-display lg:leading-11">
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
