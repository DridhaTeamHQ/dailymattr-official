
export type Format = {
  value: string
  title: string
  subtitle: string
  /** Video shown when this tab is active, e.g. "/videos/pix.mp4". Leave empty for the placeholder. */
  videoSrc?: string
}

// Placeholder clips: Mixkit free stock videos (mixkit.co/free-stock-video/<slug>-<id>), 720p,
// chosen to match each format. Swap for real dailymattr footage, e.g. "/videos/pix.mp4".
const mixkit = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`

export const formats: Format[] = [
  // Young man scrolling on his phone
  { videoSrc: mixkit(4801), value: "pix", title: "Pix", subtitle: "Read visual stories" },
  // Man watching a tablet, the screen reflected in his glasses
  { videoSrc: mixkit(41207), value: "qix", title: "Qix", subtitle: "Watch short explainers" },
  // Man listening on headphones
  { videoSrc: mixkit(33136), value: "trax", title: "Trax", subtitle: "Listen to stories" },
  // Presentation during a team meeting
  { videoSrc: mixkit(42666), value: "xplaind", title: "Xplaind", subtitle: "Understand topics better" },
  // Man reading a newspaper
  { videoSrc: mixkit(41212), value: "articles", title: "Articles", subtitle: "Read detailed news" },
  // Audience raising hands at a conference
  { videoSrc: mixkit(13192), value: "polls", title: "Polls", subtitle: "Share your opinion" },
]
