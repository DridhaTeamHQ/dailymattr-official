import Image from "next/image"
import { BadgeCheck, Link2, Newspaper, type LucideIcon } from "lucide-react"

import { AnchorLink } from "@/components/shared/anchor-link"
import { PillContent, darkPill } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { cn } from "@/lib/utils"
import primaryLogo from "@/public/Figma_logos/Primary logo.png"
import { form, habit, hero, pledges, subscribeId, type Pledge } from "./content"
import { SubscribeForm } from "./subscribe-form"

// Newsletter page sections. Same 1200px column, type scale, glowing panels and form card as
// the Support and Advertise pages.

const column = "mx-auto w-full max-w-[75rem]"
const sectionPad = "px-4 sm:px-6 lg:px-8"
const h2 =
  "text-4xl leading-[1.1] font-medium tracking-[-0.09375rem] text-[#1c1c1e] lg:text-5xl lg:leading-[3.25rem]"

const pledgeIcon: Record<Pledge["key"], LucideIcon> = {
  summary: Newspaper,
  checked: BadgeCheck,
  source: Link2,
}

/** Copy and the three pledges beside the sign-up card in a glowing panel. */
export function NewsletterHero() {
  const lastLine = hero.title.length - 1
  return (
    <section
      id={subscribeId}
      className={cn(sectionPad, "scroll-mt-24 bg-white pt-12 pb-16 sm:pt-16 lg:pt-[7rem] lg:pb-[7.5rem]")}
    >
      <div
        className={cn(
          column,
          "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,31.25rem)_minmax(0,36.25rem)] lg:justify-between lg:gap-[4.5rem]",
        )}
      >
        <div className="flex flex-col items-start gap-5 lg:gap-6">
          <FadeIn
            as="p"
            className="font-helvetica text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase"
          >
            {hero.eyebrow}
          </FadeIn>
          {/* 40px on phones (not the Support page's 44) so "Open your inbox to" fits one line at 375 */}
          <FadeIn
            as="h1"
            className="text-[2.5rem] leading-[1.05] font-medium text-[#1c1c1e] sm:text-5xl lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]"
          >
            {hero.title.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i === lastLine && (
                  <>
                    {" "}
                    <span className="text-[#3979ff]">{hero.titleAccent}</span>
                  </>
                )}
              </span>
            ))}
          </FadeIn>
          <FadeIn as="p" delay={0.2} className="max-w-[28rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg">
            {hero.body}
          </FadeIn>

          <FadeIn delay={0.2} className="mt-2 w-full max-w-[26rem]">
            <ul className="flex w-full flex-col divide-y divide-[#ececf0] rounded-[1rem] border border-[#ececf0] bg-[#f7f7f7] px-3">
              {pledges.map((p) => {
                const Icon = pledgeIcon[p.key]
                return (
                  <li key={p.key} className="flex items-center gap-4 py-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[0.625rem] bg-white text-[#3979ff] shadow-[0px_1px_1px_0px_rgba(16,24,40,0.06),0px_4px_6px_0px_rgba(16,24,40,0.04)]">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="text-base leading-6 font-medium tracking-[-0.0125rem] text-[#1c1c1e]">
                      {p.title}
                    </span>
                  </li>
                )
              })}
            </ul>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div
            className="rounded-[1.5rem] border border-[rgba(57,121,255,0.12)] p-3 sm:p-6"
            style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
          >
            <SubscribeForm />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Bar widths for the five sample stories in the inbox picture: [headline, summary 1, summary 2].
const sampleRows = [
  [72, 92, 64],
  [58, 86, 70],
  [80, 90, 52],
  [64, 78, 60],
  [52, 88, 74],
] as const

/** A wordless picture of one issue: five numbered summaries, each checked and with its source. */
function InboxPreview() {
  return (
    <div
      aria-hidden
      className="rounded-[1rem] bg-white p-5 shadow-[0px_1px_1px_0px_rgba(16,24,40,0.04),0px_12px_32px_0px_rgba(16,24,40,0.06)] sm:p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <Image src={primaryLogo} alt="" className="h-5 w-auto" />
        <span className="h-2 w-10 rounded-full bg-[#ececf0]" />
      </div>
      <div className="flex flex-col gap-2 border-b border-[#ececf0] pt-4 pb-5">
        <span className="h-3 w-[68%] rounded-full bg-[#c4c8d0]" />
        <span className="h-2 w-[44%] rounded-full bg-[#ececf0]" />
      </div>

      <ol className="flex flex-col divide-y divide-[#f0f1f4]">
        {sampleRows.map(([title, line1, line2], i) => (
          <li key={i} className="flex items-start gap-3 py-3.5 sm:gap-4">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-blue-soft text-xs leading-none font-semibold text-brand-blue-deep">
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 rounded-full bg-[#c4c8d0]" style={{ width: `${title}%` }} />
                <BadgeCheck className="size-3.5 shrink-0 text-[#3979ff]" strokeWidth={2} />
              </div>
              <span className="h-2 rounded-full bg-[#ececf0]" style={{ width: `${line1}%` }} />
              <span className="h-2 rounded-full bg-[#ececf0]" style={{ width: `${line2}%` }} />
            </div>
            <span className="mt-0.5 hidden shrink-0 items-center gap-1 rounded-full border border-[#dddfe3] px-2 py-1 sm:inline-flex">
              <Link2 className="size-3 text-[#3979ff]" strokeWidth={2} />
              <span className="h-1.5 w-6 rounded-full bg-[#c4c8d0]" />
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Grey band: the two-tone promise and a way back up to the form, beside a sample issue. */
export function NewsletterHabit() {
  return (
    <section className={cn(sectionPad, "bg-[#f5f5f7] py-20 lg:py-32")}>
      <div
        className={cn(
          column,
          "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,30rem)_minmax(0,38.75rem)] lg:justify-between lg:gap-[4.5rem]",
        )}
      >
        <div className="flex flex-col items-start gap-8 lg:gap-10">
          <FadeIn as="h2" className={h2}>
            <span className="block">{habit.title}</span>
            <span className="block text-[rgba(28,28,30,0.5)]">{habit.muted}</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <AnchorLink href={`#${subscribeId}`} className={darkPill}>
              <PillContent>{form.submit}</PillContent>
            </AnchorLink>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div
            className="rounded-[1.5rem] border border-[rgba(57,121,255,0.12)] p-3 sm:p-6"
            style={{
              backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)", {
                blue: { at: "80% 20%", size: "55% 55%", alpha: 0.2 },
                violet: { at: "15% 85%", size: "50% 50%", alpha: 0.16 },
              }),
            }}
          >
            <InboxPreview />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
