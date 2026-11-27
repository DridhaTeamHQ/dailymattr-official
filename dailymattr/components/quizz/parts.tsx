"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { lensOrder, lenses, type Edition, type LensKey, type Question, type QuizOption } from "./content"

/*
 * News IQ parts. Sizes follow the News IQ UI guide (px on a phone), written in rem so the
 * laptop root scaling in globals.css applies. Colours are the News IQ tokens in globals.css.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"

export const CARD = "grid gap-3.5 rounded-[1.5rem] border border-hairline bg-white p-5"

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs leading-4 font-semibold tracking-[0.06em] text-brand-blue-deep uppercase", className)}>
      {children}
    </p>
  )
}

/**
 * Series tag and edition date above every screen. Inside a quiz, `homeHref` turns the left side
 * into a way back to all stories.
 */
export function SeriesBar({ date, homeHref }: { date: string; homeHref?: string }) {
  const tag = (
    <span className="inline-flex h-7 items-center rounded-full bg-ink px-3 text-[0.8125rem] font-semibold text-white">
      News IQ
    </span>
  )
  return (
    <div className="flex items-center justify-between gap-3">
      {homeHref ? (
        <Link
          href={homeHref}
          className={cn("group inline-flex items-center gap-2 rounded-full text-sm leading-5 font-semibold text-ink", FOCUS)}
        >
          {tag}
          <span className="inline-flex items-center gap-1 text-ink-muted group-hover:text-ink">
            <ArrowLeft aria-hidden className="size-3.5" strokeWidth={2.4} />
            All stories
          </span>
        </Link>
      ) : (
        tag
      )}
      <span className="text-sm leading-5 font-medium text-ink-muted">Edition · {date}</span>
    </div>
  )
}

/* ---------- buttons ---------- */

const BTN =
  "group inline-flex h-13 w-full items-center gap-3 rounded-[1rem] text-base leading-5 font-semibold transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-track disabled:text-ink-muted disabled:shadow-none disabled:active:scale-100"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(BTN, FOCUS, "justify-between bg-brand-blue-deep pr-2.5 pl-5 text-white enabled:hover:bg-brand-blue-deep-hover", className)}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      <span className="grid size-8 shrink-0 place-items-center rounded-[0.625rem] bg-white/18 group-disabled:bg-transparent">
        <ArrowRight aria-hidden className="size-4" strokeWidth={2.2} />
      </span>
    </button>
  )
}

export function SecondaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        BTN,
        FOCUS,
        "justify-center bg-white px-5 text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] enabled:hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/** PrimaryButton's look, for navigation. */
export function PrimaryLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(BTN, FOCUS, "justify-between bg-brand-blue-deep pr-2.5 pl-5 text-white hover:bg-brand-blue-deep-hover", className)}
    >
      <span className="min-w-0 truncate">{children}</span>
      <span className="grid size-8 shrink-0 place-items-center rounded-[0.625rem] bg-white/18">
        <ArrowRight aria-hidden className="size-4" strokeWidth={2.2} />
      </span>
    </Link>
  )
}

export function BackButton(props: ButtonProps) {
  return (
    <button
      type="button"
      aria-label="Previous question"
      className={cn(
        BTN,
        FOCUS,
        "w-13 shrink-0 justify-center bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] enabled:hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]"
      )}
      {...props}
    >
      <ArrowLeft aria-hidden className="size-[1.125rem]" strokeWidth={2.2} />
    </button>
  )
}

export function TextLink({ className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "self-start rounded-sm text-sm leading-5 font-semibold text-brand-blue-deep underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2",
        FOCUS,
        className
      )}
      {...props}
    />
  )
}

/**
 * The screen's action bar. Phones: pinned to the bottom edge, full bleed. Wider: a floating
 * bar that sticks 16px above the bottom and lands at the end of the screen's content.
 */
export function ActionBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-8 flex gap-2.5 border-t border-hairline bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(17,20,24,0.06)] sm:bottom-4 sm:mx-0 sm:rounded-[1.25rem] sm:border sm:p-3 sm:shadow-[0_12px_32px_rgba(17,20,24,0.08)]",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ---------- story ---------- */

/** One fact. Rows sit on a shared subgrid, so the number column fits the widest number. */
export function FactRow({ num, text, source }: { num: string; text: string; source: string }) {
  return (
    <li className="col-span-full grid grid-cols-subgrid gap-y-1.5 rounded-[1rem] border border-hairline bg-white px-4 py-3.5">
      <span className="min-w-[4.5rem] text-2xl leading-7 font-extrabold tracking-[-0.025em] whitespace-nowrap text-brand-blue tabular-nums">
        {num}
      </span>
      <p className="text-md leading-[1.375rem] text-ink">{text}</p>
      <SourceChip className="col-start-2">{source}</SourceChip>
    </li>
  )
}

export function SourceChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "justify-self-start rounded-[0.5rem] bg-paper px-2 py-1 text-xs leading-4 font-semibold text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  )
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 self-start rounded-sm text-sm leading-5 font-semibold text-brand-blue-deep underline decoration-[1.5px] underline-offset-[3px] hover:decoration-2",
        FOCUS
      )}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.2} />
    </a>
  )
}

/** Eyebrow, headline, dek, facts and the source link. Used on the Story screen and in the sheet. */
export function StoryBody({
  edition,
  heading,
}: {
  edition: Edition
  /** The headline element, so the Story screen can make it the focus target. */
  heading: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <Eyebrow>
          {edition.category} · {edition.date}
        </Eyebrow>
        {heading}
        <p className="text-base leading-6 text-ink-muted lg:text-lg lg:leading-7">{edition.dek}</p>
      </div>
      <ul className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2">
        {edition.facts.map((f) => (
          <FactRow key={f.num} {...f} />
        ))}
      </ul>
      <ExternalLink href={edition.storyUrl}>Read the full story on dailymattr</ExternalLink>
    </div>
  )
}

/** The story's photo with its category pill: landscape on phones, the photo's own 2:3 on desktop. */
export function StoryImage({ edition, className }: { edition: Edition; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-track sm:aspect-[3/2] lg:aspect-[2/3]", className)}>
      <Image
        src={edition.image.src}
        alt={edition.image.alt}
        fill
        preload
        loading="eager"
        sizes="(min-width: 1024px) 24rem, (min-width: 640px) 37.5rem, 100vw"
        className="object-cover"
        style={{ objectPosition: edition.image.focus }}
      />
      <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1.5 text-xs leading-4 font-semibold tracking-[0.06em] text-ink uppercase">
        {edition.category}
      </span>
    </div>
  )
}

/** A story to pick on /quizz: photo, category, headline. Links straight to its quiz. */
export function StoryPickCard({ edition, href, className }: { edition: Edition; href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[1.25rem] border border-hairline bg-white text-left transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(17,20,24,0.10)] active:translate-y-0",
        FOCUS,
        className
      )}
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-track">
        <Image
          src={edition.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 16rem, (min-width: 640px) 18rem, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: edition.image.focus }}
        />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-xs leading-[0.875rem] font-semibold tracking-[0.06em] text-ink uppercase">
          {edition.category}
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <span className="line-clamp-6 text-md leading-5 sm:line-clamp-4 font-bold tracking-[-0.01em] text-ink sm:text-base sm:leading-[1.375rem]">
          {edition.headline}
        </span>
        <span className="mt-auto flex items-center justify-between gap-2 text-xs leading-4 font-semibold text-brand-blue-deep">
          3 questions
          <span className="grid size-7 place-items-center rounded-[0.5rem] bg-brand-blue-soft transition-colors group-hover:bg-brand-blue-deep group-hover:text-white">
            <ArrowRight aria-hidden className="size-3.5" strokeWidth={2.4} />
          </span>
        </span>
      </span>
    </Link>
  )
}

export const TITLE =
  "text-2xl leading-[1.875rem] font-bold tracking-[-0.015em] text-balance text-ink outline-none sm:text-[1.75rem] sm:leading-[2.125rem]"

/* ---------- question ---------- */

export function Progress({
  current,
  total,
  label,
  onReread,
}: {
  current: number
  total: number
  label: string
  onReread: () => void
}) {
  return (
    <div className="grid gap-2.5">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} of ${total}`}
        className="flex gap-1.5"
      >
        {Array.from({ length: total }, (_, i) => (
          <i
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i < current ? "bg-brand-blue" : "bg-track")}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-sm leading-5 font-medium text-ink-muted">
          Question {current} of {total} · {label}
        </span>
        <TextLink onClick={onReread}>Re-read the brief</TextLink>
      </div>
    </div>
  )
}

/**
 * Answer options as a radio group: click to pick, arrow keys move and pick, A to D jump,
 * Enter continues once something is picked.
 */
export function OptionGroup({
  question,
  value,
  onChange,
  onSubmit,
  labelledBy,
}: {
  question: Question
  value: number | undefined
  onChange: (index: number) => void
  onSubmit: () => void
  labelledBy: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const count = question.options.length

  const pick = (i: number) => {
    onChange(i)
    refs.current[i]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault()
      pick((i + 1) % count)
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault()
      pick((i - 1 + count) % count)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (value !== undefined) onSubmit()
      else onChange(i)
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const k = "abcd".indexOf(e.key.toLowerCase())
      if (k > -1 && k < count) {
        e.preventDefault()
        pick(k)
      }
    }
  }

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-2.5">
      {question.options.map((o, i) => {
        const checked = value === i
        // Roving focus: the picked option, or the first when nothing is picked yet.
        const tabbable = value === undefined ? i === 0 : checked
        return (
          <OptionButton
            key={o.text}
            ref={(el) => {
              refs.current[i] = el
            }}
            letter={"ABCD"[i]}
            option={o}
            checked={checked}
            tabIndex={tabbable ? 0 : -1}
            onClick={() => onChange(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          />
        )
      })}
    </div>
  )
}

function OptionButton({
  ref,
  letter,
  option,
  checked,
  ...props
}: {
  ref: React.Ref<HTMLButtonElement>
  letter: string
  option: QuizOption
  checked: boolean
} & Omit<ButtonProps, "children">) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      className={cn(
        "group flex min-h-14 w-full items-start gap-3 rounded-[1rem] bg-white p-3.5 text-left text-base leading-[1.375rem] font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-[background-color,box-shadow] duration-150 not-aria-checked:hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)] aria-checked:bg-brand-blue-soft aria-checked:shadow-[inset_0_0_0_2px_var(--color-brand-blue)] lg:text-lg lg:leading-7",
        FOCUS
      )}
      {...props}
    >
      <span
        aria-hidden
        className="grid size-7 shrink-0 place-items-center rounded-[0.5rem] text-[0.8125rem] font-bold text-ink-muted shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors duration-150 group-aria-checked:bg-brand-blue-deep group-aria-checked:text-white group-aria-checked:shadow-none"
      >
        {letter}
      </span>
      <span className="min-w-0 flex-1 pt-[0.1875rem]">{option.text}</span>
      <span
        aria-hidden
        className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-blue-deep text-white opacity-0 transition-opacity duration-150 group-aria-checked:opacity-100"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    </button>
  )
}

/* ---------- score ---------- */

const RING_R = 72
const RING_C = 2 * Math.PI * RING_R

/** The one blue block: score ring, band name, and the band's line on the deep-blue strip. */
export function ScoreCard({
  pct,
  band,
  bandDesc,
  tag,
  headingRef,
  onCopy,
}: {
  pct: number
  band: string
  bandDesc: string
  /** Right-hand pill: the story's category. */
  tag: string
  headingRef: React.Ref<HTMLHeadingElement>
  /** Copies a one-line summary of the result; shown as a button on the card. */
  onCopy: () => void
}) {
  const reduce = useReducedMotion()
  const count = useMotionValue(reduce ? pct : 0)
  const shown = useTransform(() => Math.round(count.get()))

  useEffect(() => {
    if (reduce) {
      count.set(pct)
      return
    }
    const controls = animate(count, pct, { duration: 0.9, ease: [0.33, 1, 0.68, 1] })
    return () => controls.stop()
  }, [count, pct, reduce])

  const offset = RING_C * (1 - pct / 100)

  return (
    // A flex column so the deep-blue strip stays at the bottom when the card is stretched to
    // match the thinking style card beside it.
    <section className="flex flex-col overflow-hidden rounded-[1.5rem] bg-brand-blue text-center text-white">
      <div className="flex justify-between gap-2 px-4 pt-4">
        <Pill>Your News IQ score</Pill>
        <Pill>{tag}</Pill>
      </div>
      <div className="relative mx-auto mt-2.5 mb-1.5 size-42" aria-hidden>
        <svg viewBox="0 0 168 168" className="size-full -rotate-90">
          <circle cx="84" cy="84" r={RING_R} fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="12" />
          <motion.circle
            cx="84"
            cy="84"
            r={RING_R}
            fill="none"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            initial={reduce ? false : { strokeDashoffset: RING_C }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.3, 0.7, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-1.5">
          <span className="text-5xl leading-none font-extrabold tracking-[-0.04em] tabular-nums">
            <motion.span>{shown}</motion.span>
            <small className="ml-px text-2xl tracking-normal">%</small>
          </span>
          <Pill>Awareness</Pill>
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="px-5 pt-1 pb-5 text-3xl leading-8 font-extrabold tracking-[-0.025em] text-balance text-accent-yellow outline-none"
      >
        <span className="sr-only">Your News IQ score: {pct}% Awareness. </span>
        {band}
      </h1>
      <div className="mt-auto flex flex-col items-start gap-3 bg-brand-blue-deep px-5 pt-3.5 pb-4 text-left">
        <p className="text-md leading-[1.375rem]">{bandDesc}</p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-white/16 px-3.5 text-sm leading-5 font-semibold text-white transition-colors hover:bg-white/24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
        >
          <Copy aria-hidden className="size-4" strokeWidth={2.2} />
          Copy my result
        </button>
      </div>
    </section>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-brand-blue-deep px-2.5 py-[0.3125rem] text-xs leading-[0.875rem] font-semibold tracking-[0.06em] whitespace-nowrap uppercase">
      {children}
    </span>
  )
}

function Monogram({ lens, size = "lg" }: { lens: LensKey; size?: "lg" | "sm" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-ink font-bold tracking-[0.02em] text-white",
        size === "lg" ? "size-11 text-md" : "size-5 text-[0.53rem]"
      )}
    >
      {lenses[lens].mono}
    </span>
  )
}

/** Dominant thinking style, and how the picks spread across all four. Only yours is coloured. */
export function StyleCard({ lens, tally, total }: { lens: LensKey; tally: Record<LensKey, number>; total: number }) {
  const reduce = useReducedMotion()
  const L = lenses[lens]
  return (
    // content-start: when stretched beside the score card, the extra height goes below the meter.
    <section className={cn(CARD, "content-start lg:gap-5 lg:p-7")}>
      <Eyebrow>Your thinking style</Eyebrow>
      <div className="flex items-start gap-3.5">
        <Monogram lens={lens} />
        <div className="grid gap-1.5">
          <h2 className="text-xl leading-7 font-bold tracking-[-0.015em] text-ink">{L.name}</h2>
          <p className="text-md leading-[1.375rem] text-ink-muted">{L.desc}</p>
        </div>
      </div>
      <ul aria-label="Your picks by thinking style" className="grid gap-2.5">
        {lensOrder.map((k) => {
          const you = k === lens
          return (
            <li
              key={k}
              className={cn(
                "grid grid-cols-[6.5rem_minmax(0,1fr)_1rem] items-center gap-2.5 text-sm leading-5",
                you ? "font-bold text-ink" : "text-ink-muted"
              )}
            >
              <span>{lenses[k].short}</span>
              <span className="h-2 overflow-hidden rounded-full bg-track">
                <motion.span
                  className={cn("block h-full w-full origin-left rounded-full", you ? "bg-brand-blue" : "bg-line-strong")}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: tally[k] / total }}
                  transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
                />
              </span>
              <span className="text-right tabular-nums">{tally[k]}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * One answer and how close it was: never "wrong", just how close, with the right answer
 * explained. On desktop the question and your answer sit on the left, the answer on the right.
 */
export function ReviewItem({ n, question, pick }: { n: number; question: Question; pick: QuizOption }) {
  return (
    <div className="grid gap-2.5 border-t border-hairline pt-4 first-of-type:border-t-0 first-of-type:pt-0 lg:grid-cols-2 lg:gap-x-10 lg:pt-6">
      <div className="grid content-start gap-2.5">
        <span className="inline-flex items-center gap-1.5 justify-self-start rounded-full bg-paper py-[0.1875rem] pr-2.5 pl-[0.1875rem] text-xs leading-4 font-semibold text-ink">
          <Monogram lens={pick.lens} size="sm" />
          {lenses[pick.lens].short} answer
        </span>
        <h3 className="text-lg leading-6 font-semibold tracking-[-0.01em] text-ink">
          {n}. {question.text}
        </h3>
        <div className="grid gap-2 rounded-[0.75rem] bg-paper px-3.5 py-3 text-md leading-[1.375rem] text-ink">
          <span className="text-xs font-semibold text-ink-muted">You said</span>
          {pick.text}
          <span className="flex items-center gap-2 text-[0.78rem] font-medium text-ink-muted">
            Closeness to the facts
            <span className="inline-flex gap-1" aria-hidden>
              {[0, 1, 2].map((d) => (
                <i
                  key={d}
                  className={cn(
                    "size-2 rounded-full",
                    d < pick.aw ? "bg-brand-blue" : "shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]"
                  )}
                />
              ))}
            </span>
            {pick.aw} of 3
          </span>
        </div>
      </div>
      <div className="grid content-start gap-1 text-md leading-[1.375rem] text-ink lg:gap-2 lg:rounded-[0.75rem] lg:bg-brand-blue-soft lg:px-4 lg:py-3.5">
        <span className="text-xs leading-4 font-semibold tracking-[0.06em] text-brand-blue-deep uppercase">
          The answer
        </span>
        {pick.note}
      </div>
    </div>
  )
}

export function TakeawayCard({ edition }: { edition: Edition }) {
  return (
    <section className={CARD}>
      <Eyebrow>The one thing to remember</Eyebrow>
      <p className="text-lg leading-[1.625rem] font-semibold tracking-[-0.01em] text-ink">{edition.takeaway}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {edition.sources.map((s) => (
          <SourceChip key={s}>{s}</SourceChip>
        ))}
      </div>
      <ExternalLink href={edition.storyUrl}>Read the full story on dailymattr</ExternalLink>
    </section>
  )
}
