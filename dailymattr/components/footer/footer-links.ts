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
    links: [
      { label: "About", href: "/about" },
      ...toLinks(["Editorial"]),
      { label: "Newsroom", href: "/newsroom" },
      ...toLinks(["Careers", "Contact"]),
    ],
  },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacypolicy" }, ...toLinks(["Terms", "Cookies"])] },
  {
    title: "Support",
    links: [
      ...toLinks(["Help Center"]),
      { label: "Advertise", href: "/advertise" },
      ...toLinks(["Press"]),
    ],
  },
]
