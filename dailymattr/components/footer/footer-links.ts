export type FooterGroup = { title: string; links: { label: string; href: string }[] }

const toLinks = (labels: string[]) => labels.map((label) => ({ label, href: "#" }))

// Link groups from the Figma frame. Replace "#" with real routes as pages are added.
export const footerGroups: FooterGroup[] = [
  {
    title: "Product",
    links: toLinks(["Training Platform", "Skill Management", "Audits", "Integrations", "FAQ"]),
  },
  {
    title: "Features",
    links: toLinks([
      "AI Course Builder",
      "AI Search",
      "Checklists",
      "Manager Dashboard",
      "Document Storage",
      "Translations",
      "Communication",
      "Custom Branding",
    ]),
  },
  {
    title: "Use Cases",
    links: toLinks([
      "Onboarding",
      "Staff Development",
      "Employee Assessment",
      "Employee Training",
      "Training Management",
    ]),
  },
  { title: "Company", links: toLinks(["Careers", "Pricing", "Guides", "Templates"]) },
  {
    title: "Industries",
    links: toLinks(["Hospitality & Leisure", "Food production", "Retail & Service"]),
  },
  { title: "Security", links: toLinks(["Trust Center", "Status"]) },
]

export const legalLinks = toLinks(["Privacy Policy", "Terms & Conditions"])
