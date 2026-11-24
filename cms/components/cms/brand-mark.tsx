import { Newspaper } from "lucide-react"

import { cn } from "@/lib/utils"

/** "dailymattr CMS" with its green icon square, as in the header and sign-in screens. */
export function BrandMark({ size = "md", className }: { size?: "md" | "lg"; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
          size === "lg" ? "size-10 [&_svg]:size-5" : "size-8 [&_svg]:size-4"
        )}
      >
        <Newspaper aria-hidden />
      </span>
      <span className={cn("font-semibold tracking-tight", size === "lg" ? "text-xl" : "text-base")}>
        dailymattr <span className="text-muted-foreground">CMS</span>
      </span>
    </span>
  )
}
