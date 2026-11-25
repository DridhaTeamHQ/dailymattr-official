"use client"

import Image from "next/image"
import { Volume2, VolumeX } from "lucide-react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import { SiteVideo } from "@/components/shared/site-video"
import type { StoryCover } from "@/components/stories/covers"
import { cn } from "@/lib/utils"
import type { VideoAsset } from "@/lib/videos"

/**
 * The ring: the Qix stories (set in the CMS), repeated in whole rounds until there are at least
 * sixteen cards. Nine show at a time, so a ring of eight would put one cover in two places;
 * with sixteen the only repeat is the far L4/R4 pair, both turned nearly edge-on. The third
 * story starts in the centre, where Figma has its green featured placeholder.
 */
const MIN_RING = 16
const START = 2

function ringOf(covers: StoryCover[]) {
  const ring: StoryCover[] = []
  while (ring.length < MIN_RING) ring.push(...covers)
  return ring
}

/**
 * Where a card sits by its distance from the centre, in Figma px on the 1920×760 stage:
 * [centre offset, width, translateZ, rotateY]. 0–4 are Figma's centre, L1…L4 (9278:977,
 * 9278:973, 9278:969, 9278:965; mirrored on the right). Each step pulls the card towards the
 * viewer and turns it nearer edge-on, so the row bends like the inside of a cylinder. 5 is
 * past the viewer's shoulder: a card leaving turns its back (backface hidden) and fades out.
 */
const SLOTS = [
  [0, 173, 0, 0],
  [175, 170, 51.749, 23.084],
  [303.5, 173, 192.536, 53.793],
  [342.5, 155, 388.388, 83.385],
  [351, 156, 562, 89.265],
  [356, 156, 660, 96],
] as const

/** Every card is the featured card's 173×250 box, centred on the stage, then moved into its slot. */
const BOX_W = 173

const wrap = (i: number, count: number) => ((i % count) + count) % count

/** Card i's signed distance from the centre for a ring offset, in [-count/2, count/2). */
function slotOf(i: number, offset: number, count: number) {
  const d = wrap(i - START - offset, count)
  return d >= count / 2 ? d - count : d
}

/** Figma's 3D transform for a slot, interpolated between neighbours while cards move. */
function slotTransform(p: number) {
  const a = Math.min(Math.abs(p), 5)
  const k = Math.min(Math.floor(a), 4)
  const t = a - k
  const lo = SLOTS[k]
  const hi = SLOTS[k + 1]
  const x = lo[0] + (hi[0] - lo[0]) * t
  const w = lo[1] + (hi[1] - lo[1]) * t
  const z = lo[2] + (hi[2] - lo[2]) * t
  const r = lo[3] + (hi[3] - lo[3]) * t
  const side = p < 0 ? -1 : 1
  return `translateX(${(side * x) / 16}em) translateZ(${z / 16}em) rotateY(${-side * r}deg) scaleX(${w / BOX_W})`
}

/** Slow glide between cards; no overshoot, so a card never swings past the centre. */
const GLIDE = { type: "spring", visualDuration: 0.8, bounce: 0 } as const
/** Long enough to catch a few seconds of the centre card's video before the next one. */
const AUTOPLAY_MS = 4500
/** After the visitor drags, clicks or uses the keys, wait this long before drifting again. */
const RESUME_MS = 6000
/** The centre card starts its video once it has held still this long (not mid-fling). */
const SETTLE_MS = 350
/** Covers are cropped from 9:16 to the 173×250 card; keep their brand titles in view. */
const FOCUS = "50% 30%"

type Drag = { id: number; x0: number; from: number; perCard: number; x: number; t: number; v: number; active: boolean }

/**
 * Figma 9278:964: a 1920×760 stage with an 803px perspective, 240px down the hero, under a
 * glow of the centred thumbnail blurred (9278:961, which spans the whole hero). The stage
 * stays centred, so narrower screens crop the outer cards.
 *
 * The cards are the home page's story covers and travel round the arc: it drifts one card
 * every few seconds, and can be dragged or swiped either way, stepped with the arrow keys,
 * or a card clicked into the centre. The centre card plays its story muted; clicking it
 * turns the sound on (and holds the arc still) or off.
 *
 * Below lg it sits under the copy in a shorter box, sized from the screen width so about
 * 800 design px (the centre five cards) span a phone, and 1024 (seven cards) a tablet.
 */
export function QixHeroArc({ covers }: { covers: StoryCover[] }) {
  const ring = useMemo(() => ringOf(covers), [covers])
  const count = ring.length
  const offset = useMotionValue(0)
  const [center, setCenter] = useState(START)
  const [playingCard, setPlayingCard] = useState(START)
  // The card whose sound was turned on; moving another card into the centre mutes it
  const [soundCard, setSoundCard] = useState<number | null>(null)
  const sound = soundCard === center
  const reduceMotion = useReducedMotion()

  const ref = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  const anim = useRef<AnimationPlaybackControls | null>(null)
  const target = useRef(0)
  const drag = useRef<Drag | null>(null)
  const dragged = useRef(false)
  const hold = useRef({ hover: false, focus: false, drag: false, sound: false, until: 0 })

  useMotionValueEvent(offset, "change", (v) => setCenter(wrap(START + Math.round(v), count)))

  // A new card in the centre starts its video once it settles
  useEffect(() => {
    const id = window.setTimeout(() => setPlayingCard(center), SETTLE_MS)
    return () => window.clearTimeout(id)
  }, [center])

  useEffect(() => {
    hold.current.sound = sound
  }, [sound])

  // Leaving the page (Next keeps it mounted, hidden) turns the sound back off, so coming back
  // finds the arc muted and moving again.
  useLayoutEffect(() => () => setSoundCard(null), [])

  const glide = useCallback(
    (to: number, velocity = 0) => {
      target.current = to
      anim.current?.stop()
      if (reduceMotion) {
        anim.current = null
        offset.set(to)
      } else {
        anim.current = animate(offset, to, { ...GLIDE, velocity })
      }
    },
    [offset, reduceMotion],
  )

  const step = useCallback((dir: 1 | -1) => glide(Math.round(target.current) + dir), [glide])

  const pause = () => {
    hold.current.until = Date.now() + RESUME_MS
  }

  const toggleSound = () => setSoundCard((card) => (card === center ? null : center))

  // Drift while on screen, unless the visitor is hovering, dragging, listening or using the keys
  useEffect(() => {
    if (!inView || reduceMotion) return
    const id = window.setInterval(() => {
      const h = hold.current
      if (h.hover || h.focus || h.drag || h.sound || Date.now() < h.until || document.hidden) return
      step(1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [inView, reduceMotion, step])

  useEffect(() => () => anim.current?.stop(), [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0 || !stageRef.current) return
    // One card's spacing at the centre (175 design px), so the centre card tracks the pointer
    const unit = parseFloat(getComputedStyle(stageRef.current).fontSize)
    drag.current = { id: e.pointerId, x0: e.clientX, from: 0, perCard: (175 * unit) / 16, x: e.clientX, t: e.timeStamp, v: 0, active: false }
    dragged.current = false
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    if (!d.active) {
      // A few px of slack, so a click on a card still counts as a click
      if (Math.abs(e.clientX - d.x0) < 6) return
      d.active = true
      dragged.current = true
      hold.current.drag = true
      anim.current?.stop()
      d.from = offset.get()
      d.x0 = e.clientX
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const dt = e.timeStamp - d.t
    if (dt > 0) d.v = 0.7 * ((e.clientX - d.x) / dt) + 0.3 * d.v
    d.x = e.clientX
    d.t = e.timeStamp
    offset.set(d.from - (e.clientX - d.x0) / d.perCard)
  }

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    if (!d.active) return
    hold.current.drag = false
    pause()
    // Fling: carry on for a fifth of a second at the release speed, then settle on a card
    const velocity = e.timeStamp - d.t < 80 ? (-d.v * 1000) / d.perCard : 0
    const fling = Math.max(-3, Math.min(3, velocity * 0.2))
    glide(Math.round(offset.get() + fling), velocity)
  }

  const select = (i: number) => {
    if (dragged.current) return
    pause()
    if (i === center) return toggleSound()
    const now = offset.get()
    glide(Math.round(now + slotOf(i, now, count)))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      return toggleSound()
    }
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    pause()
    step(e.key === "ArrowRight" ? 1 : -1)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label="Qix stories"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hold.current.hover = true
      }}
      onPointerLeave={() => {
        hold.current.hover = false
      }}
      onFocus={(e) => {
        hold.current.focus = e.currentTarget.matches(":focus-visible")
      }}
      onBlur={() => {
        hold.current.focus = false
      }}
      className="group relative mt-4 h-[26em] cursor-grab touch-pan-y outline-none select-none text-[length:min(1rem,calc(100vw_/_50))] active:cursor-grabbing md:text-[length:min(1rem,calc(100vw_/_64))] lg:absolute lg:inset-x-0 lg:top-[15em] lg:mt-0 lg:h-[47.5em] lg:text-[length:1em]"
    >
      <p className="sr-only">
        {ring[center % count]?.alt}. Drag, or use the left and right arrow keys, to move through the stories;
        press Enter to turn the sound {sound ? "off" : "on"}.
      </p>

      <div
        ref={stageRef}
        className="absolute top-1/2 left-1/2 h-[47.5em] w-[120em] -translate-x-1/2 -translate-y-1/2 perspective-[50.1875em]"
      >
        {covers.map((cover, i) => (
          <Glow key={cover.id} cover={cover} shown={center % covers.length === i} />
        ))}

        {ring.map((cover, i) => (
          <Card
            key={`${cover.id}-${i}`}
            cover={cover}
            index={i}
            count={count}
            offset={offset}
            isCenter={center === i}
            playing={playingCard === i && center === i}
            sound={sound && center === i}
            onSelect={select}
            onSoundBlocked={() => setSoundCard(null)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * The centred cover blurred behind the arc, cross-fading as cards change. Drawn as Figma's
 * glow (9278:961): the thumbnail as a 640×440 pill blurred 80px at 20%, and a floor light
 * blurred 50px at 10%. Heavily blurred, so a tiny copy of the cover is enough.
 */
function Glow({ cover, shown }: { cover: StoryCover; shown: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
        shown ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute top-[8.75em] left-[40em] h-[27.5em] w-[40em] overflow-hidden rounded-full opacity-20 blur-[5em]">
        <Image src={cover.src} alt="" fill sizes="64px" draggable={false} className="object-cover" />
      </div>
      <div className="absolute top-[30.625em] left-[41.25em] h-[6.25em] w-[37.5em] overflow-hidden rounded-[50%] opacity-10 blur-[3.125em]">
        <Image src={cover.src} alt="" fill sizes="64px" draggable={false} className="object-cover" />
      </div>
    </div>
  )
}

function Card({
  cover,
  index,
  count,
  offset,
  isCenter,
  playing,
  sound,
  onSelect,
  onSoundBlocked,
}: {
  cover: StoryCover
  index: number
  count: number
  offset: MotionValue<number>
  isCenter: boolean
  /** Settled in the centre: mount and play its video. */
  playing: boolean
  sound: boolean
  onSelect: (i: number) => void
  onSoundBlocked: () => void
}) {
  const transform = useTransform(() => slotTransform(slotOf(index, offset.get(), count)))
  // Fully shown out to L4/R4, then fades as it turns away
  const opacity = useTransform(() => Math.min(1, Math.max(0, (4.5 - Math.abs(slotOf(index, offset.get(), count))) / 0.5)))
  // Nearer the centre paints on top, as in Figma's layer order
  const zIndex = useTransform(() => Math.round(100 - Math.abs(slotOf(index, offset.get(), count)) * 10))
  const pointerEvents = useTransform(() => (Math.abs(slotOf(index, offset.get(), count)) > 4.5 ? "none" : "auto"))

  return (
    <motion.div
      aria-hidden
      data-center={isCenter || undefined}
      onClick={() => onSelect(index)}
      className="absolute top-[15.9375em] left-[54.59375em] h-[15.625em] w-[10.8125em] overflow-hidden rounded-[1em] bg-[#1c1c1e] outline-offset-[0.375em] backface-hidden group-focus-visible:data-center:outline-2 group-focus-visible:data-center:outline-white"
      style={{ transform, opacity, zIndex, pointerEvents }}
    >
      <Image
        src={cover.src}
        alt=""
        fill
        preload={index === START}
        // On the first screen: don't wait for lazy loading, which can't see past 3D transforms
        loading="eager"
        sizes="(min-width: 64rem) 22rem, 12rem"
        draggable={false}
        className="object-cover"
        style={{ objectPosition: FOCUS }}
      />

      {playing && cover.video && <CardVideo video={cover.video} sound={sound} onSoundBlocked={onSoundBlocked} />}

      {/* Figma's 1px white/12 card edge, drawn inside over the picture */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />
    </motion.div>
  )
}

/** The centre card's story, faded in over its cover once it is actually playing. */
function CardVideo({
  video,
  sound,
  onSoundBlocked,
}: {
  video: VideoAsset
  sound: boolean
  onSoundBlocked: () => void
}) {
  const [ready, setReady] = useState(false)

  return (
    <>
      <SiteVideo
        video={video}
        priority
        // Turned on by a click or key press, which browsers accept; if one still refuses,
        // the card drops back to muted and its icon says so
        sound={sound}
        onSoundBlocked={onSoundBlocked}
        onPlaying={() => setReady(true)}
        draggable={false}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          ready ? "opacity-100" : "opacity-0",
        )}
        style={{ objectPosition: FOCUS }}
      />
      {ready && (
        <span className="pointer-events-none absolute right-[0.5em] bottom-[0.5em] grid size-[1.75em] place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
          {sound ? <Volume2 className="size-[0.875em]" /> : <VolumeX className="size-[0.875em]" />}
        </span>
      )}
    </>
  )
}
