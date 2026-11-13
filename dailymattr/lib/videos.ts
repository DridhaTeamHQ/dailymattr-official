// Every video on the site, one entry each. Components take an entry from here (or, for
// placeholder clips, a plain URL) and render it with <SiteVideo>, which handles loading.
//
// Local videos are produced by `npm run videos` (scripts/encode-videos.mjs) from the
// originals in media-src/ (kept out of git). Each one gets three files in public/videos/:
//   <name>.webm         VP9, smallest; used by browsers that support it
//   <name>.mp4          H.264 fallback that plays everywhere
//   <name>-poster.webp  first frame, shown instantly while the video loads
// To add a video: drop the original in media-src/, add it to the list in the script, run
// `npm run videos`, then add an entry below with localVideo().

// Later the videos will come from the database. Map each row to a VideoAsset (its file URLs
// as `sources`, a poster URL, width and height) and pass it to <SiteVideo video={...} />:
// the component does not care where the files live, so only this file changes.

export type VideoSource = { src: string; type: string }

export type VideoAsset = {
  /** In order of preference; the browser plays the first one it supports. */
  sources: VideoSource[]
  /** Local still for the first frame. Remote posters are never used: they hold up page load. */
  poster?: string
  width: number
  height: number
  /** A stock clip standing in until the real video is ready. */
  placeholder?: boolean
}

/** A video encoded by `npm run videos` into public/videos/. */
export const localVideo = (
  name: string,
  width: number,
  height: number,
  { webm = true }: { webm?: boolean } = {}
): VideoAsset => ({
  sources: [
    ...(webm ? [{ src: `/videos/${name}.webm`, type: "video/webm" }] : []),
    { src: `/videos/${name}.mp4`, type: "video/mp4" },
  ],
  poster: `/videos/${name}-poster.webp`,
  width,
  height,
})

/** A remote stock MP4 used as a stand-in (no poster: remote stills are slow to fetch). */
export const placeholderVideo = (src: string, width = 1280, height = 720): VideoAsset => ({
  sources: [{ src, type: "video/mp4" }],
  width,
  height,
  placeholder: true,
})

export const videos = {
  /** Daily routine section on the home page. */
  dayByDay: localVideo("day-by-day", 1920, 1080, { webm: false }),
  /**
   * Home "whole world of stories" cards, played on hover. Placeholder: reuses the day-by-day
   * clip until each story has its own 9:16 video — add one entry per story and point the
   * covers in components/stories/story-carousel.tsx at them.
   */
  storyPreview: localVideo("day-by-day", 1920, 1080, { webm: false }),
  /** Home "Follow your curiosity" explainers gallery (16:9, matches the open panel; with sound). */
  curiosity1: localVideo("curiosity-1", 1920, 1080),
  customerStory2: localVideo("customer-story-2", 1920, 1080),
  /** Pix page hero. */
  pixEntry: localVideo("pix-entry", 1920, 1080),
  /**
   * Home hero (grows to full screen on scroll). Placeholder: Mixkit free stock video #49837
   * (mixkit.co/free-stock-video/landscape-from-an-aerial-view-of-a-big-city-49837).
   */
  homeHero: placeholderVideo("https://assets.mixkit.co/videos/49837/49837-1080.mp4", 1920, 1080),
} satisfies Record<string, VideoAsset>
