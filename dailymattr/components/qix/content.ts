/** Copy and data for the Qix page. Figma frame: "Qix · DailyMattr" (8646:2608). */

import type { StaticImageData } from "next/image"

import { localVideo, storyVideos, type VideoAsset } from "@/lib/videos"
import getStartedPhoto from "@/public/qix/hero/qix.png"
import amaron from "@/public/qix/showcase/amaron.webp"
import cricket from "@/public/qix/showcase/cricket.webp"
import fevicol from "@/public/qix/showcase/fevicol.webp"
import investingDecoded from "@/public/qix/showcase/investing-decoded.webp"
import jetAirways from "@/public/qix/showcase/jet-airways.webp"
import mrf from "@/public/qix/showcase/mrf.webp"
import newAgeInvesting from "@/public/qix/showcase/new-age-investing.webp"
import nilkamal from "@/public/qix/showcase/nilkamal.webp"
import selfDrivingCars from "@/public/qix/showcase/self-driving-cars.png"

export type QixShowcaseCard = {
  id: string
  /** 584×730 art, exported from the card in Figma. */
  image: StaticImageData
  alt: string
  series: string
  length: string
  line: string
  /** Plays on the card when Play is pressed; null shows "Video not available yet" instead. */
  video: VideoAsset | null
}

/**
 * Netflix-style cards at the top of the page, three to a page on desktop (Figma 9831:7101,
 * "Video hero · Netflix-style cards"; pages 9831:7103, 9831:7422, 9831:7705). In the Figma order.
 * Only Amaron, MRF, Nilkamal and Fevicol have their own story video; on the rest, Play says the
 * video is not available yet. Set `video` on a card once its video exists.
 */
export const showcase: { cards: QixShowcaseCard[]; moreInfoHref: string } = {
  moreInfoHref: "/download",
  cards: [
    { id: "amaron", image: amaron, alt: "Amaron - Made in India", series: "Made in India", length: "2 min", line: "The battery brand built in Tirupati.", video: storyVideos.amaron },
    { id: "self-driving-cars", image: selfDrivingCars, alt: "Self Driving Cars - Before It's Big", series: "Tech", length: "2 min", line: "Who is really at the wheel?", video: null },
    { id: "cricket", image: cricket, alt: "Cricket - Origin of Sports", series: "Origin of sports", length: "2 min", line: "From village greens to a billion fans.", video: null },
    { id: "jet-airways", image: jetAirways, alt: "Jet Airways - Made in India", series: "Rise and fall", length: "2 min", line: "India’s favourite airline, and how it fell.", video: null },
    { id: "investing-decoded", image: investingDecoded, alt: "Investing Decoded - Finance Xplaind", series: "Money", length: "2 min", line: "Where to start, minus the jargon.", video: null },
    { id: "fevicol", image: fevicol, alt: "Fevicol - Made in India", series: "Made in India", length: "2 min", line: "The glue that holds India together.", video: storyVideos.fevicol },
    { id: "mrf", image: mrf, alt: "MRF - Made in India", series: "Made in India", length: "2 min", line: "From toy balloons to racing tyres.", video: storyVideos.mrf },
    { id: "new-age-investing", image: newAgeInvesting, alt: "New Age Investing - Finance Xplaind", series: "Money", length: "2 min", line: "ETFs, gold and apps: how India invests now.", video: null },
    { id: "nilkamal", image: nilkamal, alt: "Nilkamal - Made in India", series: "Made in India", length: "2 min", line: "The chair in every Indian home.", video: storyVideos.nilkamal },
  ],
}

/** Hero copy. Figma 9278:984 breaks the title after "bigger". */
export const hero = {
  titleLines: ["See the bigger picture."],
  description:
    "From today's biggest developments to the ideas that shaped our world, Qix makes learning visual, engaging, and easy to follow.",
  cta: { label: "Watch Qix", href: "/formats/qix/#stories" },
}

export const experience = {
  eyebrow: "The experience",
  title: "Complicated topics. Clear explanations.",
  description:
    "Qix breaks down a subject into a sequence of visual moments, making the details easier to follow and the bigger picture easier to understand.",
  // The whole MRF story (public/stories/mrf.mp4, 240 frames) cut at its scene changes into four
  // back-to-back clips that play in turn: frames 0–66, 67–126, 127–161, 162–239. Clips live in
  // public/qix/experience/.
  frames: [
    { label: "The question", video: localVideo("step-1", 360, 640, { dir: "qix/experience" }) },
    { label: "The detail", video: localVideo("step-2", 360, 640, { dir: "qix/experience" }) },
    { label: "The big picture", video: localVideo("step-3", 360, 640, { dir: "qix/experience" }) },
    { label: "The explanation", video: localVideo("step-4", 360, 640, { dir: "qix/experience" }) },
  ],
}

export type QixPillar = { title: string; description: string }

/** The three content pillars, shown under the hero's thumbnail arc (Figma 9278:993). */
export const pillars = {
  items: [
    {
      title: "News in motion.",
      description: "Follow important developments through concise, visual explainers.",
    },
    {
      title: "Ideas made visible.",
      description:
        "Understand science, history, economics, technology, and the forces shaping everyday life.",
    },
    {
      title: "Stories worth exploring.",
      description:
        "Discover the connections, people, and events that make the world more interesting.",
    },
  ] satisfies QixPillar[],
}

/** Gallery heading; the cards are the home page's story row (components/stories/covers.ts). */
export const gallery = {
  eyebrow: "Content gallery",
  title: "A world of stories, frame by frame.",
}

export const getStarted = {
  title: "Less scrolling. More seeing.",
  cta: { label: "Explore Qix", href: "/formats/qix/#stories" },
  /**
   * Full-bleed photo behind the copy (Figma 9344:7440), exported at the frame's 1920×747.
   * Imported so its URL carries a content hash (see the Trax one).
   */
  image: getStartedPhoto,
  /** Dark wash from the left so the white copy reads on the light fabric (Figma 9344:7440). */
  overlay: "linear-gradient(89.85deg, rgba(32, 11, 1, 0.8) 0%, rgba(71, 21, 4, 0) 58.956%)",
}
