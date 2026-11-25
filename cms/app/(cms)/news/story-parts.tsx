import Image from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

/** Photos in the Pix media bucket go through next/image (cms/next.config.ts); others as-is. */
export const isPixMedia = (url: string) =>
  url.startsWith("https://coggfnbqqyiqfsxvtaym.supabase.co/storage/v1/object/public/pix-media/")

/** "On website" (green) or "Hidden" (amber), as a small white pill over the photo. */
export function VisibilityChip({ show }: { show: boolean }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-background px-2 py-0.5 text-[0.6875rem] font-semibold shadow-xs">
      <span className={cn("size-1.5 rounded-full", show ? "bg-success" : "bg-warning")} aria-hidden />
      {show ? "On website" : "Hidden"}
    </span>
  )
}

/** A story photo filling its frame, cropped from the top like on the website. */
export function StoryPhoto({
  src,
  sizes,
  priority,
  className,
}: {
  src: string | null
  sizes: string
  priority?: boolean
  className?: string
}) {
  if (!src) {
    return (
      <span className="absolute inset-0 grid place-items-center text-muted-foreground">
        <ImageOff className="size-6" aria-hidden />
      </span>
    )
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      preload={priority}
      unoptimized={!isPixMedia(src)}
      className={cn("object-cover object-top", className)}
    />
  )
}
