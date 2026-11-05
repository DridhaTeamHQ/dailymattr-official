import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DownloadButton({ className }: { className?: string }) {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/download" />}
      className={cn(
        "h-8 gap-2 rounded-lg bg-foreground pr-1.5 pl-3 text-[13px] font-medium text-background hover:bg-foreground/85",
        className
      )}
    >
      Download the app
      <span className="flex size-5 items-center justify-center rounded-[5px] bg-background/15">
        <ArrowUpRight className="size-3" />
      </span>
    </Button>
  )
}
