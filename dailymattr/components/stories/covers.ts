import type { StaticImageData } from "next/image"

import { storyVideos as v, type VideoAsset } from "@/lib/videos"
import amaron from "@/public/cover-images/amaron.png"
import fevicol from "@/public/cover-images/fevicol.jpg"
import investingDecoded from "@/public/cover-images/investing-decoded.jpg"
import jetAirways from "@/public/cover-images/jet-airways.png"
import jockey from "@/public/cover-images/jockey.png"
import mrf from "@/public/cover-images/mrf.png"
import newAgeInvesting from "@/public/cover-images/new-age-investing.jpg"
import nilkamal from "@/public/cover-images/nilkamal.jpg"

export type StoryCover = {
  id: string
  /** A bundled image, a path in public/, or a full URL (uploads made in the CMS). */
  src: StaticImageData | string
  alt: string
  /** Plays on the card; null = the cover only. */
  video: VideoAsset | null
}

// One card per story, 9:16, in the Figma order (website page, frame 9108:5369). Each cover is
// the Figma thumbnail; `video` (public/stories/) plays, with sound, when the card is hovered
// (see StoryCard). Investing Decoded, New Age Investing and Jet Airways have no video of their
// own in the Drive folder yet, so they borrow spare brand stories (Asian Paints, Havells,
// Videocon) until theirs arrive: swap the `video` on those three lines then. Used by the home
// "whole world of stories" row and the Qix hero's thumbnail arc.
//
// These are the built-in defaults: the live list is edited on the CMS's Qix page and read by
// lib/formats.ts, which falls back to this one when the CMS database can't be reached.
export const storyCovers: StoryCover[] = [
  { id: "investing-decoded", src: investingDecoded, alt: "Investing Decoded — Finance Xplaind", video: v.asianPaints },
  { id: "new-age-investing", src: newAgeInvesting, alt: "New Age Investing — Finance Xplaind", video: v.havells },
  { id: "amaron", src: amaron, alt: "Amaron — Made in India", video: v.amaron },
  { id: "jet-airways", src: jetAirways, alt: "Jet Airways — Made in India", video: v.videocon },
  { id: "jockey", src: jockey, alt: "Jockey — Made in India", video: v.jockey },
  { id: "mrf", src: mrf, alt: "MRF — Made in India", video: v.mrf },
  { id: "nilkamal", src: nilkamal, alt: "Nilkamal — Made in India", video: v.nilkamal },
  { id: "fevicol", src: fevicol, alt: "Fevicol — Made in India", video: v.fevicol },
]
