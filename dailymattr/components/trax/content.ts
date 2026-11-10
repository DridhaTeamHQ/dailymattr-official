/** Copy and data for the Trax page. Figma frame: "Trax · DailyMattr" (8595:11737). */

export const hero = {
  tag: "Trax · Listen",
  titleLines: ["Stay in the know.", "Hands-free."],
  description:
    "Listen to the stories that matter, explore ideas in greater depth, and catch up on your day without staring at another screen.",
  cta: { label: "Listen with Trax", href: "/formats/trax#featured" },
}

/** Phone mock-up player (8595:11828). Placeholder copy straight from the frame. */
export const phonePlayer = {
  topic: "Topic",
  title: "Episode title",
  elapsed: "00:00",
  remaining: "00:00",
  // Bar heights in px, left to right; the first `played` bars are blue.
  bars: [
    11, 16, 25, 28, 24, 16, 8, 15, 19, 23, 21, 14, 11, 22, 28, 29, 23, 12, 14, 22, 24, 21, 15, 8,
    15, 22, 26, 24, 17, 10, 21, 28, 28, 22, 13, 12, 18, 20, 20, 17,
  ],
  played: 24,
}

export type TraxExperience = { icon: string; title: string; description: string }

export const experiences = {
  eyebrow: "Listening experiences",
  title: "Your day. Your soundtrack to understanding.",
  items: [
    {
      icon: "/trax/icon-daily-wraps.svg",
      title: "Daily wraps",
      description: "Catch up on important developments in one listening session.",
    },
    {
      icon: "/trax/icon-explainers.svg",
      title: "Audio explainers",
      description: "Understand the background behind complex subjects.",
    },
    {
      icon: "/trax/icon-on-the-go.svg",
      title: "Stories on the go",
      description: "Take your listening into commutes, walks, and everyday routines.",
    },
  ] satisfies TraxExperience[],
}

export const whyAudio = {
  eyebrow: "Why audio",
  title: "Make time for more understanding.",
  description:
    "Listen while you move. Return to stories when you have time. Keep learning without making every moment a screen moment.",
  // Waveform panel (8595:11958): bar heights in px; the first `played` bars are blue.
  bars: [
    100, 116, 99, 55, 13, 56, 77, 72, 58, 32, 26, 73, 105, 109, 80, 27, 47, 92, 107, 91, 53, 9, 41,
    66, 84, 78, 45, 22, 75, 111, 115, 85, 34, 37, 77, 91, 77, 46, 14, 42, 80, 102, 94, 57, 15, 71,
    107, 112, 84, 37, 26, 60, 70, 72, 58, 22,
  ],
  played: 36,
}

export type TraxEpisode = {
  id: string
  topic: string
  duration: string
  title: string
  description: string
  /** Progress line art exported from the frame (the first card's bar is a touch heavier). */
  progress: string
}

export const featured = {
  eyebrow: "Featured listening",
  title: "Press play on something that matters.",
  episode: {
    topic: "Topic",
    duration: "00 min",
    title: "Episode title",
    description: "Short description of the episode.",
    elapsed: "1:25",
    total: "3:15",
  },
  episodes: [
    {
      id: "episode-1",
      topic: "Topic",
      duration: "00 min",
      title: "Episode title",
      description: "Short description of the episode.",
      progress: "/trax/progress-card-a.svg",
    },
    {
      id: "episode-2",
      topic: "Topic",
      duration: "00 min",
      title: "Episode title",
      description: "Short description of the episode.",
      progress: "/trax/progress-card-b.svg",
    },
    {
      id: "episode-3",
      topic: "Topic",
      duration: "00 min",
      title: "Episode title",
      description: "Short description of the episode.",
      progress: "/trax/progress-card-b.svg",
    },
  ] satisfies TraxEpisode[],
}

export const getStarted = {
  title: "Your next story is one play away.",
  cta: { label: "Discover Trax", href: "/formats/trax#featured" },
}
