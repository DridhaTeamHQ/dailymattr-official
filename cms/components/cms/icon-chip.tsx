import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** The CMS's accent colours, all shadcn theme tokens (app/globals.css). */
export type Tone = "green" | "teal" | "orange" | "slate" | "amber" | "rose"

export const toneClasses: Record<Tone, string> = {
  green: "bg-primary/10 text-primary",
  teal: "bg-info/10 text-info",
  orange: "bg-chart-1/12 text-chart-1",
  slate: "bg-chart-3/10 text-chart-3",
  amber: "bg-chart-4/25 text-warning",
  rose: "bg-destructive/10 text-destructive",
}

const sizes = {
  sm: "size-7 rounded-md [&_svg]:size-3.5",
  md: "size-9 rounded-lg [&_svg]:size-4",
  lg: "size-11 rounded-xl [&_svg]:size-5",
}

/** A pale coloured square with an icon: stat cards, section headings, folders. */
export function IconChip({
  icon: Icon,
  tone = "green",
  size = "md",
  className,
}: {
  icon: LucideIcon
  tone?: Tone
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", toneClasses[tone], sizes[size], className)}>
      <Icon aria-hidden />
    </span>
  )
}
