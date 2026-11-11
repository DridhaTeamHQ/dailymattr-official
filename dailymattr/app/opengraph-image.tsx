import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

// The share card shown when any page is posted to social media or chat apps
// (also used for Twitter/X via summary_large_image). Child routes inherit it.
export const alt = "dailyMattr – Understand the world within seconds."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
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
        }}
      >
        <div style={{ fontSize: 40, color: "#6b9aff", letterSpacing: 2, textTransform: "uppercase" }}>
          For curious minds. Busy lives.
        </div>
        <div style={{ marginTop: 24, fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          Understand the world within seconds.
        </div>
        <div style={{ marginTop: 48, fontSize: 44, color: "rgba(255,255,255,0.75)" }}>{`“${site.name}”`}</div>
      </div>
    ),
    size,
  )
}
