export type NavItem = { label: string; href?: string; menu?: "features" }

export const leftLinks: NavItem[] = [
  { label: "Features", menu: "features" },
  { label: "Latest Stories", href: "/stories" },
  { label: "Newsletter", href: "/newsletter" },
]

export const rightLinks: NavItem[] = [
  { label: "Inside dailymattr", href: "/inside" },
  { label: "About", href: "/about" },
]

export const languages = [
  { code: "en", label: "English" }
]

/** Format rows in the Features dropdown (Figma node 8856:12356). */
export type FormatItem = {
  name: string
  tag: string
  description: string
  href: string
  icon: string
}

export const formatItems: FormatItem[] = [
  {
    name: "Pix",
    tag: "READ",
    description: "Read visual stories",
    href: "/formats/pix",
    icon: "/nav-menu/pix.svg",
  },
  {
    name: "Qix",
    tag: "WATCH",
    description: "Watch short explainers",
    href: "/formats/qix",
    icon: "/nav-menu/qix.svg",
  },
  {
    name: "Trax",
    tag: "LISTEN",
    description: "Listen to stories",
    href: "/formats/trax",
    icon: "/nav-menu/trax.svg",
  },
]
