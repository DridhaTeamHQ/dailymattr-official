/**
 * News IQ editions: one per story the reader can pick on /quizz. Each is taken from a dailymattr
 * story (and the related stories it links to) and gets its own page at /quizz/<slug>. Add,
 * remove or reorder entries in `editions` and the picker, routes, metadata and sitemap follow.
 *
 * Questions are a quiz on the story itself (no "how would you report this" questions). Every
 * question has one answer that matches the reporting; the other options are believable
 * mix-ups of the story's own facts, and the right answer's position varies.
 *
 * Each option carries:
 *   aw   closeness to the reported facts, 0 to 3
 *   lens the thinking style the answer reflects
 *   note what the reporting says (shown in the report, never as "wrong")
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
        lensLabel: "Reading the number",
        text: "Dhoni's captaincy record reads 133 wins in 226 matches. What does the 226 count?",
        options: [
          {
            text: "IPL matches CSK won with him in the side, as captain or player",
            aw: 1,
            lens: "optimist",
            note: "The wins are the 133. The 226 counts matches he captained.",
          },
          {
            text: "All his IPL appearances, including seasons when someone else led CSK",
            aw: 2,
            lens: "systems",
            note: "Close, but it counts only matches as captain. That figure is a record for any IPL skipper.",
          },
          {
            text: "IPL matches he captained, the most by any skipper in the league",
            aw: 3,
            lens: "data",
            note: "Right. 226 matches as captain is the most by any IPL skipper, and he won 133 of them.",
          },
          {
            text: "T20 matches he captained across the IPL and for India",
            aw: 1,
            lens: "skeptic",
            note: "The figure is IPL only: 226 matches as Chennai Super Kings captain.",
          },
        ],
      },
      {
        lensLabel: "Following the money",
        text: "How did Dhoni's IPL salary change over his last seasons?",
        options: [
          {
            text: "₹12 crore a season in 2018–2021, ₹15 crore in 2022–2024, then ₹4 crore in 2025",
            aw: 1,
            lens: "skeptic",
            note: "Right numbers, wrong order. He earned ₹15 crore a season first, then ₹12 crore.",
          },
          {
            text: "₹15 crore a season in 2018–2021, ₹12 crore in 2022–2024, then ₹4 crore in 2025",
            aw: 3,
            lens: "data",
            note: "Exactly. His pay rose from ₹6.03 crore in 2008 to a ₹15 crore peak, then stepped down twice.",
          },
          {
            text: "₹15 crore a season through 2024, then ₹4 crore in 2025",
            aw: 2,
            lens: "systems",
            note: "Nearly. There was a step in between: ₹12 crore a season from 2022 to 2024.",
          },
          {
            text: "It held at ₹15 crore every season until he retired",
            aw: 0,
            lens: "optimist",
            note: "It fell twice: to ₹12 crore for 2022–2024 and to ₹4 crore in 2025.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "Why had R Ashwin suggested CSK release Dhoni before the IPL 2027 auction?",
        options: [
          {
            text: "So Dhoni could join another franchise for one final season",
            aw: 0,
            lens: "optimist",
            note: "Ashwin didn't suggest a move elsewhere. He said Dhoni could take a consultant or support-staff role at CSK.",
          },
          {
            text: "Because Dhoni's ₹4 crore alone would give CSK a ₹40–45 crore purse",
            aw: 1,
            lens: "skeptic",
            note: "₹4 crore is only part of it. Ashwin said releasing other players as well could build a ₹40–45 crore purse.",
          },
          {
            text: "To give a new captain a bigger auction budget to rebuild with",
            aw: 2,
            lens: "systems",
            note: "That's the wider aim, but his point was specific: releasing Dhoni frees ₹4 crore if he isn't playing in 2027.",
          },
          {
            text: "If he wasn't playing in 2027, releasing him would free ₹4 crore for the auction",
            aw: 3,
            lens: "data",
            note: "Right. Ashwin said releasing Dhoni would free ₹4 crore, and releasing other players could take CSK's purse to ₹40–45 crore.",
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
        lensLabel: "Reading the number",
        text: "Anthropic raised $81.3 billion and is valued at $1.5 trillion. What does the $1.5 trillion measure?",
        options: [
          {
            text: "The total investors put in, including the private placement",
            aw: 1,
            lens: "systems",
            note: "That's the $107.3 billion total deal. $1.5 trillion is the value of the whole company.",
          },
          {
            text: "The value of the whole company at the $83 IPO share price",
            aw: 3,
            lens: "data",
            note: "Right. The valuation prices every share at $83. The cash raised from the shares sold was $81.3 billion.",
          },
          {
            text: "The cash Anthropic holds after the listing",
            aw: 0,
            lens: "optimist",
            note: "The cash raised was $81.3 billion. $1.5 trillion is what the whole company is worth at $83 a share.",
          },
          {
            text: "SpaceX's valuation, the record Anthropic's debut overtook",
            aw: 1,
            lens: "skeptic",
            note: "$1.5 trillion is Anthropic's own valuation. It passed SpaceX's previous record for the largest debut.",
          },
        ],
      },
      {
        lensLabel: "Reading the detail",
        text: "Where did Anthropic's share price land compared with its target range of $70–$78?",
        options: [
          {
            text: "$78, at the top of the range",
            aw: 2,
            lens: "skeptic",
            note: "Higher still. The shares were priced at $83, above the whole range.",
          },
          {
            text: "$74, in the middle of the range",
            aw: 1,
            lens: "systems",
            note: "It went above the range, to $83.",
          },
          {
            text: "$70, at the bottom of the range, to make sure every share sold",
            aw: 0,
            lens: "optimist",
            note: "The opposite. Demand let Anthropic price above the range, at $83.",
          },
          {
            text: "$83, above the top of the range",
            aw: 3,
            lens: "data",
            note: "Exactly. Pricing at $83, above the $70–$78 range, points to strong demand for the shares.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "The total deal came to $107.3 billion, but the IPO raised $81.3 billion. Where did the other $26 billion come from?",
        options: [
          {
            text: "A separate private placement alongside the IPO",
            aw: 3,
            lens: "data",
            note: "Right. $81.3 billion from the IPO plus a $26 billion private placement makes $107.3 billion.",
          },
          {
            text: "Early investors selling their own shares on day one",
            aw: 1,
            lens: "skeptic",
            note: "That isn't in the reporting. The extra $26 billion came from a separate private placement.",
          },
          {
            text: "The share price rising on the first day of trading",
            aw: 0,
            lens: "optimist",
            note: "A price rise doesn't add money to the deal. The $26 billion was a separate private placement.",
          },
          {
            text: "A loan Anthropic took out to fund the listing",
            aw: 1,
            lens: "systems",
            note: "No borrowing is mentioned. The $26 billion came from a private placement alongside the IPO.",
          },
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
        lensLabel: "Reading the number",
        text: "With the minimum balance cut to 10%, how much of their eligible PF savings can employees withdraw?",
        options: [
          {
            text: "Up to 75%, since a quarter has to stay in the account",
            aw: 1,
            lens: "skeptic",
            note: "That was the old rule, when 25% had to stay. With the minimum now 10%, up to 90% can come out.",
          },
          {
            text: "Up to 10%, the new withdrawal limit",
            aw: 0,
            lens: "systems",
            note: "10% is what must stay in the account, not what you can take out. Up to 90% can be withdrawn.",
          },
          {
            text: "Up to 90%, subject to EPFO's withdrawal rules",
            aw: 3,
            lens: "data",
            note: "Right. Keeping only 10% means up to 90% of eligible savings can come out, within the withdrawal rules.",
          },
          {
            text: "All of it, once they've been out of work for two months",
            aw: 1,
            lens: "optimist",
            note: "The reporting doesn't say the whole balance can come out. The new limit is up to 90% of eligible savings.",
          },
        ],
      },
      {
        lensLabel: "Reading the detail",
        text: "How long does someone now have to be out of work before they can withdraw their PF?",
        options: [
          {
            text: "Two months, down from 12",
            aw: 3,
            lens: "data",
            note: "Exactly. EPFO's board cut the wait after losing a job from 12 months to two.",
          },
          {
            text: "Six months, down from 12",
            aw: 1,
            lens: "systems",
            note: "Shorter than that: two months, down from 12.",
          },
          {
            text: "Two months, down from six",
            aw: 2,
            lens: "optimist",
            note: "Right new figure, wrong old one. The wait used to be 12 months.",
          },
          {
            text: "Still 12 months; only the balance rule changed",
            aw: 0,
            lens: "skeptic",
            note: "Both changed. Alongside the lower balance, the wait after losing a job drops from 12 months to two.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "What change may be coming for employees when they retire?",
        options: [
          {
            text: "A higher interest rate on their PF balance",
            aw: 0,
            lens: "optimist",
            note: "No rate change is mentioned. The change for retirees is monthly instalments instead of one lump sum.",
          },
          {
            text: "Being able to withdraw everything two months after retiring",
            aw: 1,
            lens: "data",
            note: "The two-month rule is about losing a job, not retiring. For retirees, the change is monthly instalments.",
          },
          {
            text: "Having to leave 10% of their savings in the account for life",
            aw: 1,
            lens: "skeptic",
            note: "That isn't what's described for retirees. The proposal is to pay their savings in monthly instalments.",
          },
          {
            text: "Receiving their PF savings in monthly instalments instead of all at once",
            aw: 3,
            lens: "systems",
            note: "Right. Retirees may soon get their savings as monthly instalments instead of withdrawing everything at once.",
          },
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
        lensLabel: "Reading the text",
        text: "What does the joint declaration commit the three countries to on nuclear weapons?",
        options: [
          {
            text: "A complete ban and destruction of nuclear weapons",
            aw: 1,
            lens: "optimist",
            note: "That was Xi's call in his own remarks at the meeting. The joint declaration commits to talks on reducing nuclear risk.",
          },
          {
            text: "Cutting their nuclear arsenals by an agreed amount",
            aw: 0,
            lens: "systems",
            note: "No cuts were agreed. The pledge is to hold talks on reducing risks and stopping the spread of nuclear weapons.",
          },
          {
            text: "Nothing; nuclear weapons were left out of the text",
            aw: 0,
            lens: "skeptic",
            note: "They're in it. The leaders agreed to hold talks on reducing nuclear risks and preventing their spread.",
          },
          {
            text: "Talks on reducing nuclear risks and stopping their spread",
            aw: 3,
            lens: "data",
            note: "Right. The declaration commits to talks on nuclear risk and non-proliferation, not to cuts or a ban.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "Before the summit, Trump said the US and China wanted to help end the Russia-Ukraine war. What does the declaration say about Ukraine?",
        options: [
          {
            text: "It backs Trump's plan to end the war",
            aw: 1,
            lens: "systems",
            note: "Trump spoke about ending the war before the summit, but the declaration itself doesn't mention Ukraine.",
          },
          {
            text: "Nothing; it makes no mention of the war",
            aw: 3,
            lens: "data",
            note: "Right. Ukraine was expected on the agenda, but the joint text doesn't mention Russia's war against Ukraine.",
          },
          {
            text: "It calls for a ceasefire and new peace talks",
            aw: 0,
            lens: "optimist",
            note: "It doesn't. Despite Trump's comments before the summit, the declaration makes no mention of the war.",
          },
          {
            text: "It hands Ukraine to a reformed UN to resolve",
            aw: 1,
            lens: "skeptic",
            note: "The declaration does call for UN reform, but it doesn't link that to Ukraine. The war isn't mentioned.",
          },
        ],
      },
      {
        lensLabel: "Reading the detail",
        text: "What did the three leaders pledge on energy?",
        options: [
          {
            text: "To cut oil output to support prices",
            aw: 0,
            lens: "skeptic",
            note: "The opposite. They pledged to boost petroleum production and supplies.",
          },
          {
            text: "To speed up the switch to renewable energy",
            aw: 1,
            lens: "systems",
            note: "Renewables aren't mentioned. The pledge is about more petroleum production and supply.",
          },
          {
            text: "To boost petroleum production and supplies for stable global energy flows",
            aw: 3,
            lens: "data",
            note: "Right. The energy pledge is more petroleum output and supply, so global energy flows stay stable.",
          },
          {
            text: "To cap petroleum prices for countries that import oil",
            aw: 1,
            lens: "optimist",
            note: "No price cap was agreed. The pledge is to boost production and supplies.",
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

/** Thinking styles. Told apart by label and monogram, never by colour. */
export const lenses: Record<LensKey, { name: string; short: string; mono: string; desc: string }> = {
  data: {
    name: "The Data Detective",
    short: "Data Detective",
    mono: "DD",
    desc: "You go for the precise number and what it measures. Headlines don't fool you easily: you read the fine print.",
  },
  systems: {
    name: "The Big-Picture Thinker",
    short: "Big-Picture",
    mono: "BP",
    desc: "You connect numbers to people, causes and scale. You see the story behind the statistic.",
  },
  skeptic: {
    name: "The Healthy Skeptic",
    short: "Skeptic",
    mono: "HS",
    desc: "You question the source before you trust the claim. Pair that instinct with the data and you're hard to mislead.",
  },
  optimist: {
    name: "The Headline Optimist",
    short: "Optimist",
    mono: "HO",
    desc: "You take news at face value and move fast. Pausing on what a number really measures will sharpen your read.",
  },
}

export const lensOrder: LensKey[] = ["data", "systems", "skeptic", "optimist"]

/** Result bands, highest first. Describe the reading, not the reader. */
export const bands = [
  {
    min: 89,
    name: "Close to the reporting",
    desc: "You read past the headline and got the facts right. You're the friend people should check with before forwarding.",
  },
  {
    min: 56,
    name: "Mostly there",
    desc: "You've got the big picture. A couple of details tripped you up, and the review shows where.",
  },
  {
    min: 23,
    name: "Some gaps",
    desc: "You caught the gist, but the numbers behind the story tell a different tale. Worth a second look below.",
  },
  {
    min: 0,
    name: "New to this story",
    desc: "This one was new territory. The review gets you up to speed in under a minute.",
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
