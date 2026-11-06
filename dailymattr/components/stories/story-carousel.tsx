"use client"

import * as React from "react"
import Image from "next/image"
import AutoScroll from "embla-carousel-auto-scroll"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { StoryCard } from "./story-card"
import amaron from "@/public/cover-images/amaron.png"
import jetAirways from "@/public/cover-images/jet-airways.png"
import jockey from "@/public/cover-images/jockey.png"
import mrf from "@/public/cover-images/mrf.png"

// Story cover art, 9:16. Drop more files in public/cover-images and add them here — the row
// cycles through the list, so the card count below only sets how many slides it is built from.
const covers = [
  { src: amaron, alt: "Amaron — Made in India" },
  { src: jetAirways, alt: "Jet Airways — Made in India" },
  { src: jockey, alt: "Jockey — Made in India" },
  { src: mrf, alt: "MRF — Made in India" },
]

// Slide step = card width + 16px gutter (CarouselItem's pl-4), matching the basis-* classes below.
const STEP = { base: 216, sm: 256, lg: 283 }
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
      const step = window.innerWidth >= 1024 ? STEP.lg : window.innerWidth >= 640 ? STEP.sm : STEP.base
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
// dragging still works.
export function StoryCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cardCount = useCardCount(containerRef)

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
        opts={{ align: "start", loop: true, dragFree: true }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: cardCount }, (_, i) => {
            const cover = covers[i % covers.length]
            return (
              <CarouselItem key={i} className="basis-[216px] sm:basis-[256px] lg:basis-[283px]">
                <StoryCard>
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1024px) 267px, (min-width: 640px) 240px, 200px"
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
