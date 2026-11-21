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

export type StoryCover = { src: StaticImageData; alt: string; video: VideoAsset }

// One card per story, 9:16, in the Figma order (website page, frame 9108:5369). Each cover is
// the Figma thumbnail; `video` (public/stories/) plays, with sound, when the card is hovered
// (see StoryCard). Investing Decoded, New Age Investing and Jet Airways have no video of their
// own in the Drive folder yet, so they borrow spare brand stories (Asian Paints, Havells,
// Videocon) until theirs arrive: swap the `video` on those three lines then. Used by the home
// "whole world of stories" row and the Qix hero's thumbnail arc.
export const storyCovers: StoryCover[] = [
  { src: investingDecoded, alt: "Investing Decoded — Finance Xplaind", video: v.asianPaints },
  { src: newAgeInvesting, alt: "New Age Investing — Finance Xplaind", video: v.havells },
  { src: amaron, alt: "Amaron — Made in India", video: v.amaron },
  { src: jetAirways, alt: "Jet Airways — Made in India", video: v.videocon },
  { src: jockey, alt: "Jockey — Made in India", video: v.jockey },
  { src: mrf, alt: "MRF — Made in India", video: v.mrf },
  { src: nilkamal, alt: "Nilkamal — Made in India", video: v.nilkamal },
  { src: fevicol, alt: "Fevicol — Made in India", video: v.fevicol },
]
