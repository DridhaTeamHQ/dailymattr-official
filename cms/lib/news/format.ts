// Turning Pix stories (the Pix database's pix_posts rows) into what the website shows:
// its news sections, plain headlines, story URLs and key points. Mirrors the website's
// dailymattr/lib/news.ts, so the CMS previews and links match the website exactly.

/** The website's news sections, with the Pix section ids (pix_posts.category_id) in each. */
export const newsSections = [
  { slug: "india", label: "India", pixIds: [2] },
  { slug: "world", label: "World", pixIds: [1] },
  { slug: "business", label: "Business", pixIds: [3] },
  { slug: "technology", label: "Technology", pixIds: [15] },
  { slug: "sports", label: "Sports", pixIds: [6] },
  { slug: "entertainment", label: "Entertainment", pixIds: [4] },
  { slug: "lifestyle", label: "Lifestyle", pixIds: [11] },
  { slug: "states", label: "States", pixIds: [8] },
] as const

export type NewsSectionSlug = (typeof newsSections)[number]["slug"]

/** Pix sections with no page on the website: those stories only show under Latest. */
export const OTHER_SECTION = { slug: "other", label: "Other" } as const

export const mappedPixIds: number[] = newsSections.flatMap((s) => [...s.pixIds])

export function sectionForPixId(categoryId: number | null) {
  if (categoryId == null) return null
  return newsSections.find((s) => (s.pixIds as readonly number[]).includes(categoryId)) ?? null
}

/**
 * Pix marks highlighted words with [square brackets], and some headlines start with a
 * column tag on its own line ("[#dailymattrwrites]\n…"). The website shows plain text.
 */
export function plainText(text: string) {
  return text
    .replace(/^\s*\[?#\w+\]?\s*\n/, "")
    .replace(/[[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** Longest headline part of a story slug, before "-<Pix ID>" (as on the website). */
const MAX_SLUG = 79

/** The story's URL slug on the website: "<headline, shortened>-<Pix ID>". */
export function storySlug(headline: string, pixId: string) {
  const words = headline
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/%/g, " percent ")
    .replace(/₹/g, " rs ")
    .replace(/&/g, " and ")
    .replace(/['’‘`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  let short = words
  if (words.length > MAX_SLUG) {
    const cut = words.slice(0, MAX_SLUG + 1).lastIndexOf("-")
    short = cut > 0 ? words.slice(0, cut) : words.slice(0, MAX_SLUG)
  }
  return short ? `${short}-${pixId}` : pixId
}

/** Pix writes the key points as "• point" paragraphs. */
export function keyPoints(body: string | null) {
  return (body ?? "")
    .split(/\n+/)
    .map((line) => plainText(line).replace(/^[•\-*·]\s*/, ""))
    .filter(Boolean)
}

export function sourceOf(url: string | null) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null
    return { label: parsed.hostname.replace(/^www\./, ""), url: parsed.toString() }
  } catch {
    return null
  }
}

/** Dates are shown in India time, like on the website. */
export const INDIA_TIME = "Asia/Kolkata"

export const formatDay = (date: Date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: INDIA_TIME })

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: INDIA_TIME })

/** Today in India as YYYY-MM-DD. */
export const indiaToday = () => new Date().toLocaleDateString("en-CA", { timeZone: INDIA_TIME })
