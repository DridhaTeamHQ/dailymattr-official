/** Copy and data for the Trax page. Figma frame: "Trax · DailyMattr" (8595:11737). */

export const hero = {
  tag: "Trax · Listen",
  titleLines: ["Stay in the know.", "Hands-free."],
  description:
    "Listen to the stories that matter, explore ideas in greater depth, and catch up on your day without staring at another screen.",
  cta: { label: "Listen with Trax", href: "/formats/trax#featured" },
}

export type TraxHeroEpisode = {
  id: string
  title: string
  topic: string
  /** 1080×1920 poster (Fevicol's is 1080×1700), cropped to the square artwork frame. */
  art: string
  /**
   * Vertical framing of the poster in its square frame (CSS object-position y, 0 = top): set
   * per poster so its title stays whole.
   */
  focusY: number
  /** Placeholder song made by scripts/make-trax-songs.mjs; swap for the episode's audio. */
  audio: string
  /**
   * The song's tempo (beats per minute), so the player bar's level meter moves in time with
   * it. The placeholder songs' tempos are in make-trax-songs.mjs; update it with the audio.
   */
  bpm: number
}

/**
 * Cover-flow player above the hero copy (Figma 9278:702), in ring order. `initial` is the one
 * in the centre slot on load (Behind Cricket Balls), with the others round it in this order,
 * wrapping. Nothing plays until the visitor presses play or a card.
 */
export const heroPlayer = {
  episodes: [
    {
      id: "cricket",
      title: "Cricket",
      topic: "The Origin of Sports",
      art: "/trax/hero/art-cricket.png",
      focusY: 9,
      audio: "/trax/hero/audio/cricket.mp3",
      bpm: 100,
    },
    {
      id: "insurance",
      title: "Insurance 101 : Basics",
      topic: "Finance Explained",
      art: "/trax/hero/art-insurance.png",
      focusY: 73,
      audio: "/trax/hero/audio/insurance.mp3",
      bpm: 78,
    },
    {
      id: "fevicol",
      title: "Fevicol",
      topic: "Made In India",
      art: "/trax/hero/art-fevicol.jpg",
      focusY: 3,
      audio: "/trax/hero/audio/fevicol.mp3",
      bpm: 92,
    },
    {
      id: "cricket-balls",
      title: "Behind Cricket Balls",
      topic: "How Things are Made",
      art: "/trax/hero/art-cricket-balls.png",
      focusY: 18,
      audio: "/trax/hero/audio/cricket-balls.mp3",
      bpm: 112,
    },
    {
      id: "self-driving-cars",
      title: "Self Driving Cars",
      topic: "Before It's Big",
      art: "/trax/hero/art-self-driving-cars.png",
      focusY: 16,
      audio: "/trax/hero/audio/self-driving-cars.mp3",
      bpm: 96,
    },
  ] satisfies TraxHeroEpisode[],
  initial: 3,
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
