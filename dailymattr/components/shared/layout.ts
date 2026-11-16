/**
 * Side margins for the whole site: 64px a side on the 1920 Figma frame (4rem, so it scales
 * with the laptop root font size like everything else), 16px on phones, 24px on tablets.
 * Put it on a section (or the band inside a full-bleed background), then let the content
 * fill the width with CONTENT_WIDTH / PANEL_WIDTH.
 */
export const SITE_GUTTER = "px-4 sm:px-6 lg:px-16"

/**
 * Content column: the full width between the site gutters. The app preview media and the
 * format cards both use it so their left and right edges line up at every width.
 */
export const CONTENT_WIDTH = "mx-auto w-full"

/** Wide panel column (bento, templates, look-inside, footer): also gutter to gutter. */
export const PANEL_WIDTH = "mx-auto w-full"
