"use client"

import { createContext, useContext, useLayoutEffect, useRef, useSyncExternalStore } from "react"
import {
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Scroll-driven bento reveal (tablet and desktop), after the reference video: the "100" tile
 * starts as large as fits on screen (START_GUTTER), then the whole bento zooms out around
 * it while it is pinned, so the hero shrinks into its slot; the other tiles slide in from
 * outside and fade up one by one.
 * Scrolling back plays it in reverse. Only transform and opacity change, and will-change is
 * set only while it moves, so each layer is re-rasterised sharp once it settles.
 *
 * On phones (below md), and for reduced motion, nothing is pinned or animated: the plain
 * stacked bento shows.
 */

/** Tile area of the Figma bento (9212:9241 less its 19.14 inset), in Figma px. */
const BENTO = { w: 1799.22, h: 995.31 }
/** The "100" tile. Its centre is the centre of the bento, so the zoom needs no offset. */
const HERO = { x: 451.72, y: 252.66, w: 895.781, h: 490 }
const HERO_CX = HERO.x + HERO.w / 2
const HERO_CY = HERO.y + HERO.h / 2

// The track is 100vh (the pinned stage) + 170vh of scroll; see the h-[270vh] class below.
// The reveal runs over the middle of that scroll, holding a moment at each end.
const START = 0.05
const END = 0.95
/** Scroll progress for a point on the reveal's own 0–1 timeline. */
const progressAt = (t: number) => START + t * (END - START)

// How far the hero has shrunk (0 = its starting size, 1 = in its slot), measured frame by
// frame from the video. It takes the first 81.5% of the reveal: a quick, almost linear zoom
// out, then a long soft landing.
const SHRINK_SPAN = 0.815
const SHRINK_AT = [0, 0.09, 0.18, 0.27, 0.32, 0.36, 0.45, 0.55, 0.73, 1].map((t) => progressAt(t * SHRINK_SPAN))
const SHRINK = [0, 0.21, 0.42, 0.69, 0.82, 0.88, 0.93, 0.96, 0.98, 1]

/** Each tile's slide and fade, as a share of the reveal (about 0.35s of the video's 2.7s). */
const TILE_SPAN = 0.14
/** Extra outward start offset for each tile, as a share of its distance from the hero. */
const TILE_PUSH = 0.18
/** The hero starts as large as fits with at least this much (px) screen around it: 32px from
 *  the left and right edges, its height following its aspect ratio, unless the screen is too
 *  short for that (wide desktops), where the height limits it to 32px above and below. */
const START_GUTTER = 32
const slideEase = cubicBezier(0.22, 1, 0.36, 1)

const DESKTOP = "(min-width: 48rem)"
function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const isDesktop = () => window.matchMedia(DESKTOP).matches

type Reveal = { progress: MotionValue<number>; on: boolean }
const RevealContext = createContext<Reveal | null>(null)

/**
 * The pinned stage and the zooming grid. `className` is the grid's own layout; the bento's
 * tiles go in as children, each wrapped in a RevealTile (the hero is not).
 */
export function BentoReveal({ className, children }: { className: string; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)

  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop, () => false)
  const reduceMotion = useReducedMotion()
  const on = desktop && !reduceMotion

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] })
  /** Grid scale that gives the hero its starting size; measured below. */
  const startScale = useMotionValue(1)
  const shrink = useTransform(scrollYProgress, SHRINK_AT, SHRINK)
  const scale = useTransform(() => startScale.get() - (startScale.get() - 1) * shrink.get())

  useLayoutEffect(() => {
    if (!on) return
    const stageEl = stage.current
    const gridEl = grid.current
    if (!stageEl || !gridEl) return
    const measure = () => {
      // offsetWidth / offsetHeight are the untransformed size, so this is stable mid-zoom.
      const heroW = (gridEl.offsetWidth * HERO.w) / BENTO.w
      const heroH = (gridEl.offsetHeight * HERO.h) / BENTO.h
      const byWidth = (stageEl.clientWidth - 2 * START_GUTTER) / heroW
      const byHeight = (stageEl.clientHeight - 2 * START_GUTTER) / heroH
      startScale.set(Math.max(1, Math.min(byWidth, byHeight)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stageEl)
    observer.observe(gridEl)
    return () => observer.disconnect()
  }, [on, startScale])

  // Promote the grid and tiles to their own layers only while the reveal is moving.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const el = track.current
    if (!el || !on) return
    const moving = p > 0 && p < END
    if (moving !== el.hasAttribute("data-animating")) el.toggleAttribute("data-animating", moving)
  })

  return (
    <RevealContext.Provider value={{ progress: scrollYProgress, on }}>
      <div ref={track} className="group/bento md:motion-safe:h-[270vh]">
        {/* Full-bleed stage: -mx cancels the panel's side padding (index.tsx: 1.5rem, 3.3rem
            from lg) so the hero can fill the screen edge to edge; the bento inside puts the
            margin back. It is sized to fit the screen height, so the finished bento is seen
            whole while pinned. */}
        <div
          ref={stage}
          className="md:motion-safe:sticky md:motion-safe:top-0 md:motion-safe:-mx-6 md:motion-safe:flex md:motion-safe:h-screen md:motion-safe:items-center md:motion-safe:overflow-hidden lg:motion-safe:-mx-[3.3rem]"
        >
          <div className="@container mx-auto w-full max-w-[32rem] md:max-w-none md:motion-safe:w-[min(100%_-_3rem,(100vh_-_5rem)*1.80771)] lg:motion-safe:w-[min(100%_-_6.6rem,(100vh_-_5rem)*1.80771)]">
            <motion.div
              ref={grid}
              className={cn(className, "group-data-[animating]/bento:will-change-transform")}
              style={on ? { scale } : undefined}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </RevealContext.Provider>
  )
}

/**
 * A tile that slides in toward the hero and fades up during the reveal. `at` is its Figma
 * position in the bento's tile area, `revealAt` when it starts on the reveal's 0–1 timeline.
 */
export function RevealTile({
  at: [x, y],
  w,
  h,
  revealAt,
  className,
  style,
  children,
}: {
  at: [number, number]
  w: number
  h: number
  revealAt: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const reveal = useContext(RevealContext)
  if (!reveal) throw new Error("RevealTile must be inside BentoReveal")

  const range = [progressAt(revealAt), progressAt(revealAt + TILE_SPAN)]
  // Start pushed away from the hero, in % of the tile's own size.
  const fromX = `${(((x + w / 2 - HERO_CX) * TILE_PUSH) / w) * 100}%`
  const fromY = `${(((y + h / 2 - HERO_CY) * TILE_PUSH) / h) * 100}%`
  const opacity = useTransform(reveal.progress, range, [0, 1])
  const tx = useTransform(reveal.progress, range, [fromX, "0%"], { ease: slideEase })
  const ty = useTransform(reveal.progress, range, [fromY, "0%"], { ease: slideEase })

  return (
    <motion.div
      className={cn(className, "group-data-[animating]/bento:will-change-[transform,opacity]")}
      style={reveal.on ? { ...style, opacity, x: tx, y: ty } : style}
    >
      {children}
    </motion.div>
  )
}
