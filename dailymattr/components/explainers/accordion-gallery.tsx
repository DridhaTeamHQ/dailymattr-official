"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { SiteVideo } from "@/components/shared/site-video"
import type { VideoAsset } from "@/lib/videos"

export type GalleryItem = {
  id: string
  category: string
  title: string
  /** Local image path, e.g. "/explainers/money.jpg". Leave empty for the placeholder. */
  image?: string
  /** An entry from lib/videos.ts (or a URL). Plays, looped and with sound, while the panel is active. */
  video?: VideoAsset | string
}

/** Looping clip that only plays (with sound, when allowed) while its panel is the active one. */
function GalleryVideo({
  src,
  active,
  playing,
  sound,
  onSoundBlocked,
}: {
  src: VideoAsset | string
  /** The open panel: shown in colour (others are greyscale), whether or not it is playing. */
  active: boolean
  playing: boolean
  sound: boolean
  onSoundBlocked: () => void
}) {
  return (
    <SiteVideo
      video={src}
      playing={playing}
      sound={playing && sound}
      onSoundBlocked={onSoundBlocked}
      className={cn(
        "absolute inset-0 size-full object-cover transition-[filter] duration-500",
        !active && "grayscale"
      )}
    />
  )
}

// power3.out — the easing React Bits' Accordion Gallery uses.
const EASE = [0.215, 0.61, 0.355, 1] as const
// Width ÷ height of the active panel: 1920 × 1080 (16:9).
const ACTIVE_RATIO = 1920 / 1080
// Width of an inactive panel as a fraction of the active one. Kept small so the open 16:9
// panel takes most of the row and the row stays tall; the closed panels are slim strips.
const INACTIVE_SCALE = 0.09
// Tallest the panels may get, as a fraction of the window height.
const MAX_HEIGHT_VH = 0.7

/**
 * Accordion gallery adapted from React Bits (reactbits.dev/components/accordion-gallery):
 * the hovered/focused panel grows while the others tilt away in 3D and dim.
 * Below md it becomes a horizontal scroll strip.
 */
export function AccordionGallery({
  items,
  defaultIndex = null,
  activeGrow = 3,
  tilt = 8,
  className,
}: {
  items: GalleryItem[]
  /** Panel open on load; null (the default) starts with every panel closed, equal widths. */
  defaultIndex?: number | null
  /** flex-grow of the active panel (others are 1) below md; from md the 16:9 sizing applies. */
  activeGrow?: number
  /** Degrees inactive panels rotate away from the active one. */
  tilt?: number
  className?: string
}) {
  // Which panel is open; null = all closed. Hovering opens one, leaving the gallery closes it.
  const [active, setActive] = React.useState<number | null>(defaultIndex)
  // The active video plays with sound. Browsers refuse unmuted autoplay until the visitor has
  // clicked, tapped or pressed a key on the page, so until then it plays muted (`blocked`) and
  // the first such interaction anywhere turns the sound on.
  const [blocked, setBlocked] = React.useState(false)
  const soundOn = !blocked
  const onSoundBlocked = React.useCallback(() => setBlocked(true), [])
  React.useEffect(() => {
    if (!blocked) return
    const unblock = () => setBlocked(false)
    const events = ["pointerdown", "keydown", "touchstart"] as const
    events.forEach((e) => window.addEventListener(e, unblock, { capture: true }))
    return () => events.forEach((e) => window.removeEventListener(e, unblock, { capture: true }))
  }, [blocked])

  const reduceMotion = useReducedMotion()

  // Videos play only while the gallery is hovered (or keyboard-focused), and pause when the
  // pointer leaves. Touch screens cannot hover, so there the open panel simply plays.
  const [hovered, setHovered] = React.useState(false)
  const [keyboardFocused, setKeyboardFocused] = React.useState(false)
  const [canHover, setCanHover] = React.useState(true)
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover)")
    const update = () => setCanHover(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  const engaged = !canHover || hovered || keyboardFocused

  // From md up, every panel shares one height H. The active panel is 16:9 (H × ACTIVE_RATIO
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setActive(null)
      }}
      onFocus={(e) => setKeyboardFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
        setKeyboardFocused(false)
        if (canHover && !hovered) setActive(null)
      }}
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
        const rotateY = active === null || isActive ? 0 : i < active ? tilt : -tilt

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
                <GalleryVideo
                  src={item.video}
                  active={isActive}
                  playing={isActive && engaged}
                  sound={soundOn}
                  onSoundBlocked={onSoundBlocked}
                />
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
                  item.video && isActive && engaged && "opacity-0"
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
