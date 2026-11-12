"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { SiteVideo } from "@/components/shared/site-video"

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
function GalleryVideo({ src, playing }: { src: string; playing: boolean }) {
  return (
    <SiteVideo
      video={src}
      playing={playing}
      className={cn(
        "absolute inset-0 size-full object-cover transition-[filter] duration-500",
        !playing && "grayscale"
      )}
    />
  )
}

// power3.out — the easing React Bits' Accordion Gallery uses.
const EASE = [0.215, 0.61, 0.355, 1] as const
// Width ÷ height of the active panel: the explainer clips are 720 × 1080 (2:3).
const ACTIVE_RATIO = 720 / 1080
// Width of an inactive panel as a fraction of the active one.
const INACTIVE_SCALE = 0.4
// Tallest the panels may get, as a fraction of the window height.
const MAX_HEIGHT_VH = 0.7

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
  /** flex-grow of the active panel (others are 1) below md; from md the 2:3 sizing applies. */
  activeGrow?: number
  /** Degrees inactive panels rotate away from the active one. */
  tilt?: number
  className?: string
}) {
  const [active, setActive] = React.useState(defaultIndex)
  const reduceMotion = useReducedMotion()

  // From md up, every panel shares one height H. The active panel is 2:3 (H × ACTIVE_RATIO
  // wide) and each inactive one INACTIVE_SCALE of that, so the row fills the available width.
  // If that makes H taller than MAX_HEIGHT_VH of the window, H is capped and every panel —
  // active and inactive — shrinks with it; the row then narrows and stays centred.
  // Widths go through flex-grow (active INACTIVE_SCALE⁻¹, others 1) so open/close animates.
  const listRef = React.useRef<HTMLDivElement>(null)
  const [layout, setLayout] = React.useState<{ height: number; maxWidth: number } | null>(null)
  React.useLayoutEffect(() => {
    const list = listRef.current
    const parent = list?.parentElement
    if (!list || !parent) return
    const measure = () => {
      if (window.innerWidth < 768) return setLayout(null)
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0
      const gaps = gap * (items.length - 1)
      // The parent's width, not the list's: the list's own width is what we constrain.
      const free = parent.clientWidth - gaps
      const units = 1 + (items.length - 1) * INACTIVE_SCALE // row width in active-panel widths
      const height = Math.min(free / (ACTIVE_RATIO * units), window.innerHeight * MAX_HEIGHT_VH)
      setLayout({ height, maxWidth: height * ACTIVE_RATIO * units + gaps })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(parent)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [items.length])
  const grow = layout ? 1 / INACTIVE_SCALE : activeGrow
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
      ref={listRef}
      role="list"
      aria-label="Explainer gallery"
      style={
        layout
          ? ({ "--panel-h": `${layout.height}px`, maxWidth: layout.maxWidth } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "@container mx-auto flex w-full gap-2 lg:gap-3 perspective-[87.5rem] max-md:snap-x max-md:overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
            animate={{ flexGrow: isActive ? grow : 1 }}
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
              className="relative h-[var(--panel-h,max(18rem,33cqw))] overflow-hidden rounded-xl bg-placeholder transform-3d group-focus-visible:ring-3 group-focus-visible:ring-ring/50 max-md:h-72 max-md:transform-none!"
            >
              {item.video ? (
                <GalleryVideo src={item.video} playing={isActive} />
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
                  "absolute top-1/2 left-1/2 flex size-12 -translate-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm lg:size-14 transition-[transform,opacity] duration-300 group-hover:scale-110",
                  item.video && isActive && "opacity-0"
                )}
              >
                <Play className="size-4 fill-current" />
              </span>
            </motion.div>

            {/* Figma shows the category only; the title stays for screen readers */}
            <div className="min-w-0">
              <p className="truncate text-md leading-5 font-medium text-black">{item.category}</p>
              <p className="sr-only">{item.title}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
