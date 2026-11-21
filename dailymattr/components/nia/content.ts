/** Copy and data for the NIA page. Figma frame: "NIA · DailyMattr" (8856:9052). */

export type HeroChatTurn = {
  id: string
  question: string
  /** NIA's canned reply: an opening line, then optional bullets (a `label` renders bold). */
  reply: {
    intro: string
    bullets?: { id: string; label?: string; text: string }[]
  }
}

export const heroChat: {
  title: string
  placeholder: string
  welcome: { title: string; body: string }
  turns: HeroChatTurn[]
} = {
  title: "NIA - Your AI Assistant",
  placeholder: "Ask NIA...",
  // Centred in the empty chat until the first question is sent.
  welcome: {
    title: "Hi, I'm NIA",
    body: "Ask about any story and I'll explain it, add context and help you connect the dots.",
  },
  // Asked in order, one per Enter: the opening question, then two of the app's follow-up chips.
  turns: [
    {
      id: "latest",
      question: "What is the latest news about Iran war?",
      reply: {
        intro: "Right now, this is still an unverified claim, so here's what we can expect next:",
        bullets: [
          {
            id: "confirmations",
            text: "Official confirmations or denials from Iran, the U.S., or international agencies",
          },
          { id: "verification", text: "Media verification from reliable global news sources" },
          { id: "diplomatic", text: "Diplomatic reactions from other countries" },
        ],
      },
    },
    {
      id: "eli5",
      question: "Explain like I'm 5",
      reply: {
        intro:
          "Imagine two neighbours who have argued for a long time. Someone says one of them did something big, but no grown-up has checked yet. So everyone is waiting to find out what really happened.",
      },
    },
    {
      id: "sides",
      question: "Show me opposite sides",
      reply: {
        intro: "Here's how each side sees it:",
        bullets: [
          {
            id: "iran",
            label: "Iran",
            text: "It is defending its sovereignty and responding to threats",
          },
          {
            id: "israel-us",
            label: "Israel and the U.S.",
            text: "Iran and its allies are a threat to security in the region",
          },
        ],
      },
    },
  ],
}

export type HowItWorksStep = {
  number: string
  question: string
  /** NIA's canned reply, shown in the chat panel once the question is sent. */
  answer: string
}

/** The message NIA greets with before any question is sent. */
/** Centred intro shown in the empty chat panel before the first question is sent. */
export const howItWorksIntro = {
  title: "What would you like to understand?",
  body: "Start with the first question and NIA will build the story with you, one step at a time.",
}


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
