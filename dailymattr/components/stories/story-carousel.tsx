"use client"

import * as React from "react"
import AutoScroll from "embla-carousel-auto-scroll"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { StoryCard } from "./story-card"

const PLACEHOLDER_COUNT = 10

// Item basis = card width + 16px gutter (CarouselItem's pl-4); 267px card on desktop.
// Embla's loop joins the last card to the first, and AutoScroll moves the row at a constant
// speed, so it scrolls continuously with no jump. It pauses on hover and resumes on leave;
// dragging still works.
export function StoryCarousel() {
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
    <Carousel opts={{ align: "start", loop: true, dragFree: true }} plugins={plugins} className="w-full">
      <CarouselContent>
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
          <CarouselItem key={i} className="basis-[216px] sm:basis-[256px] lg:basis-[283px]">
            <StoryCard />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
