"use client"

import { useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"

import { HeroActions } from "./hero-actions"

// How far the page scrolls (px) before the bar rises in. Back above it, the bar drops away.
const SHOW_AFTER = 80

/**
 * The hero's download / explore buttons, in a bar held at the bottom of the screen while the
 * hero video is on screen. Hidden at the top of the page; the first scroll fades it in, rising.
 * Place it last inside the video's wrapper: it sticks to the screen's bottom edge until the
 * video's own bottom edge comes up, then rests there and scrolls away with the video.
 */
export function FloatingActions() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  // Also fires on mount when the browser restores a scrolled position.
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > SHOW_AFTER))

  return (
    // Zero height, so it adds no space below the video; the bar hangs above it.
    <div className="pointer-events-none sticky bottom-[env(safe-area-inset-bottom)] z-40 h-0">
      <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 sm:bottom-8">
        {/* The fade sits on the blurred box itself: an ancestor's opacity would switch its
            backdrop blur off until the fade finished. */}
        <motion.div
          // Hidden buttons stay out of the tab order and the accessibility tree.
          inert={!visible}
          className="rounded-xl bg-background/80 p-1.5 shadow-lg ring-1 ring-foreground/10 backdrop-blur-md data-[visible=true]:pointer-events-auto"
          data-visible={visible}
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 32 }}
          transition={{ duration: visible ? 0.8 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroActions />
        </motion.div>
      </div>
    </div>
  )
}
