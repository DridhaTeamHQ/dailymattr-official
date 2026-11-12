"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "cn"

import { FeaturesMenuPanel } from "./features-menu-panel"
import type { NavItem } from "./nav-config"

/** Grace period so the pointer can travel from the trigger to the panel. */
const CLOSE_DELAY = 120
/** Hover intent: the pointer has to rest on the trigger briefly before it opens. */
const OPEN_DELAY = 180

/**
 * "Features" nav entry. It opens the formats mega-menu on hover or focus and
 * never navigates on its own — the panel holds the real destinations.
 */
export function FeaturesMenu({
  item,
  className,
}: {
  item: NavItem
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const cancelOpen = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
  }

  const scheduleOpen = () => {
    cancelClose()
    if (open || openTimer.current) return
    openTimer.current = setTimeout(() => {
      openTimer.current = null
      setOpen(true)
    }, OPEN_DELAY)
  }

  const scheduleClose = () => {
    cancelOpen()
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  useEffect(
    () => () => {
      cancelClose()
      cancelOpen()
    },
    []
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <div
      className={cn("relative", className)}
      onPointerEnter={scheduleOpen}
      onPointerLeave={scheduleClose}
      onFocus={() => {
        cancelClose()
        cancelOpen()
        setOpen(true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 cursor-default items-center gap-1 rounded-[0.8125rem] px-3 py-2 text-sm whitespace-nowrap transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {item.label}
      </button>

      {/* Hover bridge: keeps the menu open across the gap below the trigger */}
      <div
        className={cn("absolute top-full left-0 h-7 w-full", open ? "block" : "hidden")}
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute top-[calc(100%+1.75rem)] left-0 z-50 origin-top-left transition-[opacity,translate,scale,visibility] motion-reduce:transition-opacity",
          open
            ? "visible translate-y-0 scale-100 opacity-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "invisible -translate-y-2 scale-[0.97] opacity-0 duration-200 ease-in"
        )}
        // The navbar lives in the root layout and survives navigation, so close
        // explicitly when any destination inside the panel is chosen.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false)
        }}
      >
        <FeaturesMenuPanel open={open} />
      </div>
    </div>
  )
}
