export type FooterGroup = { title: string; links: { label: string; href: string }[] }

const toLinks = (labels: string[]) => labels.map((label) => ({ label, href: "#" }))

// Link groups from the Figma footer (node 8856:9310). Replace "#" with real routes as pages are added.
export const footerGroups: FooterGroup[] = [
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

export const legalLinks = toLinks(["Privacy Policy", "Terms & Conditions"])

// Badge artwork is exported at 3× (132px tall); shown at the design's 44px height.
export const storeBadges = [
  {
    id: "app-store",
    href: "#",
    image: "/downlods/apple.png",
    width: 416,
    height: 132,
    alt: "Download on the App Store",
  },
  {
    id: "google-play",
    href: "#",
    image: "/downlods/Text.png",
    width: 441,
    height: 132,
    alt: "Get it on Google Play",
  },
]
