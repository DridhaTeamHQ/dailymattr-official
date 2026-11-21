// News category pages under /news/<slug> (PAGE-SLUGS.md, "News categories").

export type NewsCategory = {
  slug: string
  /** Short name for tabs and story labels. */
  label: string
  title: string
  description: string
}

export const newsCategories: NewsCategory[] = [
  {
    slug: "india",
    label: "India",
    title: "India News",
    description: "Latest India news, national news headlines, politics news, government updates and current affairs.",
  },
  {
    slug: "world",
    label: "World",
    title: "World News",
    description:
      "Latest world news, international news headlines, global affairs and major developments from around the world.",
  },
  {
    slug: "business",
    label: "Business",
    title: "Business News",
    description:
      "Latest business news, financial updates, market developments, company news and economic current affairs.",
  },
  {
    slug: "technology",
    label: "Technology",
    title: "Technology News",
    description:
      "Latest technology news, artificial intelligence updates, digital innovation, gadgets and tech industry developments.",
  },
  {
    slug: "sports",
    label: "Sports",
    title: "Sports News",
    description: "Latest sports news, cricket updates, sports headlines, tournaments and major sporting events.",
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    title: "Entertainment News",
    description:
      "Latest entertainment news, cinema news, movie updates, celebrity news and film industry headlines.",
  },
  {
    slug: "lifestyle",
    label: "Lifestyle",
    title: "Lifestyle News",
    description: "Lifestyle news, health news, wellness topics, culture and everyday-interest stories.",
  },
  {
    slug: "states",
    label: "States",
    title: "State News",
    description:
      "Latest state news, regional news, district news, local news updates and important developments across India.",
  },
]

export const newsPath = (slug: string) => `/news/${slug}`

export const getNewsCategory = (slug: string) => newsCategories.find((c) => c.slug === slug)

/** Header copy for the /news (Latest) page, from the old site's /news page. */
export const latestNews = {
  title: "Latest news",
  description:
    "The latest news in short from dailymattr — 100 fact-checked, human-picked stories a day across India, world, business, technology, sports and entertainment.",
}
