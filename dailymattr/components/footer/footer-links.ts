export type FooterGroup = { title: string; links: { label: string; href: string }[] }

const toLinks = (labels: string[]) => labels.map((label) => ({ label, href: "#" }))

// Link groups from the landing-page Figma footer. Replace "#" with real routes as pages are added.
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
    links: toLinks([
      "Top",
      "India",
      "World",
      "Business",
      "Technology",
      "Sports",
      "Entertainment",
      "Lifestyle",
    ]),
  },
  {
    title: "Inside DailyMattr",
    links: toLinks(["About", "Editorial", "Newsroom", "Careers", "Contact"]),
  },
  { title: "Legal", links: toLinks(["Privacy", "Terms", "Cookies"]) },
  { title: "Support", links: toLinks(["Help Center", "Advertise", "Press"]) },
]
