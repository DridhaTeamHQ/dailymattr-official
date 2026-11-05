"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export type GalleryItem = {
  id: string
  category: string
  title: string
  /** Local image path, e.g. "/explainers/money.jpg". Leave empty for the placeholder. */
  image?: string
  /** Local video path, e.g. "/explainers/money.mp4". Plays (muted, looped) while the panel is active. */
  video?: string
}

/** Muted looping clip that only plays while its panel is the active one. */
function GalleryVideo({ src, poster, playing }: { src: string; poster?: string; playing: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = ref.current
    if (!video) return
    if (playing) video.play().catch(() => {})
    else video.pause()
  }, [playing])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn(
        "absolute inset-0 size-full object-cover transition-[filter] duration-500",
        !playing && "grayscale"
      )}
    />
  )
}

// power3.out — the easing React Bits' Accordion Gallery uses.
const EASE = [0.215, 0.61, 0.355, 1] as const

/**
 * Accordion gallery adapted from React Bits (reactbits.dev/components/accordion-gallery):
 * the hovered/focused panel grows while the others tilt away in 3D and dim.
 * Below md it becomes a horizontal scroll strip.
 */
export function AccordionGallery({
  items,
  defaultIndex = 0,
  activeGrow = 3,
  tilt = 8,
  className,
}: {
  items: GalleryItem[]
  defaultIndex?: number
  /** flex-grow of the active panel (others are 1). */
  activeGrow?: number
  /** Degrees inactive panels rotate away from the active one. */
  tilt?: number
  className?: string
}) {
  const [active, setActive] = React.useState(defaultIndex)
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE }

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + items.length) % items.length
    setActive(next)
    ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
  }

  return (
    <div
      role="list"
      aria-label="Explainer gallery"
      className={cn(
        "@container flex w-full gap-2 perspective-[1400px] max-md:snap-x max-md:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {items.map((item, i) => {
        const isActive = i === active
        const rotateY = isActive ? 0 : i < active ? tilt : -tilt

        return (
          <motion.div
            key={item.id}
            role="listitem"
            tabIndex={0}
            aria-current={isActive || undefined}
            initial={false}
            animate={{ flexGrow: isActive ? activeGrow : 1 }}
            transition={transition}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="group flex min-w-0 basis-0 flex-col gap-3 outline-none max-md:w-44 max-md:flex-none max-md:grow-0! max-md:snap-start"
          >
            <motion.div
              initial={false}
              animate={{ rotateY }}
              transition={transition}
              className="relative h-[max(288px,33cqw)] overflow-hidden rounded-xl bg-placeholder transform-3d group-focus-visible:ring-3 group-focus-visible:ring-ring/50 max-md:h-72 max-md:transform-none!"
            >
              {item.video ? (
                <GalleryVideo src={item.video} poster={item.image} playing={isActive} />
              ) : item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 30vw, 176px"
                  className={cn(
                    "object-cover transition-[filter] duration-500",
                    !isActive && "grayscale"
                  )}
                />
              )}
              {/* Dim inactive panels */}
              <div
                className={cn(
                  "absolute inset-0 bg-foreground transition-opacity duration-500",
                  isActive ? "opacity-0" : "opacity-15"
                )}
              />
              <span
                className={cn(
                  "absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-[transform,opacity] duration-300 group-hover:scale-110",
                  item.video && isActive && "opacity-0"
                )}
              >
                <Play className="size-4 fill-current" />
              </span>
            </motion.div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{item.category}</p>
              <p className="truncate text-xs text-muted-foreground">{item.title}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
