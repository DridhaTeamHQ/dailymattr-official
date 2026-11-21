import Image from "next/image"

import { AnchorLink } from "@/components/shared/anchor-link"
import { cn } from "@/lib/utils"

// Figma sizes are px on a 1920 frame; written in rem (px ÷ 16) so laptops scale them down.

/** Blue uppercase chip ("Qix · Watch", topics). Figma 8646:2664: 16/16, 6×5 padding. */
export function QixTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "w-fit rounded-md bg-[#eaf1ff] px-1.5 py-[0.3125rem] text-sm leading-4 font-medium tracking-[0.0488rem] whitespace-nowrap text-[#3979ff] uppercase lg:text-base",
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Blue uppercase eyebrow above a heading. Figma 8646:2703: 18/18, −0.16px. */
export function QixEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-base leading-[1.125rem] font-medium tracking-[-0.01rem] text-[#3979ff] uppercase lg:text-lg",
        className,
      )}
    >
      {children}
    </p>
  )
}

/** 48px section heading. Figma 8646:2706: 48/48, −1.5px. */
export const QIX_H2 =
  "text-3xl leading-tight font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-12 lg:tracking-[-0.0938rem]"

/** Blue pill link with the arrow chip ("Explore Qix"); glides to same-page anchors. Figma 8646:2673. */
export function QixButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <AnchorLink
      href={href}
      className="flex h-10 w-fit items-center gap-2.5 rounded-[0.8125rem] bg-[#3979ff] py-2 pr-2 pl-4 transition-[translate,background-color] hover:-translate-y-px hover:bg-[#2f6bf0]"
    >
      <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-white">
        {children}
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
        <Image src="/shared/arrow-up-right-white.svg" alt="" width={12} height={12} className="block size-3" />
      </span>
    </AnchorLink>
  )
}

/** Grey media placeholder with the image icon and a small caps label ("Qix video", "Frame"). */
export function MediaPlaceholder({ label }: { label: string }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <Image src="/qix/image.svg" alt="" width={22} height={22} className="size-[1.375rem]" />
      <span className="text-xs leading-4 font-medium tracking-[0.025rem] text-[#9a9da5] uppercase">
        {label}
      </span>
    </span>
  )
}

/** Dark translucent play disc. Figma 8646:2689 (64px) / 8646:2835 (48px). */
export function PlayDisc({ size }: { size: "lg" | "sm" }) {
  const lg = size === "lg"
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45",
        lg ? "size-16" : "size-12",
      )}
    >
      <Image
        src={lg ? "/qix/play.svg" : "/qix/play-small.svg"}
        alt=""
        width={lg ? 21 : 16}
        height={lg ? 21 : 16}
        className={lg ? "size-[1.3125rem]" : "size-4"}
      />
    </span>
  )
}
