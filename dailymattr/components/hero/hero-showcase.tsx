import { AspectRatio } from "@/components/ui/aspect-ratio"
import { BriefingCard } from "./briefing-card"

// Placeholder area — swap the inner div for an <Image fill /> when the visuals are ready.
export function HeroShowcase({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <AspectRatio ratio={2 / 1} className="overflow-hidden rounded-sm bg-placeholder">
        {children}
      </AspectRatio>
      <BriefingCard className="absolute top-[14%] -right-3 hidden sm:flex lg:-right-6" />
    </div>
  )
}
