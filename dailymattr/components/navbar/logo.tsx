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
        priority
        className={cn("h-6 w-auto", className)}
      />
    </Link>
  )
}
