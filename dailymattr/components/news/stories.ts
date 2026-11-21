// Sample stories for the /news pages, UI only: the first page of the old site's
// https://www.dailymattr.com/news/ list (21 November 2026), headlines and photos as published.
// Replace `stories` (and the bodies in articles.ts) with the CMS feed when it exists; the pages
// only read them through storiesFor(), getStory() and storyBodies.

export type Story = {
  /** The story's slug on the old site (the last segment of its /news/<slug> URL). */
  slug: string
  headline: string
  /** A newsCategories slug. A few stories carry no section label on the old site. */
  category?: string
  /** Display date, e.g. "21 November 2026". */
  date: string
  /** Publication day as YYYY-MM-DD, what the date filter matches. */
  published: string
  /** Path of the photo inside the dailymattr media bucket. */
  image: string
}

const MEDIA = "https://coggfnbqqyiqfsxvtaym.supabase.co/storage/v1/object/public/pix-media"

/** Full-size photo URL (resized by next/image; the bucket is allowed in next.config.ts). */
export const storyImage = (story: Story) => `${MEDIA}/${story.image}`

/** A story's page on this site: /news/<slug>, the same URL as on the old site. */
export const storyHref = (story: Story) => `/news/${story.slug}`

const day = "21 November 2026"
const dayIso = "2026-11-21"

export const stories: Story[] = [
  {
    slug: "nara-lokesh-steps-in-after-girl-students-report-eve-teasing-outside-andhra-20245",
    headline: "Nara Lokesh steps in after girl students report eve-teasing outside Andhra school",
    category: "states",
    date: day,
    published: dayIso,
    image: "1c563893-81ed-4d5f-b975-bd16c7f4c912/a49b3713-fd59-4a90-81ac-882044ec37fb.png",
  },
  {
    slug: "arunachal-groups-urge-shah-to-scrap-the-proposed-11-200-mw-siang-mega-dam-20244",
    headline: "Arunachal groups urge Shah to scrap the proposed 11,200 MW Siang mega dam project",
    category: "india",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/7af9a18b-44cf-47d3-88a5-3ca98b5360a2.png",
  },
  {
    slug: "caqm-targets-15-20-percent-pollution-reduction-in-delhi-ncr-by-2027-fixes-20243",
    headline: "CAQM targets 15-20% pollution reduction in Delhi-NCR by 2027, fixes officials’ accountability",
    category: "states",
    date: day,
    published: dayIso,
    image: "1c563893-81ed-4d5f-b975-bd16c7f4c912/f963ada5-309d-42ba-b6c6-9a3c0c367543.png",
  },
  {
    slug: "15-dead-over-180-hospitalised-after-suspected-toxic-liquor-consumption-in-20242",
    headline: "15 dead, over 180 hospitalised after suspected toxic liquor consumption in Manipur",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/e6c54df1-1843-439d-b316-f94e0df76abe.png",
  },
  {
    slug: "deepinder-goyals-temple-puts-the-spotlight-on-indias-growing-health-tech-20241",
    headline: "Deepinder Goyal’s Temple puts the spotlight on India’s growing health-tech wearable market",
    category: "technology",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/4e2b9dd5-57e9-4a7e-a973-e058070f3b1b.png",
  },
  {
    slug: "where-was-siraj-ravi-shastri-questions-gambhir-and-gills-pace-bowling-selection-20240",
    headline: "‘Where was Siraj?’ Ravi Shastri questions Gambhir and Gill’s pace-bowling selection",
    category: "sports",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/d85e1cd8-401f-4891-99ad-e800a879b7b4.png",
  },
  {
    slug: "kapil-dev-reacts-to-congress-mps-bias-allegations-over-sirajs-omission-against-20239",
    headline: "Kapil Dev reacts to Congress MP’s bias allegations over Siraj’s omission against New Zealand",
    category: "sports",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/9d99192d-d633-4c73-a4e6-b078eff8ab04.png",
  },
  {
    slug: "melania-trump-talks-peace-amid-gaza-conflict-at-premiere-of-her-amazon-series-20238",
    headline: "Melania Trump talks peace amid Gaza conflict at premiere of her Amazon series",
    category: "world",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/6f79fde2-0241-47e4-9878-bfa4bad949df.png",
  },
  {
    slug: "congress-says-modi-shah-still-seek-supertainted-two-thirds-majority-to-push-20237",
    headline: "Congress says Modi, Shah still seek ‘supertainted’ two-thirds majority to push delimitation bill",
    category: "india",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/b656a772-fd31-46d0-83f7-bfdbe10ea198.png",
  },
  {
    slug: "indias-fake-university-list-grows-from-20-to-32-in-three-years-18-old-names-20236",
    headline: "India’s fake university list grows from 20 to 32 in three years, 18 old names still remain",
    category: "india",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/efb45a7c-20b6-46a3-9dcf-cc09a95c4a8d.png",
  },
  {
    slug: "tata-trusts-chairman-noel-tata-seeks-board-nrc-meeting-recordings-amid-chairman-20235",
    headline: "Tata Trusts chairman Noel Tata seeks board, NRC meeting recordings amid chairman row",
    category: "india",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/577a815e-ae00-4916-afd7-ca64218c88d5.png",
  },
  {
    slug: "52-lakh-weddings-rs-7-5-lakh-crore-business-indias-big-fat-wedding-season-is-20234",
    headline: "52 lakh weddings, ₹7.5 lakh crore business. India’s big fat wedding season is here",
    category: "india",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/a3f78bdc-72d2-41f6-87a9-e7965cc99a0f.png",
  },
  {
    slug: "india-reach-486-4-on-day-3-against-new-zealand-take-118-run-lead-in-first-test-20232",
    headline: "India reach 486/4 on Day 3 against New Zealand, take 118-run lead in first Test",
    category: "sports",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/19de9af0-bd30-425f-8718-a9d74564bf8c.png",
  },
  {
    slug: "pm-modi-marks-iit-kharagpurs-75-years-says-india-make-everything-from-chips-to-20230",
    headline: "PM Modi marks IIT Kharagpur’s 75 years, says India make everything from chips to ships",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/02ce8055-c76b-4ee2-9c8b-7198923e5b7a.png",
  },
  {
    slug: "spacex-hires-democratic-lobbyists-ahead-of-possible-us-congress-probes-20228",
    headline: "SpaceX hires Democratic lobbyists ahead of possible US Congress probes",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/ae76f96d-18ee-4e2f-94e5-58c62bd8a3ad.png",
  },
  {
    slug: "loud-music-phone-calls-on-trains-can-attract-rs-1-000-fine-or-6-month-jail-20224",
    headline: "Loud music, phone calls on trains can attract ₹1,000 fine or 6-month jail, Eastern Railway warns",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/8221c03c-6988-458f-ab1d-2383db5241b6.png",
  },
  {
    slug: "telangana-to-go-ahead-with-december-global-summit-despite-water-and-power-20223",
    headline: "Telangana to go ahead with December Global Summit despite water and power concerns",
    category: "states",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/46954858-a3e0-495f-b9cc-1e71a5d03518.png",
  },
  {
    slug: "parliaments-monsoon-session-remains-unprorogued-for-100-days-breaks-87-day-20221",
    headline: "Parliament’s Monsoon Session remains unprorogued for 100 days, breaks 87-day record",
    category: "india",
    date: day,
    published: dayIso,
    image: "1c563893-81ed-4d5f-b975-bd16c7f4c912/70f5b709-418a-4014-acb6-8d15e3e9fbc6.png",
  },
  {
    slug: "indian-refiners-scramble-to-secure-oil-tankers-as-shipping-costs-surge-20220",
    headline: "Indian refiners scramble to secure oil tankers as shipping costs surge",
    date: day,
    published: dayIso,
    image: "1c563893-81ed-4d5f-b975-bd16c7f4c912/18a1e949-27fa-4301-950d-57c4ccf63697.png",
  },
  {
    slug: "we-promise-better-performance-byds-pitch-for-luxury-ev-brand-denza-20218",
    headline: "‘We promise better performance’: BYD’s pitch for luxury EV brand Denza",
    category: "technology",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/e5c54191-f431-4989-917a-2893bb5c8277.png",
  },
  {
    slug: "indias-first-bullet-train-to-begin-operations-in-2027-surat-vapi-section-to-20217",
    headline: "India’s first bullet train to begin operations in 2027, Surat-Vapi section to open first",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/709a30f3-cf11-43cb-a8eb-5e8886259532.png",
  },
  {
    slug: "ravi-kishan-to-star-in-film-exploring-korean-cultures-influence-on-india-20215",
    headline: "Ravi Kishan to star in film exploring Korean culture’s influence on India",
    category: "entertainment",
    date: day,
    published: dayIso,
    image: "09340f37-1778-4f13-b134-a67c50125b14/c4ffd288-03f5-4ebb-bd5e-d139ad224b51.png",
  },
  {
    slug: "up-cm-yogi-carries-mothers-mortal-remains-on-shoulder-during-last-rites-in-20214",
    headline: "UP CM Yogi carries mother’s mortal remains on shoulder during last rites in Uttarakhand",
    category: "india",
    date: day,
    published: dayIso,
    image: "1c563893-81ed-4d5f-b975-bd16c7f4c912/89228cf9-22e0-47c2-a50e-2abbc3c1b366.png",
  },
  {
    slug: "indias-forex-reserves-fall-by-14-billion-to-three-month-low-of-705-billion-20213",
    headline: "India’s forex reserves fall by $14 billion to three-month low of $705 billion",
    category: "business",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/21b5b060-0581-4145-87d5-f684b19ad126.png",
  },
  {
    slug: "india-bangladesh-ganga-treaty-renewal-faces-uncertainty-amid-strained-ties-20212",
    headline: "India-Bangladesh Ganga treaty renewal faces uncertainty amid strained ties",
    category: "india",
    date: day,
    published: dayIso,
    image: "7ba61cb3-572c-4830-ac6a-c40f75a510c5/d749b755-0a27-48c2-8d47-e085b7187387.png",
  },
  {
    slug: "us-report-says-china-backed-pakistan-during-operation-sindoor-to-suppress-20211",
    headline: "US report says China backed Pakistan during Operation Sindoor to suppress India’s rise",
    category: "world",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/fef56141-7e72-410d-b48c-9a2363d5d046.png",
  },
  {
    slug: "trump-urges-nvidia-to-reinstate-former-ceo-jensen-huang-says-he-deserves-a-20210",
    headline: "Trump urges Nvidia to reinstate former CEO Jensen Huang says he deserves a second chance",
    category: "world",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/f7dce516-f2a0-4abd-9455-76db990feb33.png",
  },
  {
    slug: "ladakh-to-hold-first-panchayat-municipal-polls-since-2019-voting-on-saturday-20209",
    headline: "Ladakh to hold first panchayat, municipal polls since 2019, voting on Saturday",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/ba1912e7-baeb-4bf1-a8c1-2dffa8bad344.png",
  },
  {
    slug: "centre-meta-launch-instagram-microdrama-series-to-warn-indians-about-online-20208",
    headline: "Centre, Meta launch Instagram microdrama series to warn Indians about online scams",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/ba725f3b-16c7-424b-a125-6e3ce3317b4f.png",
  },
  {
    slug: "youth-congress-calls-meta-bjp-ka-beta-sets-7-day-deadline-to-restore-accounts-20207",
    headline: "Youth Congress calls Meta “BJP ka Beta”, sets 7-day deadline to restore accounts",
    category: "india",
    date: day,
    published: dayIso,
    image: "b239e43f-dcc4-4b54-b77e-905aa2e5c488/6ce3cbd8-03a5-47bb-a7cf-bd4b6e7de7f3.png",
  },
]

/** One story by slug, or undefined. */
export const getStory = (slug: string) => stories.find((s) => s.slug === slug)

/** Stories for one section (by newsCategories slug), or every story for the Latest page. */
export const storiesFor = (category?: string) =>
  category ? stories.filter((s) => s.category === category) : stories
