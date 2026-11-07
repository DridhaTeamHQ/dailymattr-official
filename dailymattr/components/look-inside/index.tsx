import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"
import playIcon from "@/public/home/play.svg"

// Figma 8625:617: a 1507 × 889 #ededed panel (radius 16) with the heading centred and a
// black pill link, 40px below, that opens the app tour.
export function LookInsideSection() {
  return (
    <section className="w-full px-4 py-8 lg:pt-12 lg:pb-0">
      <div className={cn(PANEL_WIDTH, "flex aspect-[4/5] flex-col items-center justify-center rounded-[1rem] bg-[#ededed] px-4 sm:aspect-[1507/889]")}>
        <SectionHeading
          eyebrow="A look inside dailymattr"
          title={
            <>
              See how your next
              <br />
              daily habit comes together.
            </>
          }
        >
          <Link
            href="/download"
            className="inline-flex h-14 items-center gap-3 rounded-[1.75rem] bg-black py-2 pr-5 pl-2.5 text-base leading-4 font-medium tracking-[-0.0125rem] text-white transition-colors hover:bg-black/85"
          >
            <span className="flex size-10 items-center justify-center rounded-[1.25rem] bg-white">
              <Image src={playIcon} alt="" width={16} height={16} />
            </span>
            Take the app tour
          </Link>
        </SectionHeading>
      </div>
    </section>
  )
}
