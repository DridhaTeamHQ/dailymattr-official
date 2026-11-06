/** Copy and data for the NIA page. Figma frame: "NIA · DailyMattr" (8856:9052). */

export const heroChat = {
  title: "NIA - Your AI Assistant",
  question: "What is the latest news about Iran war?",
  intro: "Right now, this is still an unverified claim, so here's what we can expect next:",
  bullets: [
    {
      id: "confirmations",
      text: "Official confirmations or denials from Iran, the U.S., or international agencies",
      muted: false,
    },
    {
      id: "verification",
      // `highlight` renders as the blue chip in the design.
      lead: "Media verification from",
      highlight: "reliable",
      trail: "global news sources",
      muted: true,
    },
    {
      id: "diplomatic",
      text: "Diplomatic reactions from other countries",
      muted: true,
    },
  ],
  placeholder: "Ask NIA...",
}

export type HowItWorksStep = {
  number: string
  question: string
  /** "sent" rows are already answered; "active" is the next one to send. */
  state: "sent" | "active" | "idle"
}

export const howItWorksSteps: HowItWorksStep[] = [
  { number: "01", question: "What happened?", state: "sent" },
  { number: "02", question: "Why does it matter?", state: "sent" },
  { number: "03", question: "How did we get here?", state: "active" },
  { number: "04", question: "What should I understand next?", state: "idle" },
]

/** Reply skeleton bar widths, straight from the Figma mock. */
export const howItWorksThread = [
  { id: "what-happened", question: "What happened?", bars: [466.922, 428.016, 340.469] },
  { id: "why-matter", question: "Why does it matter?", bars: [447.469, 311.281] },
]

export const capabilities = [
  {
    id: "understand",
    icon: "/nia/card-understand.svg",
    title: "Understand the story.",
    description: "Get a straightforward explanation of the event and the facts behind it.",
  },
  {
    id: "context",
    icon: "/nia/card-context.svg",
    title: "Find the context.",
    description:
      "Explore the background, key people, and developments that help the story make sense.",
  },
  {
    id: "keep-asking",
    icon: "/nia/card-keep-asking.svg",
    title: "Keep asking.",
    description:
      "Move beyond the first answer with follow-up questions that take your understanding further.",
  },
]
