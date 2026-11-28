/** Copy and data for the Qix page. Figma frame: "Qix · DailyMattr" (8646:2608). */

import { localVideo } from "@/lib/videos"
import getStartedPhoto from "@/public/qix/hero/qix.png"

/** Words on a top card: a series label, a length and one line. */
export type QixShowcaseCopy = { series: string; length?: string; line: string }

/**
 * The big Netflix-style cards at the top of the page (Figma 9831:7101, "Video hero ·
 * Netflix-style cards"), three to a page on desktop. Which stories show, in what order, and
 * their thumbnails and videos all come from the CMS: the stories with "Top cards" switched on
 * (lib/formats.ts, showcaseCovers). The Figma copy for each card is kept here, matched to a
 * story whose title starts with the key (any case); a story with no copy here shows the part of
 * its title after " - " as the series (e.g. "Made in India") and the part before as the line.
 */
export const showcase: { copy: Record<string, QixShowcaseCopy>; moreInfoHref: string } = {
  moreInfoHref: "/download",
  copy: {
    amaron: { series: "Made in India", length: "2 min", line: "The battery brand built in Tirupati." },
    "self driving cars": { series: "Tech", length: "2 min", line: "Who is really at the wheel?" },
    cricket: { series: "Origin of sports", length: "2 min", line: "From village greens to a billion fans." },
    "jet airways": { series: "Rise and fall", length: "2 min", line: "India’s favourite airline, and how it fell." },
    "investing decoded": { series: "Money", length: "2 min", line: "Where to start, minus the jargon." },
    fevicol: { series: "Made in India", length: "2 min", line: "The glue that holds India together." },
    mrf: { series: "Made in India", length: "2 min", line: "From toy balloons to racing tyres." },
    "new age investing": { series: "Money", length: "2 min", line: "ETFs, gold and apps: how India invests now." },
    nilkamal: { series: "Made in India", length: "2 min", line: "The chair in every Indian home." },
  },
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
