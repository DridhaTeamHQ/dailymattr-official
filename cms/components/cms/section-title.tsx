import type { LucideIcon } from "lucide-react"

import { IconChip, type Tone } from "@/components/cms/icon-chip"
import { CardTitle } from "@/components/ui/card"

/** A card title with a small coloured icon in front. */
export function SectionTitle({
  icon,
  tone,
  children,
}: {
  icon: LucideIcon
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <CardTitle className="flex items-center gap-2.5">
      <IconChip icon={icon} tone={tone} size="sm" />
      {children}
    </CardTitle>
  )
}
