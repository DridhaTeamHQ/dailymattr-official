// Copy for the Support page (the footer's Contact link). Wording follows the old site's
// /support page; the "Other ways to reach us" cards point to existing pages.

export const supportEmail = "support@dailymattr.com"

export const hero = {
  eyebrow: "Support",
  title: ["Let’s get you", "back on track."],
  body: "Tell us what you need and we’ll send it straight to our support team.",
  emailLabel: "Email us directly",
}

export const form = {
  kicker: "dailymattr support",
  title: "How can we help?",
  status: "Online",
  topics: ["Account or subscription", "App feedback", "Technical issue", "Something else"],
  placeholders: {
    name: "Your full name",
    email: "you@example.com",
    topic: "Select a topic",
    message: "Tell us what happened and how we can help…",
  },
  submit: "Send support request",
  replyTime: "We usually reply within one business day",
}

export const channels = {
  title: "Other ways to reach us",
  items: [
    {
      icon: "/support/mail.svg",
      title: "Email support",
      body: "Prefer to write directly? Email our support team and we’ll get back to you.",
      link: { label: supportEmail, href: `mailto:${supportEmail}` },
    },
    {
      icon: "/support/megaphone.svg",
      title: "Advertising and partnerships",
      body: "Planning a campaign or a brand partnership? Tell us about it on our Advertise page.",
      link: { label: "Advertise with us", href: "/advertise/" },
    },
    {
      icon: "/privacy/lock.svg",
      title: "Privacy and grievances",
      body: "For data requests, or complaints about the App or its content, contact our Grievance Officer.",
      link: { label: "Grievance Officer details", href: "/privacypolicy/#section-12" },
    },
  ],
}
