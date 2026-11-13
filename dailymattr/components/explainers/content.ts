import type { GalleryItem } from "./accordion-gallery"
import { videos } from "@/lib/videos"

// Placeholder captions — swap in real explainers when ready.
// The panels alternate the two 16:9 clips (the open panel's shape) until each explainer has
// its own: encode it with `npm run videos`, add it to lib/videos.ts and point `video` at it.
// Seven panels, categories as in the Figma frame.
const a = videos.curiosity1
const b = videos.customerStory2

export const explainers: GalleryItem[] = [
  { id: "1", category: "Money & Markets", title: "Explainer title", video: a },
  { id: "2", category: "Technology & AI", title: "Explainer title", video: b },
  { id: "3", category: "History & Culture", title: "Explainer title", video: a },
  { id: "4", category: "Money & Markets", title: "Explainer title", video: b },
  { id: "5", category: "Business & Brands", title: "Explainer title", video: a },
  { id: "6", category: "Technology & AI", title: "Explainer title", video: b },
  { id: "7", category: "History & Culture", title: "Explainer title", video: a },
]
