import type { GalleryItem } from "./accordion-gallery"
import { dummyImage, dummyVideo } from "@/lib/dummy-media"

// Placeholder captions — swap in real explainers when ready.
// Videos: put files in public/explainers/ and add e.g. `video: "/explainers/money.mp4"` to an item
// (optionally `image` too, used as the poster frame).
// Seven panels, categories as in the Figma frame.
export const explainers: GalleryItem[] = [
  { id: "1", category: "Money & Markets", title: "Explainer title", image: dummyImage(205, 900, 1200) },
  { id: "2", category: "Technology & AI", title: "Explainer title", image: dummyImage(210, 900, 1200), video: dummyVideo(2) },
  { id: "3", category: "History & Culture", title: "Explainer title", image: dummyImage(215, 900, 1200) },
  { id: "4", category: "Money & Markets", title: "Explainer title", image: dummyImage(220, 900, 1200), video: dummyVideo(4) },
  { id: "5", category: "Business & Brands", title: "Explainer title", image: dummyImage(225, 900, 1200) },
  { id: "6", category: "Technology & AI", title: "Explainer title", image: dummyImage(230, 900, 1200), video: dummyVideo(6) },
  { id: "7", category: "History & Culture", title: "Explainer title", image: dummyImage(235, 900, 1200) },
]
