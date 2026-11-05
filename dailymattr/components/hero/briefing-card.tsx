import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function BriefingCard({ className }: { className?: string }) {
  return (
    <Card
      size="sm"
      className={cn(
        "flex-row items-center gap-6 rounded-xl px-4 py-3 shadow-md ring-foreground/5",
        className
      )}
    >
      <p className="text-xs leading-snug text-muted-foreground">
        Your daily briefing is ready.
        <br />
        100 stories. Zero noise.
      </p>
      <Button
        variant="secondary"
        size="sm"
        className="h-7 gap-1 rounded-md px-2.5 text-xs font-medium"
      >
        Read now
        <ChevronDown className="size-3" />
      </Button>
    </Card>
  )
}
