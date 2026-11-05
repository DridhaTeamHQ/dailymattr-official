import { cn } from "@/lib/utils"
import type { Feature } from "./content"

// Body of a feature tab — the active background comes from the TabsTrigger around it.
export function FeatureItem({ feature, className }: { feature: Feature; className?: string }) {
  const Icon = feature.icon
  return (
    <div className={cn("flex gap-3 p-4", className)}>
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <div>
        <p className="text-base font-medium text-foreground">{feature.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  )
}
