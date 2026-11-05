import {
  AudioLines,
  Compass,
  Eye,
  Footprints,
  Headphones,
  Layers,
  Lightbulb,
  ListChecks,
  Network,
  PlayCircle,
  Route,
  Play,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"

export type Feature = {
  icon: LucideIcon
  title: string
  description: string
  /** Shown in the media box while this feature's tab is active. Leave both empty for the placeholder. */
  image?: string
  video?: string
}

export type LearnFormat = {
  id: string
  name: string
  /** Shown in the panel index, e.g. "01 — Read". */
  verb: string
  icon: LucideIcon
  tag: string
  title: [string, string]
  description: string
  cta: { label: string; href: string }
  features: Feature[]
  /** "split": text left, tall media right. "wide": header row, wide media, features in columns. */
  layout: "split" | "wide"
  /** Tailwind classes for the media placeholder fill. */
  mediaClassName: string
}

export const learnFormats: LearnFormat[] = [
  {
    id: "pix",
    layout: "split",
    name: "Pix",
    verb: "Read",
    icon: Zap,
    tag: "Pix · Read",
    title: ["Small read.", "Bigger picture."],
    description: "Swipe through visual news cards that bring the key facts into focus.",
    cta: { label: "Explore Pix", href: "/formats/pix" },
    mediaClassName: "bg-placeholder",
    features: [
      {
        icon: ListChecks,
        title: "Catch the essentials",
        description: "Understand the main development without working through a long article.",
      },
      {
        icon: Compass,
        title: "Find the context",
        description: "See why the story matters beyond its headline.",
      },
      {
        icon: Footprints,
        title: "Keep moving",
        description: "Go from one story to the next in a clean, easy-to-follow format.",
      },
    ],
  },
  {
    id: "qix",
    layout: "wide",
    name: "Qix",
    verb: "Watch",
    icon: Play,
    tag: "Qix · Watch",
    title: ["Press play.", "Make sense of something big."],
    description:
      "Explore short video explainers that unpack ideas, events and questions worth your attention.",
    cta: { label: "Discover Qix", href: "/formats/qix" },
    mediaClassName: "bg-placeholder",
    features: [
      {
        icon: Eye,
        title: "See it clearly",
        description: "Visuals help bring unfamiliar topics into focus.",
      },
      {
        icon: PlayCircle,
        title: "Follow the explanation",
        description: "Clear storytelling makes the details easier to follow.",
      },
      {
        icon: Search,
        title: "Explore your curiosity",
        description: "Discover something beyond the day’s biggest headlines.",
      },
    ],
  },
  {
    id: "trax",
    layout: "split",
    name: "Trax",
    verb: "Listen",
    icon: AudioLines,
    tag: "Trax · Listen",
    title: ["Your eyes can take a break.", "Your curiosity doesn’t have to."],
    description:
      "Make room for an audio explainer on your commute, your walk or while you get things done.",
    cta: { label: "Listen to Trax", href: "/formats/trax" },
    mediaClassName: "bg-placeholder",
    features: [
      {
        icon: Headphones,
        title: "Press play and settle in",
        description: "Give an interesting subject a little more attention.",
      },
      {
        icon: Layers,
        title: "Follow the details",
        description: "Listen as complex ideas unfold step by step.",
      },
      {
        icon: Route,
        title: "Take the story with you",
        description: "Fit learning into the moments already in your day.",
      },
    ],
  },
  {
    id: "xplaind",
    layout: "wide",
    name: "Xplaind",
    verb: "Understand",
    icon: Lightbulb,
    tag: "Xplaind · Understand",
    title: ["The headline started it.", "Here’s the rest of the story."],
    description:
      "Explore the background, connections and questions that help a topic make sense.",
    cta: { label: "Explore Xplaind", href: "/formats/xplaind" },
    mediaClassName: "bg-placeholder",
    features: [
      {
        icon: Lightbulb,
        title: "Start with the basics",
        description: "Get familiar with the people, events and ideas involved.",
      },
      {
        icon: Network,
        title: "Connect the dots",
        description: "Understand how the pieces relate to one another.",
      },
      {
        icon: Sparkles,
        title: "See why it matters",
        description: "Explore what the bigger picture could mean.",
      },
    ],
  },
]
