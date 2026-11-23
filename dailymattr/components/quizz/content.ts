/**
 * News IQ editions: one per story the reader can pick on /quizz. Each is taken from a dailymattr
 * story (and the related stories it links to) and gets its own page at /quizz/<slug>. Add,
 * remove or reorder entries in `editions` and the picker, routes, metadata and sitemap follow.
 *
 * Questions test what the reader knows about the story's topic, not how it was reported.
 * Medium difficulty: each question asks one straightforward fact from the brief, with short,
 * direct options. The wrong options are other real figures or facts from the same story, so
 * they are close enough to make the reader think. The right answer's position varies.
 *
 * Each option carries:
 *   aw   closeness to the facts, 0 to 3
 *   lens the thinking style the answer reflects
 *   note the right answer explained (shown with the result, never as "wrong")
 */

export type LensKey = "data" | "systems" | "skeptic" | "optimist"

export type Fact = { num: string; text: string; source: string }

export type QuizOption = { text: string; aw: 0 | 1 | 2 | 3; lens: LensKey; note: string }

export type Question = {
  /** What the question tests, shown beside the progress count. */
  lensLabel: string
  text: string
  options: QuizOption[]
}

export type Edition = {
  /** URL segment: the quiz lives at /quizz/<slug>. */
  slug: string
  category: string
  /** Date of the dailymattr story. */
  date: string
  headline: string
  /** Shorter headline for the copied result. */
  shareHeadline: string
  dek: string
  image: { src: string; alt: string; width: number; height: number; /** CSS object-position for crops */ focus: string }
  facts: Fact[]
  sources: string[]
  /** The dailymattr story this edition is built from. */
  storyUrl: string
  takeaway: string
  questions: Question[]
}

/**
 * Story photos, cropped to 4:5 above the headline the dailymattr story image has printed on it,
 * and kept in public/quizz.
 */
const photo = (name: string) => `/quizz/${name}.webp`

export const editionDate = "23 November 2026"

export const editions: Edition[] = [
  {
    slug: "tilak-varma-asia-cup-final",
    category: "Sports",
    date: "23 November 2026",
    headline: "Tilak breaks silence after Pakistan defeat: ‘I could have finished the game’",
    shareHeadline: "Tilak Varma on the Asia Cup final defeat",
    dek: "Tilak Varma made 48 in the Asia Cup final, but India lost to Pakistan by 5 wickets. He says he should have finished the match himself instead of leaving it to the lower-order batters.",
    image: {
      src: photo("tilak-varma-asia-cup"),
      alt: "Two India batters in blue kit touch gloves in the middle during a match",
      width: 1080,
      height: 1350,
      focus: "50% 40%",
    },
    facts: [
      { num: "48", text: "Runs Tilak Varma scored in the Asia Cup final.", source: "Times of India" },
      {
        num: "5 wkts",
        text: "Pakistan's winning margin in the final, which gave them the Asia Cup title.",
        source: "Times of India",
      },
      {
        num: "Lower order",
        text: "Who Tilak says he left the job to, when he should have finished the match himself.",
        source: "Times of India",
      },
    ],
    sources: ["Times of India"],
    storyUrl: "https://www.dailymattr.com/news/tilak-breaks-silence-after-pakistan-defeat-i-could-have-finished-the-game-20484",
    takeaway:
      "Pakistan beat India by 5 wickets to win the Asia Cup. Tilak Varma made 48, and says he should have finished the match himself rather than leave it to the lower order.",
    questions: [
      {
        lensLabel: "The innings",
        text: "How many runs did Tilak Varma score in the final?",
        options: [
          { text: "38", aw: 2, lens: "skeptic", note: "Close. Tilak Varma made 48 in the Asia Cup final." },
          { text: "48", aw: 3, lens: "data", note: "Right. Tilak Varma made 48, but India still lost the final." },
          { text: "68", aw: 1, lens: "optimist", note: "Fewer than that. Tilak Varma made 48 in the final." },
          { text: "A century", aw: 0, lens: "systems", note: "No century in the final. Tilak Varma made 48." },
        ],
      },
      {
        lensLabel: "The result",
        text: "By what margin did Pakistan win the final?",
        options: [
          {
            text: "5 runs",
            aw: 2,
            lens: "skeptic",
            note: "Close, but Pakistan won by wickets, not runs: 5 wickets.",
          },
          {
            text: "48 runs",
            aw: 1,
            lens: "optimist",
            note: "48 is Tilak Varma's score. Pakistan won the final by 5 wickets.",
          },
          {
            text: "5 wickets",
            aw: 3,
            lens: "data",
            note: "Right. Pakistan won by 5 wickets to take the Asia Cup title.",
          },
          {
            text: "In a Super Over",
            aw: 0,
            lens: "systems",
            note: "There was no Super Over. Pakistan won the final by 5 wickets.",
          },
        ],
      },
      {
        lensLabel: "The regret",
        text: "What does Tilak say he should have done?",
        options: [
          {
            text: "Batted higher up the order",
            aw: 0,
            lens: "skeptic",
            note: "Not his batting position. He says he should have finished the match himself.",
          },
          {
            text: "Left it to the lower order",
            aw: 1,
            lens: "systems",
            note: "That's what he regrets doing. He says he should have finished the match himself instead.",
          },
          {
            text: "Attacked earlier in his innings",
            aw: 1,
            lens: "optimist",
            note: "Not that. He says he should have finished the match himself, not left it to the lower order.",
          },
          {
            text: "Finished the match himself",
            aw: 3,
            lens: "data",
            note: "Right. He says he should have finished it instead of leaving it to the lower-order batters.",
          },
        ],
      },
    ],
  },
  {
    slug: "tata-steel-apl-apollo-stake",
    category: "Business",
    date: "23 November 2026",
    headline: "Tata Steel to acquire 26.38% stake in APL Apollo for ₹15,511 crore, makes ₹16,756-crore open offer",
    shareHeadline: "Tata Steel to buy 26.38% of APL Apollo",
    dek: "Tata Steel will buy 26.38% of APL Apollo Tubes from its promoter group for ₹15,511 crore, and make a ₹16,756 crore open offer for another 26% from public shareholders.",
    image: {
      src: photo("tata-steel-apl-apollo"),
      alt: "Two executives shake hands in front of Tata Steel and APL Apollo banners",
      width: 1080,
      height: 1350,
      focus: "50% 55%",
    },
    facts: [
      {
        num: "26.38%",
        text: "Stake Tata Steel is buying from APL Apollo's promoter group, for ₹15,511 crore.",
        source: "Moneycontrol",
      },
      {
        num: "₹2,100",
        text: "Price per share for the 7.39 crore promoter shares, bought in three tranches.",
        source: "Moneycontrol",
      },
      {
        num: "₹16,756 cr",
        text: "Cost of the open offer for 26% more from public shareholders, at ₹2,301.40 a share.",
        source: "Moneycontrol",
      },
      {
        num: "52.38%",
        text: "Tata Steel's holding if the open offer is fully subscribed, making it APL Apollo's promoter.",
        source: "Moneycontrol",
      },
    ],
    sources: ["Moneycontrol"],
    storyUrl: "https://www.dailymattr.com/news/tata-steel-to-acquire-26-38-percent-stake-in-apl-apollo-for-rs-15-511-crore-20457",
    takeaway:
      "Tata Steel is buying 26.38% of APL Apollo Tubes from its promoters for ₹15,511 crore and offering ₹16,756 crore for 26% more from the public. If both go through, it holds 52.38% and becomes the promoter.",
    questions: [
      {
        lensLabel: "The stake",
        text: "What stake is Tata Steel buying from APL Apollo's promoter group?",
        options: [
          {
            text: "26%",
            aw: 2,
            lens: "skeptic",
            note: "26% is the open offer to public shareholders. From the promoter group it's buying 26.38%.",
          },
          {
            text: "52.38%",
            aw: 1,
            lens: "optimist",
            note: "That's the most it could hold if the open offer is fully subscribed. The promoter stake is 26.38%.",
          },
          {
            text: "26.38%",
            aw: 3,
            lens: "data",
            note: "Right. It's buying 26.38% from the promoter group, then offering to buy 26% more from the public.",
          },
          {
            text: "51%",
            aw: 0,
            lens: "systems",
            note: "Less than that. Tata Steel is buying 26.38% from the promoter group.",
          },
        ],
      },
      {
        lensLabel: "The price",
        text: "How much will Tata Steel pay the promoter group for that stake?",
        options: [
          {
            text: "₹16,756 crore",
            aw: 1,
            lens: "systems",
            note: "That's the cost of the open offer to the public. The promoter stake costs ₹15,511 crore.",
          },
          {
            text: "₹15,511 crore",
            aw: 3,
            lens: "data",
            note: "Right. ₹15,511 crore for 7.39 crore shares at ₹2,100 each, in three tranches.",
          },
          {
            text: "₹2,100 crore",
            aw: 0,
            lens: "optimist",
            note: "₹2,100 is the price per share. The whole promoter stake costs ₹15,511 crore.",
          },
          {
            text: "₹32,267 crore",
            aw: 1,
            lens: "skeptic",
            note: "That's both deals added together. The promoter stake alone costs ₹15,511 crore.",
          },
        ],
      },
      {
        lensLabel: "The control",
        text: "If the open offer is fully subscribed, what could Tata Steel's holding rise to?",
        options: [
          {
            text: "26.38%",
            aw: 1,
            lens: "skeptic",
            note: "That's the promoter stake alone. With the open offer fully subscribed, it rises to 52.38%.",
          },
          {
            text: "51%",
            aw: 2,
            lens: "systems",
            note: "Just over half, yes, but the exact figure is 52.38%, which would make Tata Steel the promoter.",
          },
          {
            text: "74%",
            aw: 0,
            lens: "optimist",
            note: "Less than that. 26.38% plus a fully subscribed 26% open offer comes to 52.38%.",
          },
          {
            text: "52.38%",
            aw: 3,
            lens: "data",
            note: "Right. 26.38% plus 26% from the open offer is 52.38%, making Tata Steel APL Apollo's promoter.",
          },
        ],
      },
    ],
  },
  {
    slug: "modi-nepal-flood-aid",
    category: "World",
    date: "23 November 2026",
    headline: "PM Modi announces Rs 24,000 crore aid for Nepal to support flood-hit families",
    shareHeadline: "PM Modi announces aid for Nepal",
    dek: "PM Modi announced a development assistance package of 24,000 crore Nepali rupees after talks with Nepal PM Balen Shah, on his first bilateral visit to India. The aid will help flood-hit families rebuild.",
    image: {
      src: photo("modi-nepal-aid"),
      alt: "PM Modi stands beside Nepal PM Balen Shah in front of a wall of flowers",
      width: 1080,
      height: 1350,
      focus: "50% 25%",
    },
    facts: [
      {
        num: "NPR 24,000 cr",
        text: "The development assistance package India announced for Nepal, in Nepali rupees.",
        source: "Moneycontrol",
      },
      { num: "≈ ₹15,000 cr", text: "The same package in Indian rupees.", source: "Moneycontrol" },
      {
        num: "1st",
        text: "Balen Shah's first bilateral visit to India as Nepal's prime minister, when the talks took place.",
        source: "Moneycontrol",
      },
    ],
    sources: ["Moneycontrol"],
    storyUrl: "https://www.dailymattr.com/news/pm-modi-announces-rs-24-000-crore-aid-for-nepal-to-support-flood-hit-families-20500",
    takeaway:
      "India is giving Nepal 24,000 crore Nepali rupees (about ₹15,000 crore) to help flood-hit families rebuild and prepare for future disasters, announced after Modi's talks with Nepal PM Balen Shah.",
    questions: [
      {
        lensLabel: "The money",
        text: "How big is the package India announced for Nepal?",
        options: [
          {
            text: "24,000 crore Indian rupees",
            aw: 2,
            lens: "skeptic",
            note: "Close, but it's 24,000 crore Nepali rupees, about ₹15,000 crore in Indian rupees.",
          },
          {
            text: "15,000 crore Nepali rupees",
            aw: 1,
            lens: "systems",
            note: "₹15,000 crore is roughly the package in Indian rupees. In Nepali rupees it's 24,000 crore.",
          },
          {
            text: "24,000 crore Nepali rupees",
            aw: 3,
            lens: "data",
            note: "Right. 24,000 crore Nepali rupees, which is about ₹15,000 crore in Indian rupees.",
          },
          {
            text: "2,400 crore Nepali rupees",
            aw: 0,
            lens: "optimist",
            note: "Ten times that. The package is 24,000 crore Nepali rupees.",
          },
        ],
      },
      {
        lensLabel: "The talks",
        text: "Who did Modi hold talks with before announcing the package?",
        options: [
          {
            text: "Nepal PM Balen Shah",
            aw: 3,
            lens: "data",
            note: "Right. The package followed talks with Balen Shah on his first bilateral visit to India.",
          },
          {
            text: "Nepal's President",
            aw: 1,
            lens: "skeptic",
            note: "Not the President. Modi held talks with Nepal PM Balen Shah, on his first bilateral visit to India.",
          },
          {
            text: "Nepal's Foreign Minister",
            aw: 1,
            lens: "systems",
            note: "The talks were at the top: Modi met Nepal PM Balen Shah on his first bilateral visit to India.",
          },
          {
            text: "Nepal's Army chief",
            aw: 0,
            lens: "optimist",
            note: "Not the army. Modi held talks with Nepal PM Balen Shah.",
          },
        ],
      },
      {
        lensLabel: "The purpose",
        text: "What is the aid meant to do?",
        options: [
          {
            text: "Build a new rail link",
            aw: 1,
            lens: "systems",
            note: "Not rail. The aid is to help flood-hit families rebuild and prepare Nepal for future disasters.",
          },
          {
            text: "Help flood-hit families rebuild",
            aw: 3,
            lens: "data",
            note: "Right. It helps flood-hit families rebuild their lives and prepares Nepal for future disasters.",
          },
          {
            text: "Fund new power projects",
            aw: 1,
            lens: "skeptic",
            note: "Not power. The aid is for flood-hit families and for preparing Nepal for future disasters.",
          },
          {
            text: "Pay off Nepal's loans",
            aw: 0,
            lens: "optimist",
            note: "Not debt. It's to help flood-hit families rebuild and prepare Nepal for future disasters.",
          },
        ],
      },
    ],
  },
  {
    slug: "cop31-climate-talks-collapse",
    category: "World",
    date: "22 November 2026",
    headline: "UN climate talks collapse as nations reject deal over fossil fuels and climate finance",
    shareHeadline: "UN climate talks at COP31 collapse",
    dek: "The UN climate talks at COP31 in Turkey ended without a final agreement. The European Union and several nations rejected the draft deal because it did not explicitly mention fossil fuels.",
    image: {
      src: photo("cop31-climate-talks"),
      alt: "The United Nations emblem on a gold wall",
      width: 1080,
      height: 1350,
      focus: "50% 45%",
    },
    facts: [
      { num: "COP31", text: "The UN climate talks, held in Turkey, ended without a final agreement.", source: "NDTV Profit" },
      {
        num: "EU",
        text: "The European Union and several nations rejected the draft for not explicitly naming fossil fuels.",
        source: "NDTV Profit",
      },
      {
        num: "3",
        text: "Sticking points: climate finance, carbon capture and the transition away from fossil fuels.",
        source: "NDTV Profit",
      },
    ],
    sources: ["NDTV Profit"],
    storyUrl: "https://www.dailymattr.com/news/un-climate-talks-collapse-as-nations-reject-deal-over-fossil-fuels-and-climate-20413",
    takeaway:
      "COP31 in Turkey ended with no final agreement. The EU and several nations rejected the draft for not explicitly mentioning fossil fuels, and talks also stalled on climate finance and carbon capture.",
    questions: [
      {
        lensLabel: "The venue",
        text: "Where were the COP31 climate talks held?",
        options: [
          { text: "Brazil", aw: 1, lens: "skeptic", note: "Not Brazil. COP31 was held in Turkey." },
          { text: "Turkey", aw: 3, lens: "data", note: "Right. COP31 was held in Turkey and ended without a deal." },
          { text: "UAE", aw: 0, lens: "optimist", note: "Not the UAE. COP31 was held in Turkey." },
          { text: "Australia", aw: 1, lens: "systems", note: "Not Australia. COP31 was held in Turkey." },
        ],
      },
      {
        lensLabel: "The objection",
        text: "Why did the EU and several nations reject the draft deal?",
        options: [
          {
            text: "It asked them for too much money",
            aw: 1,
            lens: "skeptic",
            note: "Climate finance was disputed, but the EU's objection was that the draft didn't explicitly mention fossil fuels.",
          },
          {
            text: "It leaned too much on carbon capture",
            aw: 1,
            lens: "systems",
            note: "Carbon capture was a sticking point, but the rejection was over the draft not explicitly mentioning fossil fuels.",
          },
          {
            text: "Its targets were too strict",
            aw: 0,
            lens: "optimist",
            note: "The opposite. They rejected it for not explicitly mentioning fossil fuels.",
          },
          {
            text: "It didn't name fossil fuels",
            aw: 3,
            lens: "data",
            note: "Right. The EU and several nations rejected the draft for not explicitly mentioning fossil fuels.",
          },
        ],
      },
      {
        lensLabel: "The deadlock",
        text: "Which of these was not one of the issues that stalled the talks?",
        options: [
          {
            text: "Nuclear power",
            aw: 3,
            lens: "data",
            note: "Right. The talks stalled on climate finance, carbon capture and the move away from fossil fuels.",
          },
          {
            text: "Climate finance",
            aw: 1,
            lens: "systems",
            note: "Climate finance was one of them, with carbon capture and the move away from fossil fuels. Nuclear power wasn't.",
          },
          {
            text: "Carbon capture",
            aw: 1,
            lens: "skeptic",
            note: "Carbon capture was one of them, with climate finance and the move away from fossil fuels. Nuclear power wasn't.",
          },
          {
            text: "Moving away from fossil fuels",
            aw: 0,
            lens: "optimist",
            note: "That was the biggest one. The issues were fossil fuels, climate finance and carbon capture, not nuclear power.",
          },
        ],
      },
    ],
  },
]

export const QUIZ_HOME = "/quizz"

/** The quiz page for a story. */
export const quizPath = (slug: string) => `${QUIZ_HOME}/${slug}`

export const getEdition = (slug: string) => editions.find((e) => e.slug === slug)

/**
 * Thinking styles: how the reader's knowledge shows up in their picks. Told apart by label and
 * monogram, never by colour.
 */
export const lenses: Record<LensKey, { name: string; short: string; mono: string; desc: string }> = {
  data: {
    name: "The Data Detective",
    short: "Data Detective",
    mono: "DD",
    desc: "You remember the exact figures and what each one stands for. Numbers are where you shine.",
  },
  systems: {
    name: "The Big-Picture Thinker",
    short: "Big-Picture",
    mono: "BP",
    desc: "You know why the story matters and how its pieces connect. Locking in the exact figures will make you unbeatable.",
  },
  skeptic: {
    name: "The Careful Doubter",
    short: "Doubter",
    mono: "CD",
    desc: "When you're unsure, you lean towards the cautious answer. Pinning down the key facts will turn that caution into confidence.",
  },
  optimist: {
    name: "The Quick Thinker",
    short: "Quick Thinker",
    mono: "QT",
    desc: "You go with the answer that sounds right at first glance. Slowing down on the details will lift your score.",
  },
}

export const lensOrder: LensKey[] = ["data", "systems", "skeptic", "optimist"]

/** Result bands, highest first: how well the reader knows the story. */
export const bands = [
  {
    min: 89,
    name: "You're well aware",
    desc: "You know this story inside out: the numbers, the details and why they matter.",
  },
  {
    min: 56,
    name: "Mostly aware",
    desc: "You know the big picture. A couple of details tripped you up, and your answers below show which.",
  },
  {
    min: 23,
    name: "Partly aware",
    desc: "You know the gist, but some key facts slipped past you. Your answers below fill in the gaps.",
  },
  {
    min: 0,
    name: "Just catching up",
    desc: "This story was new to you. Your answers below get you up to speed in a minute.",
  },
] as const

export const intro = {
  /** The /quizz headline in parts; `accent` parts are set in brand blue. */
  title: [
    { text: "Take a quiz", accent: true },
    { text: " to see how well you know " },
    { text: "what mattrs", accent: true },
  ],
}
