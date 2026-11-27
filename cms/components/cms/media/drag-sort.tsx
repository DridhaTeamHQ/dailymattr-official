"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Drag-and-drop reordering for a grid of cards (the Qix stories and Trax episodes), with the
 * browser's own drag and drop. Spread `itemProps(i)` on each card's wrapper: drag a card and
 * drop it on another card's place to move it there. The dragged card fades, and the place it
 * would land gets a blue outline. Mouse only (browsers don't drag by touch); DragHandle gives
 * the keyboard a way to move a card too.
 */
export function useDragSort(onMove: (from: number, to: number) => void, disabled?: boolean) {
  const [from, setFrom] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const end = () => {
    setFrom(null)
    setOver(null)
  }

  const itemProps = (i: number) => ({
    draggable: !disabled,
    onDragStart: (e: React.DragEvent) => {
      setFrom(i)
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", String(i))
    },
    onDragOver: (e: React.DragEvent) => {
      if (from === null) return
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      if (over !== i) setOver(i)
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      if (from !== null && from !== i) onMove(from, i)
      end()
    },
    onDragEnd: end,
    className: cn(
      "cursor-grab rounded-xl transition-[opacity,box-shadow] active:cursor-grabbing",
      from === i && "opacity-40",
      over === i && from !== null && from !== i && "ring-2 ring-primary ring-offset-2 ring-offset-background"
    ),
  })

  return { itemProps }
}

/** Where the up / down arrows were: shows the card can be dragged, and moves it with ← →. */
export function DragHandle({
  index,
  count,
  onMove,
  label,
  disabled,
}: {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && index > 0) {
          e.preventDefault()
          onMove(index, index - 1)
        } else if ((e.key === "ArrowRight" || e.key === "ArrowDown") && index < count - 1) {
          e.preventDefault()
          onMove(index, index + 1)
        }
      }}
      className="flex h-8 items-center gap-1 rounded-full px-2 text-xs font-medium text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      aria-label={`Reorder ${label}: drag the card, or press the left and right arrow keys`}
      title="Drag to reorder"
    >
      <GripVertical className="size-4" aria-hidden />
      Drag
    </button>
  )
}
