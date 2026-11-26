"use client"

import { useRef } from "react"
import { ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ACCEPT, MAX_MB } from "@/lib/media/url"

/** An image the editor picked, with a local URL for previewing it before it's uploaded. */
export type Picked = { file: File; url: string }

/** A button that opens the file picker for one image. */
export function PickImage({
  label,
  title,
  onPick,
  disabled,
  small,
}: {
  label: string
  title: string
  onPick: (picked: Picked) => void
  disabled?: boolean
  small?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={ACCEPT.image}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file || !file.type.startsWith("image/") || file.size > MAX_MB.image * 1024 * 1024) return
          onPick({ file, url: URL.createObjectURL(file) })
        }}
      />
      <Button type="button" size={small ? "xs" : "sm"} variant="outline" title={title} onClick={() => ref.current?.click()} disabled={disabled}>
        <ImagePlus data-icon="inline-start" />
        {label}
      </Button>
    </>
  )
}

// ── Video helpers (all in the browser, on the local file) ──────────────────────────────────
