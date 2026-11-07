import Image from "next/image"

import { cn } from "@/lib/utils"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { FadeIn } from "@/components/shared/fade-in"
import checkIcon from "@/public/home/check.svg"
import womanPhoto from "@/public/home/newsletter-woman.png"

// Copy from the Figma frame (8585:10373).
const points = [
  "Train 100% of your employees with a single tap",
  "Identify, manage, and close skill gaps",
  "Run daily operations with checklists and ensure compliance",
]

const fieldClass =
  "h-12 w-full rounded-[0.75rem] border border-[rgba(51,65,85,0.8)] bg-[#07090e] px-[1.0625rem] text-sm text-white placeholder:text-[#64748b] focus-visible:border-[#3979ff] focus-visible:outline-none"

/**
 * Figma 8585:10373: photo panel with the "One chai." headline, beside a 460px dark
 * newsletter card. Gap 16, both radius 16; stacked on narrow screens.
 */
export function NewsletterSection() {
  return (
    <section className="w-full px-4 py-8">
      <div className={cn(PANEL_WIDTH, "flex flex-col gap-4 lg:flex-row")}>
        {/* Image-only panel: the photo covers the whole box. Any headline is part of the
            artwork supplied from the backend, so there is no text overlay here. The focus point
            (88% down) keeps the same crop as Figma: the phone and blazer, not the face. */}
        <FadeIn className="relative aspect-[1032/634] min-w-0 flex-1 overflow-hidden rounded-[1rem] bg-[#d9e9ea] lg:aspect-auto">
          <Image
            src={womanPhoto}
            alt="A person in a pink blazer reading on their phone"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[50%_88%]"
          />
        </FadeIn>

        <FadeIn
          delay={0.1}
          className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[1rem] border border-[rgba(57,121,255,0.25)] bg-[#0d1117] p-6 sm:p-[2.3125rem] lg:w-[28.75rem]"
        >
          {/* Top-corner glow and the hairline across the top edge */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-60 rounded-full bg-[rgba(57,121,255,0.2)] blur-[4rem]" />
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-[rgba(57,121,255,0)] via-[rgba(57,121,255,0.6)] to-[rgba(57,121,255,0)]" />

          <div className="relative flex flex-col gap-[1.4375rem]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 rounded-full border border-[rgba(57,121,255,0.3)] bg-[#131926] px-[0.9375rem] py-[0.4375rem] drop-shadow-[0_0_0.375rem_rgba(57,121,255,0.15)]">
                <span className="size-1.5 rounded-full bg-[#3979ff] shadow-[0_0_0.5rem_#3979ff]" />
                <span className="text-xs leading-4 font-medium tracking-[0.0344rem] text-[#e2e8f0] uppercase">
                  Get the newsletter
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-xs leading-4.5 tracking-[-0.0181rem] text-[#94a3b8]">
                <span className="size-1.5 rounded-full bg-[#3979ff] shadow-[0_0_0.375rem_#3979ff]" />
                Weekly • 5-min read
              </span>
            </div>

            <div className="flex flex-col gap-[0.6875rem]">
              <h3 className="text-3xl leading-tight font-bold tracking-[-0.0531rem] text-white sm:text-4xl">
                Five stories.
                <br />
                <span className="bg-linear-to-r from-white via-[#f1f5f9] to-[#5e93ff] bg-clip-text text-transparent">
                  One useful email.
                </span>
              </h3>
              <p className="text-sm leading-6 text-[rgba(203,213,225,0.9)]">
                Get five selected news summaries delivered to your inbox, with source links for
                further reading.
              </p>
            </div>

            <ul className="flex flex-col gap-3.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.375rem] border border-[rgba(57,121,255,0.4)] bg-[rgba(57,121,255,0.15)] shadow-[0_0_0.625rem_rgba(57,121,255,0.2)]">
                    <Image src={checkIcon} alt="" width={14} height={14} />
                  </span>
                  <span className="text-sm leading-4.5 font-medium text-[#e2e8f0]">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            action="/newsletter"
            className="relative mt-[1.4375rem] flex flex-col gap-2.5 border-t border-[rgba(30,41,59,0.8)] pt-[1.3125rem] lg:mt-auto"
          >
            <input name="firstName" autoComplete="given-name" placeholder="First name — optional" aria-label="First name (optional)" className={fieldClass} />
            <input name="email" type="email" required autoComplete="email" placeholder="Your email address" aria-label="Email address" className={fieldClass} />
            <button
              type="submit"
              className="h-12 w-full rounded-[0.75rem] bg-[#3979ff] px-5 text-sm leading-5 font-medium text-white drop-shadow-[0_0_0.625rem_rgba(57,121,255,0.4)] transition-colors hover:bg-[#3979ff]/90"
            >
              Keep me informed
            </button>
            <p className="mt-1 text-center text-xs leading-4 text-[rgba(148,163,184,0.9)]">
              By subscribing, you agree to receive the DailyMattr newsletter.
              <br />
              Unsubscribe at any time.
            </p>
          </form>
        </FadeIn>
      </div>
    </section>
  )
}
