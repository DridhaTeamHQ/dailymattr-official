export type FooterGroup = { title: string; links: { label: string; href: string }[] }

// Link groups from the landing-page Figma footer. Slugs follow PAGE-SLUGS.md (the old site's URLs);
// pages marked "To build" there are linked already and 404 until they are built.
export const footerGroups: FooterGroup[] = [
  {
    title: "Formats",
    links: [
      { label: "NIA", href: "/nia" },
      { label: "Pix", href: "/formats/pix" },
      { label: "Qix", href: "/formats/qix" },
      { label: "Trax", href: "/formats/trax" },
    ],
  },
  {
    title: "Latest Stories",
    links: [
      { label: "Top", href: "/news" },
      { label: "India", href: "/news/india" },
      { label: "World", href: "/news/world" },
      { label: "Business", href: "/news/business" },
      { label: "Technology", href: "/news/technology" },
      { label: "Sports", href: "/news/sports" },
      { label: "Entertainment", href: "/news/entertainment" },
      { label: "Lifestyle", href: "/news/lifestyle" },
    ],
  },
  {
    title: "Inside DailyMattr",
    links: [
      { label: "About", href: "/about" },
      { label: "Benchmark", href: "/benchmark" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacypolicy" },
      { label: "Terms", href: "/termsandconditions" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "Advertise", href: "/advertise" }],
  },
]

/** Store listings for the "Get the app" badges. */
export const appStoreLinks = {
  apple: "https://apps.apple.com/in/app/dailymattr/id6791996138",
  google: "https://play.google.com/store/apps/details?id=com.dailymattr",
}
