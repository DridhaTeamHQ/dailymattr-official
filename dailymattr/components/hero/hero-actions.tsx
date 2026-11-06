import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import primaryLogo from "@/public/Figma_logos/Primary logo.png"

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        nativeButton={false}
        render={<Link href="/download" />}
        className="h-9 gap-2 rounded-lg pr-1.5 pl-3.5 text-[13px] font-medium"
      >
        Download
        {/* Brand logo, recoloured white for the blue button */}
        <Image
          src={primaryLogo}
          alt="dailymattr"
          loading="eager"
          className="h-[18px] w-auto brightness-0 invert"
        />
        <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
          <ArrowUpRight className="size-3" />
        </span>
      </Button>
      <Button
        variant="secondary"
        nativeButton={false}
        render={<Link href="/stories" />}
        className="h-9 gap-1.5 rounded-lg pr-2.5 pl-3.5 text-[13px] font-medium"
      >
        Explore today&rsquo;s stories
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}
