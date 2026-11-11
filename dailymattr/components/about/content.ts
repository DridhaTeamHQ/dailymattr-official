// Copy and links for the About page (Figma 8595:12484).

export const hero = {
  title: "About",
  body: "DailyMattr is a news and infotainment platform operated by Dridha Technologies Private Limited in India. It brings together concise news summaries, visual stories, video explainers, audio content, and conversational exploration.",
}

export const purpose = {
  eyebrow: "Our purpose",
  statement:
    "To help people stay informed, understand what matters, and spend less time navigating information overload.",
}

export const formats = {
  title: "Product formats",
  subtitle: "NIA · Pix · Qix · Trax",
  items: [
    { name: "NIA", icon: "/about/format-nia.svg", href: "/nia" },
    { name: "Pix", icon: "/about/format-pix.svg", href: "/formats/pix" },
    { name: "Qix", icon: "/about/format-qix.svg", href: "/formats/qix" },
    { name: "Trax", icon: "/about/format-trax.svg", href: "/formats/trax" },
  ],
}

// The press files don't exist yet: every href is "#" until they are added to public/.
export const press = {
  title: "Press resources",
  items: [
    { label: "Company overview", icon: "/about/press-overview.svg", href: "#" },
    { label: "Product description", icon: "/about/press-product.svg", href: "#" },
    { label: "Approved brand assets", icon: "/about/press-brand.svg", href: "#" },
    { label: "Founder and company information", icon: "/about/press-founder.svg", href: "#" },
    { label: "Approved screenshots", icon: "/about/press-screenshots.svg", href: "#" },
    { label: "Press releases and announcements", icon: "/about/press-releases.svg", href: "#" },
  ],
}

export const media = {
  title: "Media enquiries",
  body: "For interviews, press requests, or additional information, contact the designated media representative.",
  cta: { label: "Contact the press team", href: "mailto:admin@dridhatechnologies.com" },
}
