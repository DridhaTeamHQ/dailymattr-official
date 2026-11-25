import Image from "next/image"

import { cn } from "@/lib/utils"
import wordmark from "@/public/brand/dailymattr-wordmark.png"

/**
 * The dailymattr wordmark (the website's primary logo) with a black "CMS" pill, as in the
 * header and on the sign-in screens.
 */
export function BrandMark({ size = "md", className }: { size?: "md" | "lg"; className?: string }) {
  return (
    <span className={cn("flex items-center", size === "lg" ? "gap-3" : "gap-2.5", className)}>
      <Image
        src={wordmark}
        alt="dailymattr"
        preload
        loading="eager"
        className={cn("w-auto", size === "lg" ? "h-9" : "h-6")}
      />
      <span
        className={cn(
          "rounded-full bg-foreground font-semibold tracking-[0.06em] text-background uppercase",
          size === "lg" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[0.625rem]"
        )}
      >
        CMS
      </span>
    </span>
  )
}
