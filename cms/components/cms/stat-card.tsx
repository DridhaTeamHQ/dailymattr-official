import type { LucideIcon } from "lucide-react"

import { IconChip, type Tone } from "@/components/cms/icon-chip"
import { Card, CardContent } from "@/components/ui/card"

/** A number with its label, a pale icon top-right, and an optional line underneath. */
export function StatCard({
  label,
  value,
  icon,
  tone,
  footer,
}: {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  tone: Tone
  footer?: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          </div>
          <IconChip icon={icon} tone={tone} />
        </div>
        {footer && <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}
