/** Copy and data for the Qix page. Figma frame: "Qix · DailyMattr" (8646:2608). */

export const hero = {
  tag: "Qix · Watch",
  title: "See the bigger picture.",
  description:
    "From today's biggest developments to the ideas that shaped our world, Qix makes learning visual, engaging, and easy to follow.",
  cta: { label: "Watch Qix", href: "/formats/qix#gallery" },
}

export const experience = {
  eyebrow: "The experience",
  title: "Complicated topics. Clear explanations.",
  description:
    "Qix breaks down a subject into a sequence of visual moments, making the details easier to follow and the bigger picture easier to understand.",
  frames: [1, 2, 3, 4],
}

export type QixPillar = { icon: string; title: string; description: string }

export const pillars = {
  eyebrow: "Three content pillars",
  items: [
    {
      icon: "/qix/pillar-motion.svg",
      title: "News in motion.",
      description: "Follow important developments through concise, visual explainers.",
    },
    {
      icon: "/qix/pillar-visible.svg",
      title: "Ideas made visible.",
      description:
        "Understand science, history, economics, technology, and the forces shaping everyday life.",
    },
    {
      icon: "/qix/pillar-explore.svg",
      title: "Stories worth exploring.",
      description:
        "Discover the connections, people, and events that make the world more interesting.",
    },
  ] satisfies QixPillar[],
}

export type QixEpisode = { id: string; topic: string; title: string }

/** Placeholder episodes straight from the frame; the first card is drawn wider. */
export const gallery = {
  eyebrow: "Content gallery",
  title: "A world of stories, frame by frame.",
  episodes: [
    { id: "ep-1", topic: "Science", title: "Episode title" },
    { id: "ep-2", topic: "History", title: "Episode title" },
    { id: "ep-3", topic: "Economics", title: "Episode title" },
    { id: "ep-4", topic: "Technology", title: "Episode title" },
    { id: "ep-5", topic: "Science", title: "Episode title" },
    { id: "ep-6", topic: "History", title: "Episode title" },
  ] satisfies QixEpisode[],
}

export const getStarted = {
  title: "Less scrolling. More seeing.",
  cta: { label: "Explore Qix", href: "/formats/qix#gallery" },
}
