import Image from "next/image"

import { cn } from "@/lib/utils"

// Cells sit on the dark panel (bg-foreground), so text uses `background` as its colour.
// Every cell grows with its content; the grid only sets a minimum row height.
const cellBase = "flex flex-col overflow-hidden rounded-2xl p-5 lg:p-6"

export function BentoCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(cellBase, "bg-background/10 text-background", className)}>{children}</div>
}

/** Big number with a caption underneath, centred — e.g. "100 stories". */
export function NumberCell({ value, caption, className }: { value: string; caption: string; className?: string }) {
  return (
    <BentoCell className={cn("items-center justify-center text-center", className)}>
      <p className="text-5xl font-medium tracking-tight lg:text-6xl">{value}</p>
      <p className="mt-4 max-w-48 text-xs text-background/50">{caption}</p>
    </BentoCell>
  )
}

/** Image cell — shows the placeholder fill until `src` is provided. */
export function ImageCell({ src, alt = "", className }: { src?: string; alt?: string; className?: string }) {
  return (
    <div className={cn("relative min-h-48 overflow-hidden rounded-2xl bg-placeholder", className)}>
      {src && <Image src={src} alt={alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />}
    </div>
  )
}

/** Stat card: small label, large percentage, title and supporting line. */
export function StatCell({
  label,
  value,
  title,
  description,
  tone = "dark",
  className,
}: {
  label: string
  value: string
  title: string
  description: string
  tone?: "dark" | "success"
  className?: string
}) {
  const success = tone === "success"
  return (
    <div
      className={cn(
        cellBase,
        success ? "bg-success text-success-foreground" : "bg-background/10 text-background",
        className
      )}
    >
      <p className="text-sm font-medium">{label}</p>
      <p
        className={cn(
          "mt-2 text-5xl font-medium tracking-tight lg:text-6xl",
          success && "text-success-foreground/40"
        )}
      >
        {value}
      </p>
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className={cn("mt-auto pt-4 text-sm", success ? "text-success-foreground/50" : "text-background/50")}>
        {description}
      </p>
    </div>
  )
}

/** Wide brand cell with oversized headline text, e.g. "1 app". */
export function HighlightCell({ value, caption, className }: { value: string; caption: string; className?: string }) {
  return (
    <div className={cn(cellBase, "justify-between bg-primary text-primary-foreground", className)}>
      <p className="text-7xl font-light tracking-tight text-foreground/30 lg:text-8xl">{value}</p>
      <p className="mt-6 text-sm font-medium">{caption}</p>
    </div>
  )
}

/** Logo / partner cell: logo (or name) centred with a small caption at the bottom. */
export function LogoCell({
  name,
  logo,
  caption,
  className,
}: {
  name: string
  logo?: string
  caption: string
  className?: string
}) {
  return (
    <BentoCell className={cn("items-center justify-between text-center", className)}>
      <div className="flex flex-1 items-center justify-center">
        {logo ? (
          <Image src={logo} alt={name} width={160} height={48} className="h-10 w-auto" />
        ) : (
          <p className="text-xl font-medium tracking-wide uppercase">{name}</p>
        )}
      </div>
      <p className="mt-4 text-[10px] tracking-wider text-background/40 uppercase">{caption}</p>
    </BentoCell>
  )
}
