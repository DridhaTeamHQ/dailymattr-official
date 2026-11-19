/**
 * News IQ editions: one per story the reader can pick on /quizz. Each is taken from a dailymattr
 * story (and the related stories it links to) and gets its own page at /quizz/<slug>. Add,
 * remove or reorder entries in `editions` and the picker, routes, metadata and sitemap follow.
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
        text: "Dhoni recorded 133 wins in 226 matches as CSK captain. What does the 226 tell you?",
        options: [
          {
            text: "He led in more IPL matches than any other captain.",
            aw: 3,
            lens: "data",
            note: "Right. 226 is the most appearances by any IPL skipper, and he won 133 of them.",
          },
          {
            text: "He won 226 matches for CSK.",
            aw: 0,
            lens: "optimist",
            note: "226 is how many matches he captained, not how many he won. The wins were 133.",
          },
          {
            text: "It's a big number, but I'd want to compare it with other captains first.",
            aw: 2,
            lens: "skeptic",
            note: "Fair instinct. The reporting has already made that comparison: no IPL captain has led in more matches.",
          },
          {
            text: "It shows how long CSK trusted one leader.",
            aw: 2,
            lens: "systems",
            note: "That's the story behind the number. The specific fact is that 226 matches is a record for an IPL captain.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "R Ashwin had suggested CSK release Dhoni ahead of the IPL 2027 auction if he wasn't going to play. Why would that matter to CSK?",
        options: [
          {
            text: "Releasing him frees his ₹4 crore in CSK's auction purse.",
            aw: 3,
            lens: "data",
            note: "Exactly. Ashwin said releasing Dhoni would free ₹4 crore, and releasing other players could help CSK build a ₹40–45 crore purse.",
          },
          {
            text: "It means CSK wants Dhoni gone.",
            aw: 0,
            lens: "optimist",
            note: "That isn't what was suggested. Ashwin said Dhoni could take a consultant or support-staff role instead, and CSK has now named him mentor for 2027.",
          },
          {
            text: "A bigger purse gives CSK more room to rebuild at the auction.",
            aw: 3,
            lens: "systems",
            note: "That's the bigger picture. Ashwin's point was that ₹4 crore from Dhoni, plus other releases, could give CSK a ₹40–45 crore purse.",
          },
          {
            text: "One player's salary can't make much difference.",
            aw: 1,
            lens: "skeptic",
            note: "₹4 crore alone is modest. Ashwin's point was the total: with other releases, CSK could reach a ₹40–45 crore purse.",
          },
        ],
      },
      {
        lensLabel: "Making the call",
        text: "You're planning CSK's 2027 season. What should Dhoni's mentor role focus on?",
        options: [
          {
            text: "Passing his captaincy experience to the next CSK leader.",
            aw: 3,
            lens: "systems",
            note: "A strong fit with his record: five titles and 133 wins in 226 matches as captain. That experience is what a mentor brings.",
          },
          {
            text: "Talk him into playing one more season.",
            aw: 0,
            lens: "optimist",
            note: "That's off the table. CSK has announced his retirement as a player, and his 2027 role is mentor.",
          },
          {
            text: "Wait to see how the role is defined before judging it.",
            aw: 2,
            lens: "skeptic",
            note: "Reasonable. The reporting says only that he will be mentor from 2027; the details of the role haven't been set out.",
          },
          {
            text: "Helping CSK spend its auction purse well.",
            aw: 2,
            lens: "data",
            note: "Plausible, since the auction purse was the talking point. But the reporting doesn't say the mentor role covers auction decisions.",
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
        text: "Anthropic raised $81.3 billion and is valued at $1.5 trillion. What's the difference?",
        options: [
          {
            text: "$81.3 billion is the cash from selling shares; $1.5 trillion is what the whole company is worth at the IPO price.",
            aw: 3,
            lens: "data",
            note: "Exactly. The raise is the money from shares sold in the IPO. The valuation prices the entire company at $83 a share.",
          },
          {
            text: "Anthropic now has $1.5 trillion in the bank.",
            aw: 0,
            lens: "optimist",
            note: "No. $1.5 trillion is the value of the whole company. The cash raised in the IPO was $81.3 billion.",
          },
          {
            text: "A debut valuation is only a snapshot; I'd watch where the price goes.",
            aw: 2,
            lens: "skeptic",
            note: "Fair. The $1.5 trillion comes from the $83 listing price. The $81.3 billion raised is cash in hand.",
          },
          {
            text: "The raise pays for growth; the valuation shows what investors expect from AI.",
            aw: 2,
            lens: "systems",
            note: "That's the bigger picture. In the reporting's terms: $81.3 billion raised, and an $83 share price that values the company at $1.5 trillion.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "Shares were priced at $83, above the target range of $70–$78. What does pricing above the range point to?",
        options: [
          {
            text: "Investors wanted more shares than expected.",
            aw: 3,
            lens: "data",
            note: "Right. A company prices above its range when demand is strong. That's part of how the raise reached $81.3 billion.",
          },
          {
            text: "Anthropic simply overpriced its shares.",
            aw: 1,
            lens: "skeptic",
            note: "A company can't price above its range without buyers willing to pay. The shares were sold at $83.",
          },
          {
            text: "The shares are now certain to keep rising.",
            aw: 0,
            lens: "optimist",
            note: "Nothing guarantees that. The $83 price reflects demand at listing, not where the shares go next.",
          },
          {
            text: "Money is pouring into AI, and this deal shows how much.",
            aw: 2,
            lens: "systems",
            note: "That's the wider trend. This report is about one deal: priced above its range, and valued above SpaceX's record.",
          },
        ],
      },
      {
        lensLabel: "Making the call",
        text: "The total deal is $107.3 billion, but the IPO raised $81.3 billion. Which would you put in a headline?",
        options: [
          {
            text: "$81.3 billion, because that's what the IPO raised.",
            aw: 3,
            lens: "data",
            note: "That's what the reporting leads with. The $107.3 billion total adds a separate $26 billion private placement.",
          },
          {
            text: "$107.3 billion. The bigger number is more impressive.",
            aw: 1,
            lens: "optimist",
            note: "Bigger isn't the same as accurate. $26 billion of it came from a separate private placement, not the IPO.",
          },
          {
            text: "Either, as long as the $26 billion private placement is explained.",
            aw: 3,
            lens: "systems",
            note: "Good call. $81.3 billion from the IPO plus $26 billion privately makes $107.3 billion. Naming both keeps it honest.",
          },
          {
            text: "Neither, until the figures are confirmed in filings.",
            aw: 2,
            lens: "skeptic",
            note: "Checking filings is good practice. These figures come from Hindustan Times' report on the listing.",
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
        text: "The mandatory balance drops from 25% to 10%. What does that mean for an employee?",
        options: [
          {
            text: "They can withdraw up to 90% of their eligible PF savings, within the rules.",
            aw: 3,
            lens: "data",
            note: "Right. Keeping only 10% means up to 90% of eligible savings can come out, subject to EPFO's withdrawal rules.",
          },
          {
            text: "They can take out all their PF money whenever they like.",
            aw: 0,
            lens: "optimist",
            note: "Not quite. 10% must stay in the account, and withdrawals still follow EPFO's rules.",
          },
          {
            text: "EPFO is cutting their PF savings by 15%.",
            aw: 0,
            lens: "skeptic",
            note: "No money is being cut. The change lowers how much you must leave in the account, from 25% to 10%.",
          },
          {
            text: "People get easier access to their own money when they need it.",
            aw: 2,
            lens: "systems",
            note: "That's the point of the change. Specifically, up to 90% of eligible savings can be withdrawn, subject to the rules.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "The board also cut the wait after losing a job from 12 months to two. How does that fit with the lower balance rule?",
        options: [
          {
            text: "Both help people reach their savings when their income stops.",
            aw: 3,
            lens: "systems",
            note: "That's the common thread. Two months after losing a job a member can withdraw, and more of the balance is available.",
          },
          {
            text: "They're separate changes that happened to be approved together.",
            aw: 1,
            lens: "skeptic",
            note: "They are separate decisions, but they point the same way: a shorter wait after job loss and a smaller balance that must stay.",
          },
          {
            text: "More people can withdraw sooner: after two months, not a year.",
            aw: 3,
            lens: "data",
            note: "Correct on the numbers. The wait drops from 12 months to two, alongside the cut in mandatory balance from 25% to 10%.",
          },
          {
            text: "So PF now works like an ordinary savings account.",
            aw: 1,
            lens: "optimist",
            note: "Not quite. 10% must stay put, withdrawals follow EPFO's rules, and retirees may get monthly instalments instead of a lump sum.",
          },
        ],
      },
      {
        lensLabel: "Making the call",
        text: "Retired employees may soon get their PF in monthly instalments instead of one lump sum. What does that change?",
        options: [
          {
            text: "It gives retirees a steady monthly income from their savings.",
            aw: 3,
            lens: "systems",
            note: "That's the idea behind it. Retirees may soon receive their savings in monthly instalments instead of withdrawing everything at once.",
          },
          {
            text: "How the money is paid out, not how much they've saved.",
            aw: 3,
            lens: "data",
            note: "Right. The savings are the same; the proposal changes the payout from a lump sum to monthly instalments.",
          },
          {
            text: "It's already in place for everyone retiring this year.",
            aw: 0,
            lens: "optimist",
            note: "Not yet. The reporting says retirees may soon receive monthly instalments; it isn't described as in force.",
          },
          {
            text: "Wait for the detailed rules before judging it.",
            aw: 2,
            lens: "skeptic",
            note: "Sensible. The instalment plan is described as coming soon, and its details aren't in the report.",
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
        text: "The summit's statement is called a 'peace declaration'. What does it actually commit to?",
        options: [
          {
            text: "Talks on nuclear risk, steadier energy supplies and a call for UN reform.",
            aw: 3,
            lens: "data",
            note: "That's the content: nuclear-risk and non-proliferation talks, more petroleum output and supply, and a call for UN reform.",
          },
          {
            text: "An end to the war in Ukraine.",
            aw: 0,
            lens: "optimist",
            note: "No. The declaration makes no mention of Russia's war against Ukraine.",
          },
          {
            text: "A name like that tells you little until you read what's in it.",
            aw: 2,
            lens: "skeptic",
            note: "Good instinct. Read closely, it covers energy, nuclear risk and UN reform, and leaves out Ukraine.",
          },
          {
            text: "A new balance of power between the three countries.",
            aw: 1,
            lens: "systems",
            note: "It was their first three-way summit, which matters. But the text commits to talks and pledges, not a new arrangement between them.",
          },
        ],
      },
      {
        lensLabel: "Connecting the dots",
        text: "Before the summit, Trump said the US and China wanted to help end the Russia-Ukraine war. The declaration doesn't mention Ukraine. What's the most careful reading?",
        options: [
          {
            text: "They agreed on energy, nuclear risk and UN reform, but not on Ukraine, at least not in writing.",
            aw: 3,
            lens: "systems",
            note: "That's what the record supports. Ukraine was expected on the agenda and Trump spoke about ending the war, but the joint text leaves it out.",
          },
          {
            text: "They must have agreed a Ukraine deal in private.",
            aw: 0,
            lens: "optimist",
            note: "Nothing in the reporting points to that. The declaration simply doesn't mention the war.",
          },
          {
            text: "Ukraine was dropped from the talks altogether.",
            aw: 1,
            lens: "skeptic",
            note: "We can't tell that. The talks were expected to cover Ukraine; what we know is that the declaration doesn't mention it.",
          },
          {
            text: "What a leader says before a summit and what gets signed can differ, so go by the text.",
            aw: 3,
            lens: "data",
            note: "Exactly. Trump's words before the summit are one thing; the signed declaration covers energy, nuclear risk and UN reform only.",
          },
        ],
      },
      {
        lensLabel: "Making the call",
        text: "You're writing the headline for this story. Which is fairest?",
        options: [
          {
            text: "US, China and Russia agree on energy and nuclear talks; Ukraine left out",
            aw: 3,
            lens: "data",
            note: "Fair and specific. It states what was agreed and the notable gap, without passing judgement.",
          },
          {
            text: "Trump, Xi and Putin bring peace to the world",
            aw: 0,
            lens: "optimist",
            note: "That overstates it. The declaration pledges talks and energy cooperation; it ends no conflict and leaves out Ukraine.",
          },
          {
            text: "Big powers ignore Ukraine in empty 'peace' deal",
            aw: 1,
            lens: "skeptic",
            note: "'Empty' is a judgement the reporting doesn't make. The missing mention of Ukraine is a fact worth stating plainly.",
          },
          {
            text: "First-ever three-way summit puts nuclear risk on the agenda",
            aw: 2,
            lens: "systems",
            note: "Accurate, and the summit was a first. It leaves out the energy pledge and the missing mention of Ukraine, which readers would want to know.",
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
  title: { before: "Take a quiz to see how well you know ", accent: "the news" },
}
