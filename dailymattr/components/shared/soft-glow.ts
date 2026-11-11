type Glow = {
  /** Centre, as CSS background-position percentages ("28% 30%"). */
  at: string
  /** Ellipse radii as percentages of the box ("55% 55%"). */
  size: string
  alpha: number
}

/**
 * Soft blue + violet glows over a flat fill, the panel background used across the About and
 * Privacy pages. The defaults match the large CTA / hero panels (Figma 8595:12693, 8697:1613,
 * 8697:1617); smaller cards pass their own geometry. Percent-based so it scales with the panel.
 */
export function softGlow(
  base: string,
  {
    blue = { at: "28% 30%", size: "55% 55%", alpha: 0.22 },
    violet = { at: "78% 72%", size: "50% 50%", alpha: 0.18 },
  }: { blue?: Glow; violet?: Glow } = {},
) {
  return [
    `radial-gradient(ellipse ${blue.size} at ${blue.at}, rgba(57,121,255,${blue.alpha}), rgba(57,121,255,0) 70%)`,
    `radial-gradient(ellipse ${violet.size} at ${violet.at}, rgba(142,115,240,${violet.alpha}), rgba(142,115,240,0) 70%)`,
    base,
  ].join(", ")
}
