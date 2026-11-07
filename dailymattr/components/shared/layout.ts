/**
 * Shared content column from the Figma frame: 1200px of a 1920px frame = 62.5% of the
 * viewport on desktop, capped at 1200px. The app preview media and the format cards both
 * use it so their left and right edges line up at every width.
 */
export const CONTENT_WIDTH = "mx-auto w-full max-w-[75rem] lg:w-[62.5vw]"

/**
 * Wide panel column from the Figma frame: 1507px of a 1920px frame = 78.5% of the viewport
 * on desktop, with no cap, so the bento, look-inside, newsletter and footer keep the Figma
 * proportions and grow on wider screens. Below lg they fill the width (minus page padding).
 */
export const PANEL_WIDTH = "mx-auto w-full lg:w-[78.5vw]"
