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
        className="h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
      >
        Download
        {/* Brand logo, recoloured white for the blue button */}
        <Image
          src={primaryLogo}
          alt="dailymattr"
          loading="eager"
          className="h-[1.125rem] w-auto brightness-0 invert"
        />
        <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
          <ArrowUpRight className="size-3" />
        </span>
      </Button>
      <Button
        variant="secondary"
        nativeButton={false}
        render={<Link href="/stories" />}
        className="h-10 gap-1.5 rounded-lg pr-3 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
      >
        Explore today&rsquo;s stories
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}
