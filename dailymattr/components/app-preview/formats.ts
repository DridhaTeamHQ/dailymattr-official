import { dummyVideo } from "@/lib/dummy-media"

export type Format = {
  value: string
  title: string
  subtitle: string
  /** Video shown when this tab is active, e.g. "/videos/pix.mp4". Leave empty for the placeholder. */
  videoSrc?: string
}

export const formats: Format[] = [
  { videoSrc: dummyVideo(0), value: "pix", title: "Pix", subtitle: "Read visual stories" },
  { videoSrc: dummyVideo(1), value: "qix", title: "Qix", subtitle: "Watch short explainers" },
  { videoSrc: dummyVideo(2), value: "trax", title: "Trax", subtitle: "Listen to stories" },
  { videoSrc: dummyVideo(3), value: "xplaind", title: "Xplaind", subtitle: "Understand topics better" },
  { videoSrc: dummyVideo(4), value: "articles", title: "Articles", subtitle: "Read detailed news" },
  { videoSrc: dummyVideo(5), value: "polls", title: "Polls", subtitle: "Share your opinion" },
]
