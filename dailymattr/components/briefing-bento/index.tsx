import Image from "next/image"

import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/fade-in"
import { dummyImage } from "@/lib/dummy-media"

// Figma 8625:465: black panel (radius 16, padding 104 / 88), heading, then three 283px rows
// of a 1197px bento, gap 12. Rows alternate small · small · wide and wide · small · small.
// Columns are fr-based so the 283 : 283 : 607 proportions hold as the panel narrows.

const cell = "relative overflow-hidden rounded-[1rem] p-6"

/** Centered stat or label on a #121212 tile. */
function TextCell({ title, body, big }: { title: string; body: string; big?: boolean }) {
  return (
    <div className={cn(cell, "flex aspect-square flex-col items-center justify-center bg-[#121212] text-center")}>
      <p
        className={cn(
          "text-white",
          big
            ? "text-5xl leading-none font-bold tracking-[-0.125rem] lg:text-7xl"
            : "text-xl leading-tight font-medium tracking-[-0.0375rem] lg:text-2xl lg:leading-7.5"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "max-w-[13.125rem] text-sm leading-5",
          big ? "mt-4 max-w-[11.25rem] text-[#9a9a9e]" : "mt-3.5 text-[#8a8a8e]"
        )}
      >
        {body}
      </p>
    </div>
  )
}

/** Wide tile: big headline sitting at the bottom left, supporting line underneath. */
function WideCell({
  title,
  body,
  className,
  titleClassName,
  bodyClassName,
}: {
  title: string
  body: string
  className: string
  titleClassName: string
  bodyClassName: string
}) {
  return (
    <div className={cn(cell, "@container col-span-2 flex min-h-[13.75rem] flex-col justify-end md:col-span-1", className)}>
      <p className={cn("text-white", titleClassName)}>{title}</p>
      <p className={cn("text-base leading-6.5 font-medium lg:text-lg", bodyClassName)}>{body}</p>
    </div>
  )
}

/** Image tile (#2a2b30 placeholder in Figma). */
function ImageCell({ src }: { src: string }) {
  return (
    <div className={cn(cell, "aspect-square bg-[#2a2b30] p-0")}>
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 283px, 50vw" className="object-cover" />
    </div>
  )
}

// Desktop: sized to the tile (text-tile, see globals.css) so it matches Figma at any width.
const bold72 = "text-5xl leading-none font-bold tracking-[-0.125rem] lg:text-tile lg:whitespace-nowrap"

export function BriefingBentoSection() {
  return (
    // The black band runs edge to edge; the heading and bento stay centred inside it.
    <section className="w-full py-8 lg:py-12">
      <div className="w-full bg-black px-4 pt-16 pb-12 sm:px-6 lg:pt-16 lg:pb-[5.5rem]">
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

        {/* Figma: 1197px of the 1920px frame. On desktop it follows the screen width (62.5%, the
            shared content column) so a laptop gets the same proportions as the frame. */}
        <FadeIn className={cn("mt-12 flex max-w-[74.8125rem] flex-col gap-3 lg:mt-24", CONTENT_WIDTH, "lg:max-w-[74.8125rem]")}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-[283fr_283fr_607fr]">
            <TextCell big title="100" body="Stories selected for your daily catch-up." />
            <ImageCell src={dummyImage(400, 600, 600)} />
            <WideCell
              className="bg-[#121212]"
              title="3 ways in"
              titleClassName={bold72}
              body="Read, watch or listen."
              bodyClassName="mt-3 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-[607fr_283fr_283fr]">
            <WideCell
              className="bg-[#3979ff]"
              title="1 app"
              titleClassName="text-7xl leading-none font-normal tracking-[-0.1875rem] lg:text-tile-xl lg:tracking-[-0.25rem] lg:whitespace-nowrap"
              body="Your updates and deeper explainers, together."
              bodyClassName="mt-4 text-white"
            />
            <TextCell title="Human judgement" body="Editors choose, review and approve what gets published." />
            <ImageCell src={dummyImage(410, 600, 600)} />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-[283fr_283fr_607fr]">
            <TextCell title="Room for curiosity" body="Follow a quick update into a bigger idea." />
            <ImageCell src={dummyImage(420, 600, 600)} />
            <WideCell
              className="bg-[#a7f1b5]"
              title="A place to stop"
              titleClassName={cn(bold72, "text-[#1f6b33]")}
              body="Finish your daily briefing and get back to your day."
              bodyClassName="mt-3 text-[#0b2a14]"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
