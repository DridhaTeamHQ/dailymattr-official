// News category pages under /news/<slug> (PAGE-SLUGS.md, "News categories").

export type NewsCategory = { slug: string; title: string; description: string }

export const newsCategories: NewsCategory[] = [
  {
    slug: "india",
    title: "India News",
    description: "Latest India news, national news headlines, politics news, government updates and current affairs.",
  },
  {
    slug: "world",
    title: "World News",
    description:
      "Latest world news, international news headlines, global affairs and major developments from around the world.",
  },
  {
    slug: "business",
    title: "Business News",
    description:
      "Latest business news, financial updates, market developments, company news and economic current affairs.",
  },
  {
    slug: "technology",
    title: "Technology News",
    description:
      "Latest technology news, artificial intelligence updates, digital innovation, gadgets and tech industry developments.",
  },
  {
    slug: "sports",
    title: "Sports News",
    description: "Latest sports news, cricket updates, sports headlines, tournaments and major sporting events.",
  },
  {
    slug: "entertainment",
    title: "Entertainment News",
    description:
      "Latest entertainment news, cinema news, movie updates, celebrity news and film industry headlines.",
  },
  {
    slug: "lifestyle",
    title: "Lifestyle News",
    description: "Lifestyle news, health news, wellness topics, culture and everyday-interest stories.",
  },
]

export const newsPath = (slug: string) => `/news/${slug}`

export const getNewsCategory = (slug: string) => newsCategories.find((c) => c.slug === slug)
