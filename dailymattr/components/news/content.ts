// News category pages under /news/<slug> (PAGE-SLUGS.md, "News categories").

export type NewsCategory = {
  slug: string
  /** Short name for tabs and story labels. */
  label: string
  /** The page's H1. */
  title: string
  /** The search / share title, as on the old site: "India news" (+ " - dailymattr"). */
  heading: string
  /** The intro under the H1, also the meta description (the old site's section copy). */
  description: string
}

export const newsCategories: NewsCategory[] = [
  {
    slug: "india",
    label: "India",
    title: "India News",
    heading: "India news",
    description:
      "The latest India news in short: politics, courts, policy and the stories shaping the country, fact-checked and human-picked.",
  },
  {
    slug: "world",
    label: "World",
    title: "World News",
    heading: "World news",
    description:
      "World news in short: the international stories that matter, explained in a few lines with the source linked.",
  },
  {
    slug: "business",
    label: "Business",
    title: "Business News",
    heading: "Business news",
    description:
      "Business and economy news in short: markets, companies, startups and money, fact-checked and human-picked.",
  },
  {
    slug: "technology",
    label: "Technology",
    title: "Technology News",
    heading: "Technology news",
    description:
      "Technology news in short: gadgets, AI, apps and the internet, explained in a few lines.",
  },
  {
    slug: "sports",
    label: "Sports",
    title: "Sports News",
    heading: "Sports news",
    description:
      "Sports news in short: cricket, football, the Asian Games and more, fact-checked and human-picked.",
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    title: "Entertainment News",
    heading: "Entertainment news",
    description:
      "Entertainment news in short: films, box office, OTT and celebrities, explained in a few lines.",
  },
  {
    slug: "lifestyle",
    label: "Lifestyle",
    title: "Lifestyle News",
    heading: "Lifestyle news",
    description:
      "Lifestyle news in short: health, culture, fashion and ideas worth knowing, fact-checked and human-picked.",
  },
  {
    slug: "states",
    label: "States",
    title: "State News",
    heading: "States news",
    description:
      "Regional news from across India's states in short, fact-checked and human-picked.",
  },
]

/** A section's route, as SEO entries are keyed: "/news/india". */
export const newsPath = (slug: string) => `/news/${slug}`

/** A section's public URL, the old site's form: "/news/india/". Use it for links. */
export const newsSectionHref = (slug: string) => `/news/${slug}/`

export const getNewsCategory = (slug: string) => newsCategories.find((c) => c.slug === slug)

/** Header copy for the /news (Latest) page, from the old site's /news page. */
export const latestNews = {
  title: "Latest news",
  heading: "Latest news",
  description:
    "The latest news in short from dailymattr - 100 fact-checked, human-picked stories a day across India, world, business, technology, sports and entertainment.",
}
