import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import primaryLogo from "@/public/Figma_logos/Primary logo.png"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="dailymattr home" className="inline-flex shrink-0">
      <Image
        src={primaryLogo}
        alt="dailymattr"
        // Above the fold on every page: fetch it straight away (`priority` is deprecated in Next 16).
        preload
        loading="eager"
        className={cn("h-6 w-auto", className)}
      />
    </Link>
  )
}
