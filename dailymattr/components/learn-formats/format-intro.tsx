import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { LearnFormat } from "./content"

export function FormatTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium tracking-wide text-primary uppercase">
      {children}
    </span>
  )
}

export function FormatTitle({ format }: { format: LearnFormat }) {
  return (
    <h3 className="text-3xl font-medium tracking-tight text-foreground 2xl:text-[40px] 2xl:leading-[1.1]">
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
      className="h-10 w-fit gap-2 rounded-lg pr-2 pl-4 text-sm font-medium"
    >
      {format.cta.label}
      <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
        <ArrowUpRight className="size-3" />
      </span>
    </Button>
  )
}
