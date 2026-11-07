/**
 * Laptop sizing (see the `html { font-size }` rule in app/globals.css): on 1024–1600px screens
 * the root font size is width / 1600 × 16px (min 12px), so every rem-based size shrinks with
 * the screen. That is a real 100% page, not zoom: no corrections for vw or JS sizes needed.
 *
 * The same ratio is exposed as the number `--site-scale` on <html> (via the script below) for
 * the one place that needs it as a number: the navbar, kept at 90% on laptops.
 */
export const DESIGN_WIDTH = 1600
export const MIN_SCALE = 0.75

/** Inline script for <head>: sets --site-scale-auto before first paint and on resize. */
export const siteScaleScript = `(function(){var r=document.documentElement;function a(){var w=window.innerWidth;var s=w<1024?1:Math.min(1,Math.max(${MIN_SCALE},w/${DESIGN_WIDTH}));r.style.setProperty('--site-scale-auto',String(s));}a();window.addEventListener('resize',a);})();`
