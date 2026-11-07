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
      {/* Figma: Helvetica Neue Regular 15/20 #696969; button Medium 15/20 black */}
      <p className="text-md leading-5 text-[#696969]">
        Your daily briefing is ready.
        <br />
        100 stories. Zero noise.
      </p>
      <Button
        variant="secondary"
        size="sm"
        className="h-8 gap-1 rounded-md px-3 text-md leading-5 font-medium text-black"
      >
        Read now
        <ChevronDown className="size-3" />
      </Button>
    </Card>
  )
}
