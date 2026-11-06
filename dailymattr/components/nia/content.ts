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
  /** NIA's canned reply, shown in the chat panel once the question is sent. */
  answer: string
}

/** The message NIA greets with before any question is sent. */
export const howItWorksGreeting =
  "Hi, I'm NIA. Pick a question on the left and I'll walk you through today's story."

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: "01",
    question: "What happened?",
    answer:
      "Reports surfaced overnight of new strikes in the region. Officials haven't confirmed details yet, so treat early numbers and claims with caution.",
  },
  {
    number: "02",
    question: "Why does it matter?",
    answer:
      "Any escalation can ripple outward: oil prices, shipping routes, and diplomatic ties between major powers all react quickly to moves like this.",
  },
  {
    number: "03",
    question: "How did we get here?",
    answer:
      "Tensions have been building for months through sanctions, proxy conflicts, and stalled talks. This is the latest step in a long chain of events.",
  },
  {
    number: "04",
    question: "What should I understand next?",
    answer:
      "Watch for official statements, independent verification from trusted outlets, and how neighbouring countries respond over the next 48 hours.",
  },
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
