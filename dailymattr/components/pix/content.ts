/** Copy and data for the Pix page. Figma frame: "Pix · DailyMattr" (8632:2082). */

export const hero = {
  tag: "Pix · Read",
  titleLines: ["Less reading.", "More understanding."],
  description:
    "The important facts, presented visually and stripped of unnecessary noise. Swipe through the story and get to what matters.",
  cta: { label: "Discover Pix", href: "/formats/pix#how-it-works" },
}

export type PixStep = { number: string; title: string; description: string }

export const howItWorks = {
  eyebrow: "How Pix works",
  title: "A better way to read the news.",
  steps: [
    {
      number: "01",
      title: "Start with the big picture.",
      description: "See the main development in a clear visual.",
    },
    {
      number: "02",
      title: "Swipe for the facts.",
      description: "Move through the essential details, one card at a time.",
    },
    {
      number: "03",
      title: "Understand the significance.",
      description: "Get the context behind the headline.",
    },
    {
      number: "04",
      title: "Move on informed.",
      description: "Know enough to follow the story without losing your day to it.",
    },
  ] satisfies PixStep[],
}

export type PixFeature = { icon: string; title: string; description: string }

export const whyPix = {
  eyebrow: "Why Pix",
  title: "Built for the way you read.",
  features: [
    {
      icon: "/pix/icon-quick.svg",
      title: "Quick to follow.",
      description: "Short, focused summaries.",
    },
    {
      icon: "/pix/icon-scan.svg",
      title: "Easy to scan.",
      description: "Visual hierarchy that makes important details stand out.",
    },
    {
      icon: "/pix/icon-clear.svg",
      title: "Clear by design.",
      description: "Plain language, without unnecessary complexity.",
    },
    {
      icon: "/pix/icon-curiosity.svg",
      title: "Made for everyday curiosity.",
      description: "From public affairs and business to culture and sport.",
    },
  ] satisfies PixFeature[],
}

export type PixStory = {
  id: string
  category: string
  headline: string
  fact: string
  href: string
  /** Cover art; cards without one show the grey placeholder from the design. */
  image?: { src: string; alt: string; position?: string }
}

export const realStories = {
  eyebrow: "Real stories",
  title: "One swipe. A wider perspective.",
  stories: [
    {
      id: "oleshky-aid",
      category: "World",
      headline: "Russia-Ukraine ceasefire allows aid to reach Oleshky's remaining residents",
      fact: "One key fact from the story.",
      href: "/stories",
      // Figma crops the portrait shot to its lower half (8636:2501).
      image: {
        src: "/pix/story-world.png",
        alt: "Burning vehicles on a street",
        position: "50% 76%",
      },
    },
    {
      id: "business",
      category: "Business",
      headline: "Story headline",
      fact: "One key fact from the story.",
      href: "/stories",
    },
    {
      id: "culture",
      category: "Culture",
      headline: "Story headline",
      fact: "One key fact from the story.",
      href: "/stories",
    },
    {
      id: "sport",
      category: "Sport",
      headline: "Story headline",
      fact: "One key fact from the story.",
      href: "/stories",
    },
  ] satisfies PixStory[],
}

export const getStarted = {
  eyebrow: "Get started",
  title: "Get the story. Keep your time.",
  cta: { label: "Read with Pix", href: "/stories" },
}
