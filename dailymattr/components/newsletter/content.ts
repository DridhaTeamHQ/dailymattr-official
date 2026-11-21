// Copy for the /newsletter page. Wording follows the old site's https://www.dailymattr.com/newsletter/
// page; only the text is reused, the layout is the new site's (Support / Advertise pages).

/** Anchor the "Send me the good stuff" link in the lower band scrolls back to. */
export const subscribeId = "subscribe"

export const hero = {
  eyebrow: "Your new daily ritual",
  /** The last word is drawn in brand blue. */
  title: ["Open your inbox to", "stories that"],
  titleAccent: "mattr.",
  body: "No doomscrolling. No clutter. Unsubscribe whenever.",
}

/** The three things every issue brings; `key` picks the card's little illustration. */
export type Pledge = { key: "summary" | "checked" | "source"; title: string }

export const pledges: Pledge[] = [
  { key: "summary", title: "5 top stories summarised" },
  { key: "checked", title: "Fact checked & handpicked" },
  { key: "source", title: "Source shared" },
]

export const form = {
  badge: "Daily newsletter",
  labels: { firstName: "First name (optional)", email: "Email address" },
  placeholders: { firstName: "Your first name", email: "you@example.com" },
  submit: "Send me the good stuff",
  finePrint: "By subscribing you agree to receive the daily newsletter. Unsubscribe anytime.",
  success: {
    title: "You’re on the list!",
    body: "Look out for a welcome note in your inbox. Good reads are on their way.",
    again: "Add another email",
  },
}

export const habit = {
  title: "We make being informed a daily habit",
  muted: "not a daily battle.",
}
