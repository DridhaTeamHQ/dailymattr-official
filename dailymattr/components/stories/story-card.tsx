import { AspectRatio } from "@/components/ui/aspect-ratio"

// 9:16 portrait tile, radius 24, fill #DEDEDE (--placeholder).
// Placeholder story tile — drop an <Image fill /> in as children when visuals are ready.
export function StoryCard({ children }: { children?: React.ReactNode }) {
  return (
    <AspectRatio ratio={9 / 16} className="overflow-hidden rounded-[1.5rem] bg-placeholder">
      {children}
    </AspectRatio>
  )
}
