import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import primaryLogo from "@/public/Figma_logos/Primary logo.png"

export function HeroActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        nativeButton={false}
        render={<Link href="/download" />}
        className="h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
      >
        Get
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
      {/* Phones have room for one button in the floating bar: the download. */}
      <Button
        variant="secondary"
        nativeButton={false}
        render={<Link href="/news" />}
        className="hidden h-10 gap-1.5 rounded-lg pr-3 pl-4 text-base leading-6 font-medium tracking-[-0.01rem] sm:inline-flex"
      >
        Explore today&rsquo;s stories
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}
