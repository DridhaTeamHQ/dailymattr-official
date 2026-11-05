import { cn } from "@/lib/utils"
import type { Feature } from "./content"

export function FeatureItem({
  feature,
  highlighted,
  className,
}: {
  feature: Feature
  highlighted?: boolean
  className?: string
}) {
  const Icon = feature.icon
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl p-4",
        highlighted && "bg-muted",
        className
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <div>
        <p className="text-base font-medium text-foreground">{feature.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  )
}
