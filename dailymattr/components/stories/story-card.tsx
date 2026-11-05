import { AspectRatio } from "@/components/ui/aspect-ratio"

// Figma: 267 × 288, radius 24, fill #DEDEDE (--placeholder).
// Placeholder story tile — drop an <Image fill /> in as children when visuals are ready.
export function StoryCard({ children }: { children?: React.ReactNode }) {
  return (
    <AspectRatio ratio={267 / 288} className="overflow-hidden rounded-[24px] bg-placeholder">
      {children}
    </AspectRatio>
  )
}
