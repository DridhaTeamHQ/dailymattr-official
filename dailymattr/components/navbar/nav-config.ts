export type NavItem = { label: string; href?: string; menu?: "features" }

export const leftLinks: NavItem[] = [
  { label: "Features", menu: "features" },
  { label: "Latest Stories", href: "/news" },
  { label: "Newsletter", href: "/newsletter" },
]

export const rightLinks: NavItem[] = [
  { label: "Inside dailymattr", href: "/inside" },
  { label: "Benchmark", href: "/benchmark" },
  { label: "About", href: "/about" },
]

/**
 * Regions in the header picker. Images are Twemoji flags (CC-BY 4.0, github.com/twitter/twemoji)
 * in public/regions/; each region uses one country's flag: India, Singapore (Asia-Pacific),
 * United States (Americas) and United Arab Emirates (Middle East). The first entry is the default until a choice is saved in localStorage.
 */
export const languages = [
  { code: "in", label: "India - Regional", image: "/regions/in.svg" },
  { code: "apac", label: "Asia-Pacific", image: "/regions/apac.svg" },
  { code: "amer", label: "Americas", image: "/regions/amer.svg" },
  { code: "me", label: "Middle East", image: "/regions/me.svg" },
]

/** localStorage key that remembers the chosen region. */
export const REGION_STORAGE_KEY = "dm_region"

/**
 * Runs before the page paints (app/layout.tsx): copies the saved region onto
 * <html data-region>, so the header shows the right image on reload with no flash of the default.
 */
export const regionScript = `(function(){try{var r=localStorage.getItem(${JSON.stringify(REGION_STORAGE_KEY)});if(${JSON.stringify(
  languages.map((l) => l.code)
)}.indexOf(r)>-1)document.documentElement.dataset.region=r;}catch(e){}})();`

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
