// Copy for the Careers page. Starter content: the roles below are PLACEHOLDERS to show the
// layout. Replace them with real openings (or empty the list) before this page is indexed.

export const hero = {
  eyebrow: "Careers",
  title: ["Help people", "understand what matters."],
  body: [
    "DailyMattr brings together editors, designers, engineers and AI specialists to make the news clearer, faster and easier to follow.",
    "We are a small team based in Hyderabad, building a news and infotainment app for readers who value their time.",
  ],
}

export const values = {
  title: "Why work with us",
  items: [
    {
      title: "Work that reaches people",
      body: "What you build or write is in readers’ hands every day, helping them make sense of the news.",
    },
    {
      title: "Facts first",
      body: "We hold ourselves to clear editorial standards: accuracy, context and independence come before speed.",
    },
    {
      title: "Real ownership",
      body: "A small team means you own problems end to end and see your ideas ship quickly.",
    },
    {
      title: "Learn across disciplines",
      body: "Work alongside newsroom, product, design and AI people, and pick up something new every week.",
    },
  ],
}

export type Role = { title: string; team: string; location: string; type: string }

export const roles = {
  id: "open-roles",
  title: "Open roles",
  body: "Don’t see the right fit yet? Choose “General application” in the form below and tell us what you’d like to work on.",
  apply: "Apply",
  // Placeholder roles: swap for real openings.
  items: [
    { title: "News Editor", team: "Editorial", location: "Hyderabad", type: "Full-time" },
    { title: "Video Producer", team: "Editorial · Qix", location: "Hyderabad", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Hyderabad", type: "Full-time" },
    { title: "Frontend Engineer (React / Next.js)", team: "Engineering", location: "Hyderabad", type: "Full-time" },
    { title: "AI Engineer", team: "Engineering · NIA", location: "Hyderabad", type: "Full-time" },
  ] satisfies Role[],
}

/** Application form (UI only for now: submitting shows a confirmation, nothing is sent). */
export const apply = {
  id: "apply",
  title: "Apply to dailymattr",
  body: "Tell us a little about yourself. It takes about five minutes.",
  stepsTitle: "How we hire",
  steps: [
    { title: "Apply", body: "Send your details and CV using this form." },
    { title: "Intro call", body: "A short conversation with the hiring team." },
    { title: "Skills round", body: "A practical task or portfolio review, depending on the role." },
    { title: "Final conversation", body: "Meet the team and talk through the offer." },
  ],
  generalOption: "General application",
  experience: ["0–1 years", "1–3 years", "3–5 years", "5–8 years", "8+ years"],
  notice: ["Immediately", "15 days", "30 days", "60 days", "90 days"],
  labels: {
    name: "Full name",
    email: "Email address",
    phone: "Phone number",
    city: "Current city",
    role: "Role",
    experience: "Experience",
    portfolio: "LinkedIn or portfolio",
    notice: "Notice period",
    cv: "CV / résumé",
    message: "Why dailymattr?",
  },
  placeholders: {
    name: "Your full name",
    email: "you@example.com",
    phone: "+91 98765 43210",
    city: "e.g. Hyderabad",
    role: "Select a role",
    experience: "Select experience",
    portfolio: "https://",
    notice: "Select notice period",
    message: "Tell us about yourself and what you’d like to work on…",
  },
  cv: {
    empty: "Upload your CV",
    hint: "PDF, DOC or DOCX, up to 5 MB",
    browse: "Browse",
    change: "Change",
    tooBig: "Please choose a file up to 5 MB.",
    maxBytes: 5 * 1024 * 1024,
  },
  consent: "I agree that dailymattr may store and use these details to assess my application, as described in the",
  submit: "Submit application",
  success: {
    title: "Application received",
    again: "Submit another application",
  },
}
