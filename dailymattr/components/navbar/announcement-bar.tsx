import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center bg-primary px-4 text-[13px] font-medium text-primary-foreground">
      <Sparkles className="mr-1.5 size-3.5 shrink-0" />
      <span className="truncate">Read, watch and listen to what matters today.</span>
      <Link
        href="/stories"
        className="ml-1.5 inline-flex shrink-0 items-center gap-1 font-normal text-primary-foreground/85 hover:text-primary-foreground"
      >
        Read more
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
