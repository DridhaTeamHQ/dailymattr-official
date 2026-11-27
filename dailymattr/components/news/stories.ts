// The shape of a news story on the /news pages, and small helpers for it. The stories
// themselves come from the Pix database (lib/news.ts): every published Pix story, minus
// the ones hidden with the CMS's Customize button.

export type Story = {
  /** The story's Pix ID (pix_posts.published_id), the number at the end of its URL. */
  id: string
  /** The last segment of its /news/<slug> URL: the headline, shortened, then "-<id>". */
  slug: string
  headline: string
  /** A newsCategories slug. Some Pix sections have no page here, so no label. */
  category?: string
  /** Display date in India time, e.g. "21 November 2026". */
  date: string
  /** Publication day in India time as YYYY-MM-DD, what the date filter matches. */
  published: string
  /** Full photo URL, or null when the story has none. */
  image: string | null
}

/** What a story page shows under the headline. */
export type StoryBody = {
  /** The story in short: its key points. */
  points: string[]
  source: { label: string; url: string } | null
}

/** Photos in the dailymattr media bucket go through next/image (allowed in next.config.ts). */
const MEDIA = "https://coggfnbqqyiqfsxvtaym.supabase.co/storage/v1/object/public/pix-media/"

/** true for photos next/image may resize; any other host is shown as-is (unoptimized). */
export const isMediaImage = (url: string) => url.startsWith(MEDIA)

/** A story's page on this site: /news/<slug>, the same URL as on the old site. */
export const storyHref = (story: Story) => `/news/${story.slug}`

/** The Pix ID at the end of a story slug ("...-20245" or a bare "20245" -> "20245"), or null. */
export const storyIdFromSlug = (slug: string) => /(?:^|-)(\d{1,12})$/.exec(slug)?.[1] ?? null

/** Stories for one section (by newsCategories slug), or every story for the Latest page. */
export const storiesFor = (stories: Story[], category?: string) =>
  category ? stories.filter((s) => s.category === category) : stories
