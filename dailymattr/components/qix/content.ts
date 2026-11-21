/** Copy and data for the Qix page. Figma frame: "Qix · DailyMattr" (8646:2608). */

import { localVideo } from "@/lib/videos"

/** Hero copy. Figma 9278:984 breaks the title after "bigger". */
export const hero = {
  titleLines: ["See the bigger", "picture."],
  description:
    "From today's biggest developments to the ideas that shaped our world, Qix makes learning visual, engaging, and easy to follow.",
  cta: { label: "Watch Qix", href: "/formats/qix#gallery" },
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
  cta: { label: "Explore Qix", href: "/formats/qix#gallery" },
}
