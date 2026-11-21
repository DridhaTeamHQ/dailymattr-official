"use client"

import Image from "next/image"
import { useEffect, useLayoutEffect, useRef } from "react"

import { useNavHeight } from "@/components/navbar/nav-height"
import { publishTraxHeroUnderNav, publishTraxTint } from "@/components/navbar/nav-tint"
import { cn } from "@/lib/utils"
import { heroPlayer } from "./content"
import { useActiveEpisode } from "./hero-state"

/**
 * The playing cover's colours behind the Trax hero (Figma 9278:801): the cover itself,
 * stretched over a 2400×1872 box centred on the hero and running 240px past its top and sides,
 * blurred 100px. Each part of the art tints the same part of the hero, so its colours spread
 * out from the centre card to the edges. Every cover has its own layer, and they cross-fade as
 * a new card reaches the centre, like the Qix hero's glow. Heavily blurred, so a tiny copy of
 * the cover is enough.
 *
 * It also hands the colour at the top of the cover to the navbar (components/navbar/
 * nav-tint.ts; .trax-route in globals.css), so the nav changes with it, and tells the nav when
 * the hero has scrolled up past it, so it goes back to white below the hero. The nav eases to a
 * new tint over the same 0.7s as the layers here, starting in the same frame.
 */
export function HeroWash() {
  const [active] = useActiveEpisode()
  const images = useRef<(HTMLImageElement | null)[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const navHeight = useNavHeight()

  // Tinted nav only while some of the hero is still below the nav: watch the hero against
  // the screen minus the pinned nav's strip, so this flips as its bottom edge passes under it.
  useEffect(() => {
    const hero = rootRef.current?.closest("section")
    if (!hero || !navHeight) return
    const observer = new IntersectionObserver(
      ([entry]) => publishTraxHeroUnderNav(entry.isIntersecting),
      { rootMargin: `-${navHeight}px 0px 0px 0px` },
    )
    observer.observe(hero)
    return () => {
      observer.disconnect()
      publishTraxHeroUnderNav(true)
    }
  }, [navHeight])

  // Publish the playing cover's top colour once its (tiny) image is in. A layout effect, so
  // the nav's fade starts in the same frame as this wash's.
  useLayoutEffect(() => {
    const img = images.current[active]
    if (!img) return
    const publish = () => {
      const colour = topColour(img)
      if (colour) publishTraxTint(colour)
    }
    if (img.complete && img.naturalWidth) publish()
    else img.addEventListener("load", publish, { once: true })
    return () => img.removeEventListener("load", publish)
  }, [active])

  // Leaving the page (Next keeps it mounted, hidden) hands the nav back its plain colours
  useLayoutEffect(() => () => publishTraxTint(null), [])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute top-[-15rem] left-1/2 h-[117rem] w-[150rem] -translate-x-1/2"
    >
      {heroPlayer.episodes.map((episode, i) => (
        <div
          key={episode.id}
          className={cn(
            "absolute inset-0 blur-[6.25rem] saturate-150 transition-opacity duration-700 ease-out motion-reduce:transition-none",
            i === active ? "opacity-30" : "opacity-0",
          )}
        >
          <Image
            ref={(el) => {
              images.current[i] = el
            }}
            src={episode.art}
            alt=""
            fill
            sizes="64px"
            draggable={false}
            className="object-fill"
          />
        </div>
      ))}
    </div>
  )
}

/**
 * The average colour of the top of a cover (what the hero shows just under the nav), with
 * the wash's 1.5× saturation, as an rgb() string. Null if the image can't be read.
 */
function topColour(img: HTMLImageElement) {
  const canvas = document.createElement("canvas")
  canvas.width = 8
  canvas.height = 8
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return null
  try {
    ctx.drawImage(img, 0, 0, 8, 8)
    const { data } = ctx.getImageData(0, 0, 8, 3)
    let r = 0
    let g = 0
    let b = 0
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
    }
    const n = data.length / 4
    ;[r, g, b] = [r / n, g / n, b / n]
    const grey = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const boost = (c: number) => Math.round(Math.min(255, Math.max(0, grey + (c - grey) * 1.5)))
    return `rgb(${boost(r)} ${boost(g)} ${boost(b)})`
  } catch {
    return null
  }
}
