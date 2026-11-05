import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import type { LearnFormat } from "./content"
import { FeatureItem } from "./feature-item"
import { FormatCta, FormatTag, FormatTitle } from "./format-intro"

// Sizes from the Figma frame (1920 wide): shared 1200px column (same edges as the app
// preview media); split card 1200 × 720 as two 588px columns with a 24px gap.

function Media({ format, className }: { format: LearnFormat; className?: string }) {
  // Placeholder — replace with <Image fill /> or <video> when assets are ready.
  return <div className={cn("rounded-2xl", format.mediaClassName, className)} />
}

function SplitCard({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <article
      className={cn(CONTENT_WIDTH, "grid gap-6 bg-background md:grid-cols-2 lg:h-[720px]", className)}
    >
      <div className="flex flex-col">
        <FormatTag>{format.tag}</FormatTag>
        <div className="mt-4">
          <FormatTitle format={format} />
        </div>
        <p className="mt-4 max-w-sm text-base text-muted-foreground">{format.description}</p>
        <div className="mt-8 flex flex-col gap-1 md:mt-auto">
          {format.features.map((f, i) => (
            <FeatureItem key={f.title} feature={f} highlighted={i === 0} />
          ))}
        </div>
        <div className="mt-6">
          <FormatCta format={format} />
        </div>
      </div>
      <Media format={format} className="min-h-80 md:min-h-0" />
    </article>
  )
}

function WideCard({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <article className={cn(CONTENT_WIDTH, "flex flex-col gap-6 bg-background", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <FormatTag>{format.tag}</FormatTag>
          <div className="mt-4">
            <FormatTitle format={format} />
          </div>
          <p className="mt-4 text-base text-muted-foreground">{format.description}</p>
        </div>
        <FormatCta format={format} />
      </div>
      {/* 440px tall, but allowed to shrink when the pinned stage is shorter */}
      <Media format={format} className="h-[440px] min-h-56 shrink" />
      <div className="grid gap-1 sm:grid-cols-3 sm:gap-6">
        {format.features.map((f, i) => (
          <FeatureItem key={f.title} feature={f} highlighted={i === 0} />
        ))}
      </div>
    </article>
  )
}

export function FormatCard({ format, className }: { format: LearnFormat; className?: string }) {
  return format.layout === "split" ? (
    <SplitCard format={format} className={className} />
  ) : (
    <WideCard format={format} className={className} />
  )
}
