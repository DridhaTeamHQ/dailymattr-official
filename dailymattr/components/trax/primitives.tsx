import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"

/**
 * Soft blue + violet corner glows over a flat fill, as on every Trax media panel
 * (8595:11823, 8595:11957, 8595:12023, 8595:12344). Percent-based so it scales with the panel.
 */
export function traxGlow(base: string) {
  return [
    "radial-gradient(ellipse 45% 42% at 20% 20%, rgba(57,121,255,0.12), rgba(57,121,255,0) 70%)",
    "radial-gradient(ellipse 40% 42% at 85% 80%, rgba(142,115,240,0.1), rgba(142,115,240,0) 70%)",
    base,
  ].join(", ")
}

/** Small blue category chip ("Trax · Listen", "Topic"). Figma 8595:11809. */
export function TraxTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "w-fit rounded-[0.375rem] bg-[#eaf1ff] px-2 py-1 font-helvetica text-[0.8125rem] leading-4 font-medium tracking-[0.0488rem] whitespace-nowrap text-[#3979ff] uppercase",
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Blue pill link with the arrow chip ("Listen with Trax", "Discover Trax"). Figma 8595:11818. */
export function TraxButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-10 w-fit items-center gap-2.5 rounded-[0.8125rem] bg-[#3979ff] py-2 pr-2 pl-4 font-helvetica transition-[translate,background-color] hover:-translate-y-px hover:bg-[#2f6bf0]"
    >
      <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-white">
        {children}
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
        <Image src="/trax/arrow-up-right.svg" alt="" width={12} height={12} className="block" />
      </span>
    </Link>
  )
}

/** Eyebrow + heading pair that opens each Trax section. Figma 8595:11905. */
export function TraxSectionIntro({
  eyebrow,
  title,
  align = "center",
  className,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  align?: "center" | "start"
  className?: string
  children?: React.ReactNode
}) {
  return (
    <FadeIn
      className={cn(
        "flex flex-col gap-3 font-helvetica lg:gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <p className="text-sm leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase lg:text-md">
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-none font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]">
        {title}
      </h2>
      {children}
    </FadeIn>
  )
}

/** Row of rounded bars: blue up to `played`, grey after. Used by both waveforms. */
export function Waveform({
  bars,
  played,
  barWidth,
  className,
}: {
  bars: number[]
  played: number
  barWidth: string
  className?: string
}) {
  return (
    <div aria-hidden className={cn("flex items-center gap-[3px]", className)}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("shrink-0 rounded-[2px]", i < played ? "bg-[#3979ff]" : "bg-[#d5dae6]")}
          style={{ height: h, width: barWidth }}
        />
      ))}
    </div>
  )
}

/**
 * Progress line exported from Figma. The art overhangs its zero-height slot by the
 * frame's insets (it carries a glow), so it is positioned the same way here.
 */
export function ProgressLine({
  src,
  overhang,
  top,
  bottom,
}: {
  src: string
  /** Left overhang as a percent of the slot width. */
  overhang: string
  top: number
  bottom: number
}) {
  return (
    <div aria-hidden className="relative h-0 w-full min-w-0">
      <div className="absolute right-0" style={{ left: `-${overhang}`, top: -top, bottom: -bottom }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- stretched vector line */}
        <img src={src} alt="" className="block size-full max-w-none" />
      </div>
    </div>
  )
}
