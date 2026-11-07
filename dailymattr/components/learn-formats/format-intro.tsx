import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { LearnFormat } from "./content"

export function FormatTag({ children }: { children: React.ReactNode }) {
  return (
    // Figma: Helvetica Neue Medium 16/16, +0.78px, uppercase, #3979ff.
    <span className="inline-flex w-fit rounded-md bg-primary/10 px-2 py-1 text-sm leading-none font-medium tracking-[0.0488rem] text-[#3979ff] uppercase lg:text-base">
      {children}
    </span>
  )
}

export function FormatTitle({ format }: { format: LearnFormat }) {
  return (
    // Figma: 40/40, -1.5px, #1c1b17.
    <h3 className="text-3xl leading-none font-medium tracking-[-0.0938rem] text-[#1c1b17] 2xl:text-display">
      {format.title[0]}
      <br />
      {format.title[1]}
    </h3>
  )
}

export function FormatCta({ format }: { format: LearnFormat }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={format.cta.href} />}
      className="h-10 w-fit gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
    >
      {format.cta.label}
      <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
        <ArrowUpRight className="size-3" />
      </span>
    </Button>
  )
}
