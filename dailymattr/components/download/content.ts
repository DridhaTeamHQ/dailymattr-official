// Copy for the /download page. Who gets sent straight to a store comes from the old site's
// /download (api/download.js, now proxy.ts); this page is what desktops and link previews see.

export const hero = {
  eyebrow: "Get the app",
  /** The accent is drawn in brand blue at the end of the title. */
  title: "Understand the world within",
  titleAccent: "seconds.",
  body: "100 fact-checked, human-picked stories a day that you can read, watch, listen to and ask about. Free on iPhone and Android, with no subscription and no paywall.",
  /** Same figures as the old site's hero. */
  proof: [
    { value: "2k+", label: "app downloads" },
    { value: "4.9", label: "overall rating", star: true },
  ],
}

export const qr = {
  title: "Scan to download",
  body: "Point your phone's camera at the code. It opens the App Store on iPhone and Google Play on Android.",
  hint: "Or open dailymattr.com/download on your phone",
}

export const band = {
  title: "Four ways in.",
  muted: "One app.",
}

export type DownloadFormat = {
  key: "pix" | "qix" | "trax" | "nia"
  verb: string
  name: string
  body: string
  href: string
}

export const formats: DownloadFormat[] = [
  {
    key: "pix",
    verb: "Read",
    name: "Pix",
    body: "Visual stories that strip the news down to the facts. Swipe through and get to what matters.",
    href: "/formats/pix/",
  },
  {
    key: "qix",
    verb: "Watch",
    name: "Qix",
    body: "Short video explainers that break the day's biggest developments into clear moments.",
    href: "/formats/qix/",
  },
  {
    key: "trax",
    verb: "Listen",
    name: "Trax",
    body: "Daily wraps, audio explainers and stories on the go, hands-free.",
    href: "/formats/trax/",
  },
  {
    key: "nia",
    verb: "Ask",
    name: "NIA",
    body: "An AI assistant that explains a story, simplifies a complex topic and connects the dots.",
    href: "/nia/",
  },
]
