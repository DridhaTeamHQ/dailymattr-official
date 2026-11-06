"use client"

import Image from "next/image"
import { useLayoutEffect, useRef, useState } from "react"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"

/**
 * The collage beside "Why Pix" (Figma 8632:2200): a cut-out photo with four floating
 * cards around it. It is drawn on a fixed 652×759 canvas taken straight from the frame and
 * scaled down as a whole to fit the available width, so the cards never drift apart.
 * Positions below are canvas coordinates (frame position minus the canvas origin).
 */
const CANVAS_W = 652
const CANVAS_H = 759

const ink = "text-[#4b2324]"

/** "New Opportunity" card, tucked behind the photo. Figma 8632:2485. */
function OpportunityCard() {
  return (
    <div className="absolute top-[88px] left-[22px] h-[190.7px] w-[180px] rounded-[20px] bg-[#d7dc38] px-4 pt-[12.7px]">
      <span className="grid size-[48.2px] place-items-center rounded-full bg-[#efe8db]">
        <Image src="/pix/float-bell.svg" alt="" width={28.1} height={28.1} className="block" />
      </span>
      <p className={cn("mt-2 text-[12px] leading-4 tracking-[-0.07px]", ink)}>New Opportunity</p>
      <p className={cn("mt-1 text-[17.4px] leading-[22.75px] font-bold tracking-[-0.2px]", ink)}>
        Brand Designer
      </p>
      <p className={cn("mt-1.5 text-[12px] leading-[17.4px]", ink)}>
        Spotify · Stockholm, SE
        <br />
        Fulltime · Hybrid
      </p>
      <span className="absolute right-[13.4px] bottom-[10.7px] grid size-[29.4px] place-items-center rounded-full bg-[#4b2324]">
        <Image src="/pix/float-arrow-light.svg" alt="" width={20.07} height={10.71} className="block" />
      </span>
    </div>
  )
}

/** "Application Update" progress card. Figma 8632:2484. */
function ApplicationUpdateCard() {
  const steps = [
    { label: "Applied", x: 17.3, dot: "bg-[#4b2324]", done: true },
    { label: "In review", x: 79.7, dot: "bg-[#d7dc38]" },
    { label: "Interview", x: 143.2, dot: "border-[1.1px] border-[#4b2324] bg-[#c4b9fb]" },
  ]
  return (
    <div className="absolute top-[213px] left-[470px] h-[124.3px] w-[180px] rounded-[16.7px] bg-[#c4b9fb]">
      <p className={cn("absolute top-[12.3px] left-[17.3px] text-[10px] leading-[13.4px]", ink)}>
        Application Update
      </p>
      <p
        className={cn(
          "absolute top-[28.4px] left-[17.3px] text-[15.6px] leading-[18.95px] font-bold tracking-[-0.28px]",
          ink,
        )}
      >
        You’re one step
        <br />
        closer 🎉
      </p>
      <span className="absolute top-[90.8px] left-[35.1px] h-[1.1px] w-[109.2px] bg-[#4b2324]" />
      {steps.map((s) => (
        <span key={s.label}>
          <span
            className={cn(
              "absolute top-[81.9px] grid size-[18.95px] place-items-center rounded-full",
              s.dot,
            )}
            style={{ left: s.x }}
          >
            {s.done && (
              <Image src="/pix/float-check.svg" alt="" width={11.15} height={11.15} className="block" />
            )}
          </span>
          <span
            className={cn(
              "absolute top-[102px] -translate-x-1/2 text-center text-[8.36px] leading-[11.15px] whitespace-nowrap",
              ink,
            )}
            style={{ left: s.x + 9.5 }}
          >
            {s.label}
          </span>
        </span>
      ))}
    </div>
  )
}

/** "Interviews this week" stat card. Figma 8632:2486. */
function InterviewsCard() {
  return (
    <div className="absolute top-[515.2px] left-[410px] h-[154.55px] w-[158.5px] rounded-[23.66px] bg-[#eee7da] pt-[26px] pl-[37px] shadow-[0px_9.46px_25.23px_0px_rgba(75,35,36,0.1),0px_1.58px_4.73px_0px_rgba(75,35,36,0.06)]">
      <p className={cn("text-[17.35px] leading-[22.87px]", ink)}>
        Interviews
        <br />
        this week
      </p>
      <p className={cn("text-[48.9px] leading-[56.77px] tracking-[-0.79px]", ink)}>2</p>
    </div>
  )
}

/** Dark "Saved for later" card. Figma 8632:2487. */
function SavedCard() {
  return (
    <div className="absolute top-[537px] left-[7px] flex h-[89px] w-[250px] items-center gap-3 rounded-[16.5px] bg-[#4b2324] pl-[15.4px]">
      <span className="grid size-[38.5px] shrink-0 place-items-center rounded-full bg-[#c4b9fb]">
        <Image src="/pix/float-bookmark.svg" alt="" width={14.29} height={17.58} className="block" />
      </span>
      <div className="flex flex-col">
        <p className="text-[7.7px] leading-[11px] text-[#efe8db]">Saved for later</p>
        <p className="text-[13.74px] leading-[17.58px] font-bold tracking-[-0.16px] text-[#f3ede2]">
          Product Designer
        </p>
        <p className="mt-[1.6px] text-[9.34px] leading-[13.19px] text-[#efe8db]">
          Airbnb · San Francisco, US
        </p>
      </div>
      <span className="absolute top-[52.75px] left-[211.5px] grid size-[24.2px] place-items-center rounded-full bg-[#d7dc38]">
        <Image src="/pix/float-arrow-dark.svg" alt="" width={16.48} height={8.79} className="block" />
      </span>
    </div>
  )
}

export function WhyPixVisual({ className }: { className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / CANVAS_W))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={frameRef} className={cn("aspect-[652/759]", className)}>
      <FadeIn className="h-full w-full">
        <div
          className="relative origin-top-left font-jakarta"
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
        >
          {/* Yellow blocks peeking out behind the photo. Figma 8636:2496. */}
          <span
            aria-hidden
            className="absolute top-[417px] left-[514px] h-[84.6px] w-[42.3px] rounded-t-[13.5px] bg-[#d7dc38]"
          />
          <span
            aria-hidden
            className="absolute top-[470.3px] left-[514px] h-[248.7px] w-[98.1px] rounded-tr-[16.9px] rounded-br-[18.6px] bg-[#d7dc38]"
          />

          <div aria-hidden>
            <OpportunityCard />
          </div>

          <Image
            src="/pix/why-woman.png"
            alt="A woman smiling in surprise at her phone"
            width={522}
            height={759}
            sizes="(min-width: 1280px) 522px, 80vw"
            className="absolute top-0 left-[38px] h-[759px] w-[522px] object-cover"
          />

          <div aria-hidden>
            <InterviewsCard />
            <ApplicationUpdateCard />
            <SavedCard />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
