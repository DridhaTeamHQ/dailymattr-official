// Every video on the site, one entry each. Components take an entry from here (or, for
// placeholder clips, a plain URL) and render it with <SiteVideo>, which handles loading.
//
// Local videos are produced by `npm run videos` (scripts/encode-videos.mjs) from the
// originals in media-src/ (kept out of git). Each one gets three files in public/videos/:
//   <name>.webm         VP9, smallest; used by browsers that support it
//   <name>.mp4          H.264 fallback that plays everywhere
//   <name>-poster.webp  first frame, shown instantly while the video loads
// and, for entries with av1Crf in the script, <name>.av1.mp4 (see VideoAsset.fullColor).
// To add a video: drop the original in media-src/, add it to the list in the script, run
// `npm run videos`, then add an entry below with localVideo().

// Later the videos will come from the database. Map each row to a VideoAsset (its file URLs
// as `sources`, a poster URL, width and height) and pass it to <SiteVideo video={...} />:
// the component does not care where the files live, so only this file changes.

export type VideoSource = { src: string; type: string }

export type VideoAsset = {
  /** In order of preference; the browser plays the first one it supports. */
  sources: VideoSource[]
  /**
   * A full-colour (4:4:4) AV1 encode, for where fine coloured detail matters on a large screen
   * (the desktop home hero). Not in `sources`: it needs software decoding, so a component
   * opts in by putting it first. Its type names the AV1 High profile, so a browser that can't
   * decode it (Safari) skips straight to `sources`.
   */
  fullColor?: VideoSource
  /** Local still for the first frame. Remote posters are never used: they hold up page load. */
  poster?: string
  width: number
  height: number
  /** A stock clip standing in until the real video is ready. */
  placeholder?: boolean
}

/** A video encoded by `npm run videos` into public/videos/ (or public/<dir>/). */
export const localVideo = (
  name: string,
  width: number,
  height: number,
  { webm = true, dir = "videos", fullColor = false }: { webm?: boolean; dir?: string; fullColor?: boolean } = {}
): VideoAsset => ({
  sources: [
    ...(webm ? [{ src: `/${dir}/${name}.webm`, type: "video/webm" }] : []),
    { src: `/${dir}/${name}.mp4`, type: "video/mp4" },
  ],
  // av01.1 = High profile (4:4:4), then level 4.1, Main tier, 8-bit: what av1Crf writes for 1080p60.
  ...(fullColor
    ? { fullColor: { src: `/${dir}/${name}.av1.mp4`, type: 'video/mp4; codecs="av01.1.09M.08"' } }
    : {}),
  poster: `/${dir}/${name}-poster.webp`,
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
  /** Home "Follow your curiosity" explainers gallery (16:9, matches the open panel), with sound. */
  customerStory2: localVideo("customer-story-2", 1024, 576),
  /** 1:11 customer story; also used for the gallery panels that used to play curiosity-1. */
  customerStory2V2: localVideo("customer-story-2-v2", 1920, 1080),
  /**
   * Explainers gallery, "Banking & Insurance". The original file as delivered (H.264 1080p,
   * AAC), copied unchanged on purpose: not run through `npm run videos`, so no re-encode and no
   * WebM copy. Only the poster (first frame) was made from it.
   */
  explainerBankingInsurance: localVideo("explainer-banking-insurance", 1920, 1080, { webm: false }),
  /** Pix page hero. */
  pixEntry: localVideo("pix-entry", 1920, 1080),
  /**
   * Home hero: grows to full screen on scroll, and its frames are scrubbed by the scroll
   * position instead of playing (see <ScrubVideo>). Encoded with scrub: true. Once
   * `npm run videos` has written public/videos/home-hero.av1.mp4 (av1Crf in the script), set
   * fullColor: true so large screens scrub that full-colour encode, which keeps the phone
   * screen's coloured text as sharp as the master. Off until then: the file isn't there yet.
   */
  homeHero: localVideo("home-hero", 1920, 1080, { webm: false }),
} satisfies Record<string, VideoAsset>

/** 9:16 brand stories in public/stories/, one per card in the home "whole world of stories" row. */
const story = (name: string, opts: { webm?: boolean } = {}) =>
  localVideo(name, 720, 1280, { dir: "stories", ...opts })

export const storyVideos = {
  amaron: story("amaron"),
  asianPaints: story("asian-paints"),
  fevicol: story("fevicol"),
  havells: story("havells"),
  jockey: story("jockey", { webm: false }),
  mrf: story("mrf"),
  nilkamal: story("nilkamal"),
  videocon: story("videocon"),
} satisfies Record<string, VideoAsset>
