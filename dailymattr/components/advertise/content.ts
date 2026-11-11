// Copy for the Advertise page (Figma 8595:13231).

export const hero = {
  eyebrow: "Advertise",
  title: "Reach people who value their attention.",
  body: [
    "Connect your brand with an audience that comes to DailyMattr to discover, learn, and stay informed.",
    "Explore advertising and partnership opportunities designed to fit the reading experience without compromising editorial independence.",
  ],
  button: { label: "Discuss a campaign", href: "#enquire" },
}

export const environment = {
  title: "A thoughtful environment for brands",
  body: "DailyMattr is built around concise, useful content. Commercial placements should respect the reader's experience and remain clearly distinguishable from editorial stories.",
}

export const partnerships = {
  title: "Partnership opportunities",
  items: [
    { icon: "/advertise/format-display.svg", label: "Display advertising, where available." },
    { icon: "/advertise/format-sponsored.svg", label: "Clearly labelled sponsored content." },
    { icon: "/advertise/format-brand.svg", label: "Brand campaigns across eligible formats." },
    {
      icon: "/advertise/format-custom.svg",
      label: "Custom editorial-style creative, subject to editorial and advertising policies.",
    },
  ],
}

export const principles = {
  objectives: {
    icon: "/advertise/objectives.svg",
    title: "Built around your objectives",
    body: "Tell us your audience, campaign goals, timing, and preferred formats. Our team can discuss available opportunities and relevant campaign options.",
  },
  independence: {
    icon: "/advertise/independence.svg",
    title: "Editorial independence",
    body: "Advertising does not buy editorial approval. Paid placements must be identifiable as advertising or sponsored content.",
  },
}

export const enquiry = {
  id: "enquire",
  title: "Enquire about advertising",
  submit: "Discuss a campaign",
  // The Figma selects are empty; these options are placeholders until the team confirms them.
  objectives: ["Brand awareness", "Product or service launch", "Sponsored content", "Other"],
  budgets: ["Under ₹1 lakh", "₹1–5 lakh", "₹5–25 lakh", "Above ₹25 lakh", "Not sure yet"],
}
