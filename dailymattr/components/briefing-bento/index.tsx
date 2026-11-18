import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import appScreens from "@/public/home/bento/app-screens.png"
import phoneInHand from "@/public/home/bento/phone-in-hand.png"
import readingOnPhone from "@/public/home/bento/reading-on-phone.png"
import surprisedReader from "@/public/home/bento/surprised-reader.png"

// Figma 9157:428: black panel (radius 16), heading, then a 1824 × 873 bento of three rows,
// row gap 12, column gap 16. Each row is two 754.5-wide tiles and one 283 square:
//   100 · app screens · 3 ways in  /  1 app · human judgement · reading  /  curiosity · reader · a place to stop
//
// From md the bento is a size container and every length inside it is in cqw of the 1824
// frame (72px = 72 / 1824 = 3.947cqw), so text, padding and crops keep the Figma proportions
// at any width. Small text has a rem floor so it stays readable on laptops.
//
// Desktop: the bento spans the full panel width, 60px in from each side.

const tile = "relative overflow-hidden rounded-[1rem] bg-[#121212]"

// Type, as cqw of the 1824 bento (md+), with phone sizes before the md: prefix.
const bold72 = "text-5xl font-bold leading-[1.056] tracking-[-0.0278em] md:text-[3.947cqw] md:whitespace-nowrap"
const bold120 = "text-7xl font-bold leading-[0.917] tracking-[-0.0333em] md:text-[6.579cqw] md:whitespace-nowrap"
const medium32 = "text-2xl font-medium leading-none tracking-[-0.019em] md:text-[max(1.25rem,1.754cqw)] md:whitespace-nowrap"
const regular21 = "text-lg leading-[1.286] md:text-[max(1rem,1.151cqw)]"
const medium21 = "text-lg font-medium leading-[1.238] md:text-[max(1rem,1.151cqw)]"
const medium18 = "text-base font-medium leading-[1.444] md:text-[max(0.9375rem,0.987cqw)]"
const regular14 = "text-sm leading-[1.43] text-[#8a8a8e] md:text-[max(0.8125rem,0.768cqw)]"

/** A Figma image placed with its own crop: `frame` is the image box as % of the tile. */
function TileImage({ src, frame, sizes }: { src: StaticImageData; frame?: string; sizes: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", frame ?? "inset-0")}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  )
}

// Tile sizes for next/image: wide tiles are ~41% of the bento, squares ~16%.
const WIDE = "(min-width: 768px) 42vw, 100vw"
const SQUARE = "(min-width: 768px) 16vw, 50vw"

/** Phone-in-hand photo tile with a headline and a short grey line, vertically centred, 64px in. */
function PhotoLabelTile({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className={cn(tile, "flex min-h-[13rem] flex-col justify-center p-6 md:min-h-0 md:px-[3.509cqw] md:py-0")}>
      <TileImage src={phoneInHand} sizes={WIDE} />
      <div className="relative">
        <p className={cn(medium32, "text-white")}>{title}</p>
        <p className={cn(regular14, "mt-3.5 max-w-[13.125rem] md:mt-[0.768cqw] md:max-w-[11.513cqw]")}>{body}</p>
      </div>
    </div>
  )
}

/** Plain colour tile with a big headline and a line underneath, at the bottom left. */
function StatTile({
  className,
  title,
  titleClassName,
  body,
  bodyClassName,
  image,
}: {
  className: string
  title: string
  titleClassName: string
  body: string
  bodyClassName: string
  /** Optional full-tile photo behind the text. */
  image?: StaticImageData
}) {
  return (
    <div className={cn(tile, "flex min-h-[13rem] flex-col justify-end p-6 md:min-h-0 md:p-[1.316cqw]", className)}>
      {image && <TileImage src={image} sizes={WIDE} />}
      <p className={cn("relative text-white", titleClassName)}>{title}</p>
      <p className={cn("relative text-white", bodyClassName)}>{body}</p>
    </div>
  )
}

// Phones: one column, squares as 16:10 bands. From md: the three Figma columns.
const row = "grid grid-cols-1 gap-3 md:gap-x-[0.877cqw]"
const square = "aspect-[16/10] md:aspect-square"

export function BriefingBentoSection() {
  return (
    <section className="w-full py-8 lg:py-12">
      {/* The black panel runs edge to edge with rounded corners; the bento fills it, 60px in from each side. */}
      <div className="w-full bg-black px-4 pt-16 pb-12 sm:px-6 lg:rounded-[1rem] lg:px-[60px] lg:py-10">
        <SectionHeading
          inverted
          className="mx-auto"
          eyebrow="Less to sift through. More to take away."
          title={
            <>
              A daily briefing
              <br />
              with a clear purpose.
            </>
          }
        />

        <FadeIn className="@container mx-auto mt-12 flex w-full flex-col gap-3 md:gap-[0.658cqw] lg:mt-10">
          {/* 100 · app screens · 3 ways in */}
          <div className={cn(row, "md:grid-cols-[754.5fr_283fr_754.5fr]")}>
            <div className={cn(tile, "flex min-h-[13rem] flex-col justify-center p-6 md:min-h-0 md:px-[3.509cqw] md:py-0")}>
              {/* Figma crop: image 100% × 149.89% of the tile, 19.63% above its top edge. */}
              <TileImage src={phoneInHand} frame="inset-x-0 top-[-19.63%] h-[149.89%]" sizes={WIDE} />
              <div className="relative flex flex-col gap-2 text-white md:gap-[0.439cqw]">
                <p className={cn(bold72, "leading-none")}>100</p>
                <p className={cn(regular21, "md:w-[13.761cqw]")}>
                  Stories selected for
                  <br />
                  your daily catch-up.
                </p>
              </div>
            </div>
            <div className={cn(tile, square, "bg-white")}>
              <TileImage src={appScreens} frame="top-[-7%] left-[-19.29%] h-[127.37%] w-[138%]" sizes={SQUARE} />
            </div>
            <StatTile
              className="bg-[#121212]"
              image={phoneInHand}
              title="3 ways in"
              titleClassName={bold72}
              body="Read, watch or listen."
              bodyClassName={cn(medium21, "mt-3 md:mt-[0.658cqw]")}
            />
          </div>

          {/* 1 app · human judgement · reading */}
          <div className={cn(row, "md:grid-cols-[754.5fr_754.5fr_283fr]")}>
            <StatTile
              className="bg-[#2a2b30]"
              title="1 app"
              titleClassName={bold120}
              body="Updates and deeper explainers."
              bodyClassName={cn(medium21, "mt-4 md:mt-[0.877cqw]")}
            />
            <PhotoLabelTile
              title="Human judgement"
              body={
                <>
                  Selected, reviewed and
                  <br />
                  approved by editors.
                </>
              }
            />
            <div className={cn(tile, square, "bg-[#2a2b30]")}>
              <TileImage src={readingOnPhone} sizes={SQUARE} />
            </div>
          </div>

          {/* curiosity · reader · a place to stop */}
          <div className={cn(row, "md:grid-cols-[754.5fr_283fr_754.5fr]")}>
            <PhotoLabelTile title="Room for curiosity" body="Follow a quick update into a bigger idea." />
            <div className={cn(tile, square, "bg-[#2a2b30]")}>
              <TileImage src={surprisedReader} frame="inset-x-0 top-[6.63%] h-[145.35%]" sizes={SQUARE} />
            </div>
            <StatTile
              className="bg-[#010028]"
              title="A place to stop"
              titleClassName={bold72}
              body="Finish your daily briefing and get back to your day."
              bodyClassName={cn(medium18, "mt-3 md:mt-[0.658cqw]")}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
