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

/** Original story photos in the dailymattr media bucket (served through next/image). */
const media = (path: string) =>
  `https://coggfnbqqyiqfsxvtaym.supabase.co/storage/v1/object/public/pix-media/${path}.png`

export const editionDate = "19 November 2026"

export const editions: Edition[] = [
  {
    slug: "ms-dhoni-retires-from-ipl",
    category: "Sports",
    date: "17 November 2026",
    headline: "MS Dhoni retires from IPL at 45, set to become CSK mentor in 2027",
    shareHeadline: "MS Dhoni retires from IPL at 45",
    dek: "Chennai Super Kings announced on Tuesday that MS Dhoni has retired from the IPL at 45. He missed the whole IPL 2026 season and will return to CSK as its mentor for 2027.",
    image: {
      src: media("b239e43f-dcc4-4b54-b77e-905aa2e5c488/12395280-f4eb-462c-bbf1-901e9bd0884c"),
      alt: "MS Dhoni in his yellow Chennai Super Kings kit, looking up during an IPL match",
      width: 720,
      height: 1332,
      focus: "50% 22%",
    },
    facts: [
      { num: "5", text: "IPL titles Dhoni won as captain of Chennai Super Kings.", source: "Indian Express" },
      {
        num: "133/226",
        text: "Wins and matches as CSK captain. No IPL skipper has led in more matches.",
        source: "Indian Express",
      },
      {
        num: "₹201 cr",
        text: "Roughly what Dhoni earned in IPL contracts from 2008 to 2026 (₹200.72 crore).",
        source: "Free Press Journal",
      },
      {
        num: "₹4 cr",
        text: "His IPL salary in 2025, down from ₹15 crore a season in 2018 to 2021.",
        source: "Free Press Journal",
      },
    ],
    sources: ["Indian Express", "Free Press Journal", "News18", "Swap Update"],
    storyUrl: "https://www.dailymattr.com/news/ms-dhoni-retires-from-ipl-at-45-set-to-become-csk-mentor-in-2027-19777",
    takeaway:
      "Dhoni is done as an IPL player, not as a CSK figure. After five titles and a record 226 matches as captain, he moves into a mentor's role from 2027.",
    questions: [
      {
        lensLabel: "The titles",
        text: "How many IPL titles did Dhoni win as CSK captain?",
        options: [
          { text: "Four", aw: 2, lens: "skeptic", note: "Close. Dhoni led Chennai Super Kings to five IPL titles." },
          { text: "Five", aw: 3, lens: "data", note: "Right. Dhoni led Chennai Super Kings to five IPL titles." },
          { text: "Six", aw: 1, lens: "optimist", note: "One too many. Dhoni won five IPL titles as CSK captain." },
          { text: "Seven", aw: 0, lens: "systems", note: "Fewer than that. Dhoni won five IPL titles as CSK captain." },
        ],
      },
      {
        lensLabel: "What's next",
        text: "What role will Dhoni take at CSK in 2027?",
        options: [
          {
            text: "Head coach",
            aw: 1,
            lens: "systems",
            note: "Not head coach. He returns to Chennai Super Kings as mentor for the 2027 season.",
          },
          {
            text: "Captain",
            aw: 0,
            lens: "optimist",
            note: "He has retired as a player, so he won't captain. He returns as CSK's mentor for 2027.",
          },
          {
            text: "Team director",
            aw: 1,
            lens: "skeptic",
            note: "Not a director's role. He returns to Chennai Super Kings as mentor for the 2027 season.",
          },
          {
            text: "Mentor",
            aw: 3,
            lens: "data",
            note: "Right. After retiring as a player, he returns to Chennai Super Kings as mentor for 2027.",
          },
        ],
      },
      {
        lensLabel: "The record",
        text: "In how many IPL matches did Dhoni captain CSK?",
        options: [
          {
            text: "133",
            aw: 2,
            lens: "optimist",
            note: "133 is how many he won. He captained CSK in 226 matches, more than any other IPL captain.",
          },
          {
            text: "180",
            aw: 1,
            lens: "skeptic",
            note: "More than that. He captained CSK in 226 matches, more than any other IPL captain.",
          },
          {
            text: "226",
            aw: 3,
            lens: "data",
            note: "Right. 226 matches as captain, with 133 wins. No IPL captain has led in more matches.",
          },
          {
            text: "250",
            aw: 1,
            lens: "systems",
            note: "Fewer than that. He captained CSK in 226 matches and won 133 of them.",
          },
        ],
      },
    ],
  },
  {
    slug: "anthropic-record-ipo",
    category: "Technology",
    date: "19 November 2026",
    headline: "Anthropic raises $81.3 billion in record IPO, surpasses SpaceX with $1.5 trillion valuation",
    shareHeadline: "Anthropic raises $81.3 billion in record IPO",
    dek: "Anthropic, the company behind Claude AI, raised $81.3 billion in its stock-market debut. At a $1.5 trillion valuation it passes SpaceX's previous record for the largest listing.",
    image: {
      src: media("1c563893-81ed-4d5f-b975-bd16c7f4c912/155e4767-319f-49f4-b326-5d61d2ab4fba"),
      alt: "A phone showing the Anthropic logo, resting on a laptop keyboard lit in purple",
      width: 720,
      height: 1080,
      focus: "50% 35%",
    },
    facts: [
      { num: "$81.3 bn", text: "Raised through the IPO itself.", source: "Hindustan Times" },
      {
        num: "$1.5 tn",
        text: "Anthropic's valuation at listing, above SpaceX's previous record for a stock-market debut.",
        source: "Hindustan Times",
      },
      { num: "$83", text: "Price per share, above the initial target range of $70–$78.", source: "Hindustan Times" },
      {
        num: "$107.3 bn",
        text: "Total deal size, including a separate $26 billion private placement.",
        source: "Hindustan Times",
      },
    ],
    sources: ["Hindustan Times"],
    storyUrl: "https://www.dailymattr.com/news/anthropic-raises-81-3-billion-in-record-ipo-surpasses-spacex-with-1-5-trillion-20025",
    takeaway:
      "Anthropic's debut set a new record: a $1.5 trillion valuation, above SpaceX's. The IPO raised $81.3 billion; a separate $26 billion private placement takes the whole deal to $107.3 billion.",
    questions: [
      {
        lensLabel: "The money",
        text: "How much did Anthropic raise through its IPO?",
        options: [
          {
            text: "$1.5 trillion",
            aw: 0,
            lens: "optimist",
            note: "That's the company's valuation. The IPO itself raised $81.3 billion.",
          },
          {
            text: "$107.3 billion",
            aw: 2,
            lens: "systems",
            note: "That's the whole deal, which includes a separate $26 billion private placement. The IPO raised $81.3 billion.",
          },
          {
            text: "$81.3 billion",
            aw: 3,
            lens: "data",
            note: "Right. The IPO raised $81.3 billion, and a separate $26 billion private placement took the deal to $107.3 billion.",
          },
          {
            text: "$26 billion",
            aw: 1,
            lens: "skeptic",
            note: "That's the separate private placement. The IPO itself raised $81.3 billion.",
          },
        ],
      },
      {
        lensLabel: "The record",
        text: "Whose record for the largest stock-market debut did Anthropic beat?",
        options: [
          {
            text: "SpaceX",
            aw: 3,
            lens: "data",
            note: "Right. At a $1.5 trillion valuation, Anthropic passed SpaceX's previous record.",
          },
          {
            text: "OpenAI",
            aw: 1,
            lens: "optimist",
            note: "Not OpenAI. The previous record for the largest stock-market debut was SpaceX's.",
          },
          {
            text: "Saudi Aramco",
            aw: 1,
            lens: "skeptic",
            note: "Not Aramco. The record Anthropic beat was SpaceX's.",
          },
          {
            text: "Alibaba",
            aw: 1,
            lens: "systems",
            note: "Not Alibaba. The record Anthropic beat was SpaceX's.",
          },
        ],
      },
      {
        lensLabel: "The share price",
        text: "At what price were Anthropic's shares sold in the IPO?",
        options: [
          {
            text: "$78",
            aw: 2,
            lens: "skeptic",
            note: "That's the top of the target range. The shares sold above it, at $83.",
          },
          {
            text: "$83",
            aw: 3,
            lens: "data",
            note: "Right. $83 a share, above the initial target range of $70–$78.",
          },
          { text: "$90", aw: 1, lens: "optimist", note: "Lower than that. The shares sold at $83." },
          { text: "$95", aw: 0, lens: "systems", note: "Lower than that. The shares sold at $83, above the $70–$78 range." },
        ],
      },
    ],
  },
  {
    slug: "epfo-pf-withdrawal-rules",
    category: "Business",
    date: "19 November 2026",
    headline: "EPFO makes PF withdrawals easier, cuts mandatory balance from 25% to 10%",
    shareHeadline: "EPFO cuts mandatory PF balance from 25% to 10%",
    dek: "The Employees' Provident Fund Organisation has approved a proposal to lower the balance members must keep in their PF account. Its board also cut the wait to withdraw after losing a job.",
    image: {
      src: media("1c563893-81ed-4d5f-b975-bd16c7f4c912/1e4850e1-ff03-4f0f-ad65-50b033aa2b54"),
      alt: "A man at a home desk checking his phone, with a laptop and printed documents in front of him",
      width: 720,
      height: 1080,
      focus: "60% 40%",
    },
    facts: [
      { num: "25% → 10%", text: "Minimum PF balance members must keep, before and after.", source: "Livemint" },
      {
        num: "90%",
        text: "Share of eligible PF savings employees can withdraw, subject to withdrawal rules.",
        source: "Livemint",
      },
      { num: "12 → 2", text: "Months out of work before you can withdraw your PF.", source: "Livemint" },
      {
        num: "Monthly",
        text: "Retired employees may soon get PF savings in instalments, not one lump sum.",
        source: "Livemint",
      },
    ],
    sources: ["Livemint"],
    storyUrl: "https://www.dailymattr.com/news/epfo-makes-pf-withdrawals-easier-cuts-mandatory-balance-from-25-percent-to-10-20015",
    takeaway:
      "You can reach more of your PF, and sooner: only 10% has to stay in the account, and the wait after losing a job drops from 12 months to two. EPFO's withdrawal rules still apply.",
    questions: [
      {
        lensLabel: "The new rule",
        text: "What is the new minimum balance members must keep in their PF account?",
        options: [
          { text: "10%", aw: 3, lens: "data", note: "Right. The minimum balance drops from 25% to 10%." },
          { text: "15%", aw: 1, lens: "systems", note: "Lower than that. The minimum balance is now 10%, down from 25%." },
          { text: "20%", aw: 1, lens: "optimist", note: "Lower than that. The minimum balance is now 10%, down from 25%." },
          { text: "25%", aw: 1, lens: "skeptic", note: "25% was the old minimum. It's now 10%." },
        ],
      },
      {
        lensLabel: "The numbers",
        text: "How much of their eligible PF savings can employees now withdraw?",
        options: [
          {
            text: "Up to 75%",
            aw: 1,
            lens: "skeptic",
            note: "That was the limit when 25% had to stay. With the minimum now 10%, it's up to 90%.",
          },
          { text: "Up to 80%", aw: 1, lens: "systems", note: "More than that. Employees can now withdraw up to 90%." },
          {
            text: "Up to 90%",
            aw: 3,
            lens: "data",
            note: "Right. Up to 90% of eligible savings, subject to EPFO's withdrawal rules.",
          },
          {
            text: "All of it",
            aw: 0,
            lens: "optimist",
            note: "Not all of it. 10% has to stay in the account, so the limit is up to 90%.",
          },
        ],
      },
      {
        lensLabel: "The waiting time",
        text: "After losing a job, how soon can someone now withdraw their PF?",
        options: [
          {
            text: "Right away",
            aw: 0,
            lens: "optimist",
            note: "There's still a wait, but a short one: two months, down from 12.",
          },
          {
            text: "After 2 months",
            aw: 3,
            lens: "data",
            note: "Right. EPFO's board cut the wait after losing a job from 12 months to two.",
          },
          { text: "After 6 months", aw: 1, lens: "systems", note: "Sooner than that: after two months, down from 12." },
          { text: "After 12 months", aw: 1, lens: "skeptic", note: "That was the old rule. The wait is now two months." },
        ],
      },
    ],
  },
  {
    slug: "trump-xi-putin-peace-declaration",
    category: "World",
    date: "19 November 2026",
    headline: "Trump, Xi and Putin issue 'peace declaration', pledge nuclear risk talks and energy cooperation",
    shareHeadline: "Trump, Xi and Putin issue a 'peace declaration'",
    dek: "The US, China and Russia issued a joint declaration after their first-ever three-way summit, held in Shenzhen. It covers energy, nuclear risk and UN reform, but not the war in Ukraine.",
    image: {
      src: media("1c563893-81ed-4d5f-b975-bd16c7f4c912/fef7ec2b-7500-4ab3-a049-6f206a6f7d1c"),
      alt: "Three leaders standing together in a marble hall in front of US, Chinese and Russian flags",
      width: 720,
      height: 1080,
      focus: "50% 45%",
    },
    facts: [
      {
        num: "1st",
        text: "Three-way summit of the US, China and Russia, held in Shenzhen on the sidelines of the APEC forum.",
        source: "Hindustan Times",
      },
      {
        num: "Energy",
        text: "The leaders pledged to boost petroleum production and supplies for stable global energy flows.",
        source: "Hindustan Times",
      },
      {
        num: "Nuclear",
        text: "They agreed to hold talks on reducing nuclear risks and stopping the spread of nuclear weapons.",
        source: "Hindustan Times",
      },
      {
        num: "Ukraine",
        text: "Not mentioned in the declaration, though the talks were expected to cover it.",
        source: "Hindustan Times · Moneycontrol",
      },
    ],
    sources: ["Hindustan Times", "Moneycontrol", "Times of India"],
    storyUrl: "https://www.dailymattr.com/news/trump-xi-and-putin-issue-peace-declaration-pledge-nuclear-risk-talks-and-energy-20027",
    takeaway:
      "The 'peace declaration' commits the three powers to nuclear-risk talks, steadier energy supplies and UN reform. It says nothing about Russia's war in Ukraine.",
    questions: [
      {
        lensLabel: "The summit",
        text: "In which city did Trump, Xi and Putin hold their summit?",
        options: [
          { text: "Beijing", aw: 1, lens: "optimist", note: "Not Beijing. The summit was held in Shenzhen, on the sidelines of the APEC forum." },
          { text: "Moscow", aw: 0, lens: "skeptic", note: "It was in China, in Shenzhen, on the sidelines of the APEC forum." },
          { text: "Shanghai", aw: 1, lens: "systems", note: "Not Shanghai. The summit was held in Shenzhen, on the sidelines of the APEC forum." },
          {
            text: "Shenzhen",
            aw: 3,
            lens: "data",
            note: "Right. Shenzhen hosted the first-ever three-way summit of the US, China and Russia.",
          },
        ],
      },
      {
        lensLabel: "The agreement",
        text: "What did the three leaders agree on nuclear weapons?",
        options: [
          {
            text: "A full ban on nuclear weapons",
            aw: 1,
            lens: "optimist",
            note: "A full ban was Xi's own call at the meeting. The joint declaration agrees to talks on reducing nuclear risks.",
          },
          {
            text: "Talks on reducing nuclear risks",
            aw: 3,
            lens: "data",
            note: "Right. They agreed to talks on reducing nuclear risks and stopping the spread of nuclear weapons.",
          },
          {
            text: "Cuts to their nuclear arsenals",
            aw: 0,
            lens: "systems",
            note: "No cuts were agreed. The leaders agreed to talks on reducing nuclear risks.",
          },
          {
            text: "Nothing on nuclear weapons",
            aw: 0,
            lens: "skeptic",
            note: "Nuclear weapons are in the declaration: the leaders agreed to talks on reducing nuclear risks.",
          },
        ],
      },
      {
        lensLabel: "What's missing",
        text: "Which of these does the declaration not mention?",
        options: [
          {
            text: "Energy supplies",
            aw: 0,
            lens: "optimist",
            note: "Energy is in it: a pledge to boost petroleum production and supplies. It's the war in Ukraine that's left out.",
          },
          {
            text: "UN reform",
            aw: 1,
            lens: "skeptic",
            note: "UN reform is in it. It's the war in Ukraine that's left out.",
          },
          {
            text: "The war in Ukraine",
            aw: 3,
            lens: "systems",
            note: "Right. The declaration covers energy, nuclear risk and UN reform, but not Russia's war in Ukraine.",
          },
          {
            text: "Nuclear risk",
            aw: 1,
            lens: "data",
            note: "Nuclear risk is in it, as talks on reducing it. It's the war in Ukraine that's left out.",
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
