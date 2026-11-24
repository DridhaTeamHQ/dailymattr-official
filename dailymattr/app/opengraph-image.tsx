import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

// The share card shown when any page is posted to social media or chat apps
// (also used for Twitter/X via summary_large_image). Child routes inherit it.
export const alt = "dailyMattr – Understand the world within seconds."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const eyebrow = "For curious minds. Busy lives."
const headline = "Understand the world within seconds."
const name = `“${site.name}”`

/**
 * Inter Tight, the site font, as a TTF subset holding just the card's characters. ImageResponse
 * can't read the woff2 that next/font serves, so this asks Google Fonts directly; without a
 * browser user agent it answers with TTF. Returns null if the fetch fails, and the card then
 * falls back to ImageResponse's built-in font instead of failing the build.
 */
async function interTight(weight: 400 | 700) {
  const text = [eyebrow, eyebrow.toUpperCase(), headline, name].join("")
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text()
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!url) return null
    const res = await fetch(url)
    return res.ok ? { name: "Inter Tight", data: await res.arrayBuffer(), weight, style: "normal" as const } : null
  } catch {
    return null
  }
}

export default async function Image() {
  const fonts = (await Promise.all([interTight(400), interTight(700)])).filter((f) => f !== null)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background:
            "radial-gradient(ellipse 60% 70% at 15% 20%, rgba(57,121,255,0.35), rgba(57,121,255,0) 70%), radial-gradient(ellipse 55% 60% at 90% 85%, rgba(142,115,240,0.3), rgba(142,115,240,0) 70%), #1c1c1e",
          color: "white",
          fontFamily: "Inter Tight",
        }}
      >
        <div style={{ fontSize: 40, color: "#6b9aff", letterSpacing: 2, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ marginTop: 24, fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          {headline}
        </div>
        <div style={{ marginTop: 48, fontSize: 44, color: "rgba(255,255,255,0.75)" }}>{name}</div>
      </div>
    ),
    { ...size, fonts },
  )
}
