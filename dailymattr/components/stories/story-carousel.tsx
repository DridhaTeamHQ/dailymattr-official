"use client"

import * as React from "react"
import Image from "next/image"
import AutoScroll from "embla-carousel-auto-scroll"

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { StoryCard } from "./story-card"
import { videos } from "@/lib/videos"
import amaron from "@/public/cover-images/amaron.png"
import jetAirways from "@/public/cover-images/jet-airways.png"
import jockey from "@/public/cover-images/jockey.png"
import mrf from "@/public/cover-images/mrf.png"

// Story cover art, 9:16. Drop more files in public/cover-images and add them here — the row
// cycles through the list, so the card count below only sets how many slides it is built from.
// `video` plays, with sound, when the card is hovered (see StoryCard). Stand-ins for now: the
// two clips with audio, alternating, until each story has its own video.
const covers = [
  { src: amaron, alt: "Amaron — Made in India", video: videos.curiosity1 },
  { src: jetAirways, alt: "Jet Airways — Made in India", video: videos.customerStory2 },
  { src: jockey, alt: "Jockey — Made in India", video: videos.curiosity1 },
  { src: mrf, alt: "MRF — Made in India", video: videos.customerStory2 },
]

// Slide step = card width + 16px gutter (CarouselItem's pl-4), matching the basis-* classes below.
// On desktop the card is 13.9% of the screen (Figma: 267px of 1920), so lg is computed.
const STEP = { base: 216, sm: 256 }
const LG_CARD_VW = 0.139
const MIN_CARDS = 10

// The row has to be wider than the viewport, or the slides bunch up against the left edge with
// dead space to their right (and Embla gives up on looping). Repeat the covers until they
// overflow, so the strip reads as centred — edge to edge — at any window width.
function useCardCount(ref: React.RefObject<HTMLDivElement | null>) {
  const [count, setCount] = React.useState(MIN_CARDS)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      // Card widths are in rem, which shrink on laptops (see globals.css), so scale the px steps.
      const remScale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16
      const step =
        window.innerWidth >= 1024
          ? window.innerWidth * LG_CARD_VW + 16 * remScale
          : (window.innerWidth >= 640 ? STEP.sm : STEP.base) * remScale
      // +2 keeps a card in hand on each side while the loop wraps the tail onto the head.
      const needed = Math.max(MIN_CARDS, Math.ceil(el.clientWidth / step) + 2)
      // Whole cycles only, so the seam never puts the same cover next to itself.
      setCount(Math.ceil(needed / covers.length) * covers.length)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return count
}

// Embla's loop joins the last card to the first, and AutoScroll moves the row at a constant
// speed, so it scrolls continuously with no jump. It pauses on hover and resumes on leave;
// dragging still works. On touch screens a tapped card plays its clip (one at a time) and the
// row holds still until it is tapped again.
export function StoryCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardCount = useCardCount(containerRef)
  const [api, setApi] = React.useState<CarouselApi>()
  const [tapped, setTapped] = React.useState<number | null>(null)

  React.useEffect(() => {
    const autoScroll = api?.plugins()?.autoScroll
    if (!api || !autoScroll) return
    if (tapped === null) {
      if (!autoScroll.isPlaying()) autoScroll.play()
      return
    }
    autoScroll.stop()
    // AutoScroll restarts itself once the row settles after a touch, so keep stopping it while
    // a card plays. It flags itself as playing only after emitting, hence the microtask.
    const keepStopped = () => queueMicrotask(() => autoScroll.stop())
    api.on("autoScroll:play", keepStopped)
    return () => {
      api.off("autoScroll:play", keepStopped)
    }
  }, [api, tapped])

  const plugins = React.useMemo(
    () => [
      AutoScroll({
        speed: 0.8,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
    []
  )

  return (
    <div ref={containerRef} className="w-full">
      {/* Embla measures its slides on init, so a changed count remounts it via the key rather
          than calling reInit() — one clean init, and AutoScroll starts itself. */}
      <Carousel
        key={cardCount}
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true }}
        plugins={plugins}
        // The viewport clips overflow, so pad the row (and pull the margin back) to leave room
        // for a hovered card's lift without shifting the layout.
        className="-my-8 w-full"
      >
        <CarouselContent className="py-8">
          {Array.from({ length: cardCount }, (_, i) => {
            const cover = covers[i % covers.length]
            return (
              <CarouselItem key={i} className="basis-[13.5rem] sm:basis-[16rem] lg:basis-[calc(13.9vw+1rem)]">
                <StoryCard
                  video={cover.video}
                  tapped={tapped === i}
                  onTap={() => setTapped((t) => (t === i ? null : i))}
                >
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1024px) 14vw, (min-width: 640px) 240px, 200px"
                    className="object-cover"
                  />
                </StoryCard>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
