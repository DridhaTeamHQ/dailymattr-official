import type { StaticImageData } from "next/image"

import appMockup from "@/public/home/app-preview-mockup.png"

export type Format = {
  value: string
  title: string
  subtitle: string
  /** Still shown in the media panel for this tab. */
  image: StaticImageData
  /** Video shown instead of the still, e.g. "/videos/pix.mp4". Its own length fills the badge. */
  videoSrc?: string
  /** Badge text while there is no video to read a length from (Figma shows 10:00). */
  duration: string
  /** Sparkle beside the title (NIA). */
  sparkle?: boolean
}

/** A clip in public/inside_videos/, served as-is (file names may contain spaces). */
const inside = (file: string) => `/inside_videos/${encodeURIComponent(file)}`

// Figma 8859:12720: seven tabs over the app mockup (8859:12714). Each tab plays its own clip
// from public/inside_videos/; a tab without a videoSrc would show the mockup still.
export const formats: Format[] = [
  { value: "pix", title: "Pix", subtitle: "Read visual stories", image: appMockup, videoSrc: inside("pix.mp4"), duration: "10:00" },
  { value: "nia", title: "NIA", subtitle: "Understand both sides", image: appMockup, videoSrc: inside("nia.mp4"), duration: "10:00", sparkle: true },
  { value: "qix", title: "Qix", subtitle: "Watch short explainers", image: appMockup, videoSrc: inside("qix final.mp4"), duration: "10:00" },
  { value: "trax", title: "Trax", subtitle: "Listen to stories", image: appMockup, videoSrc: inside("trax.mp4"), duration: "10:00" },
  { value: "polls", title: "Polls", subtitle: "Share your opinion", image: appMockup, videoSrc: inside("LIVE POLLS.mp4"), duration: "10:00" },
  { value: "xplaind", title: "Xplaind", subtitle: "Understand topics better", image: appMockup, videoSrc: inside("explained.mp4"), duration: "10:00" },
  { value: "streaks", title: "Streaks", subtitle: "Keep your habit going", image: appMockup, videoSrc: inside("streaks.mp4"), duration: "10:00" },
]
