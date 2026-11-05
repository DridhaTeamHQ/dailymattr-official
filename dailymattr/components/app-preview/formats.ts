export type Format = {
  value: string
  title: string
  subtitle: string
  /** Video shown when this tab is active, e.g. "/videos/pix.mp4". Leave empty for the placeholder. */
  videoSrc?: string
}

export const formats: Format[] = [
  { value: "pix", title: "Pix", subtitle: "Read visual stories" },
  { value: "qix", title: "Qix", subtitle: "Watch short explainers" },
  { value: "trax", title: "Trax", subtitle: "Listen to stories" },
  { value: "xplaind", title: "Xplaind", subtitle: "Understand topics better" },
  { value: "articles", title: "Articles", subtitle: "Read detailed news" },
  { value: "polls", title: "Polls", subtitle: "Share your opinion" },
]
