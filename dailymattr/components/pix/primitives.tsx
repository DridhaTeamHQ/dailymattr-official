import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"

/** Small blue category chip ("Pix · Read", "World"). Figma 8632:2148 / 8632:2273. */
export function PixTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "w-fit rounded-[0.375rem] bg-[#eaf1ff] px-2 py-1 font-helvetica text-sm leading-4 font-medium tracking-[0.0488rem] whitespace-nowrap text-[#3979ff] uppercase",
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Blue pill link with the arrow chip ("Discover Pix", "Read with Pix"). Figma 8632:2153. */
export function PixButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex h-10 w-fit items-center gap-2.5 rounded-[0.8125rem] bg-[#3979ff] py-2 pr-2 pl-4 font-helvetica transition-[translate,background-color] hover:-translate-y-px hover:bg-[#2f6bf0]"
    >
      <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-white">
        {children}
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
        <Image src="/pix/arrow-up-right.svg" alt="" width={12} height={12} className="block" />
      </span>
    </Link>
  )
}

/** Eyebrow + heading pair that opens each Pix section. Figma 8632:2165. */
export function PixSectionIntro({
  eyebrow,
  title,
  align = "center",
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  align?: "center" | "start"
  className?: string
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
    </FadeIn>
  )
}
