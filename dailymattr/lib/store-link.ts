import { appStoreLinks } from "@/components/footer/footer-links"

/*
 * Which store a device belongs in, for /download. proxy.ts asks on the server (user agent only)
 * and components/download/store-redirect.tsx asks again in the browser, where the touch screen
 * is known too.
 */

const APPLE_MOBILE = /iphone|ipad|ipod/i
const ANDROID = /android/i
const MAC = /macintosh/i

/**
 * The App Store for iPhone / iPad / iPod, Google Play for Android, null for everything else.
 *
 * An iPad's Safari asks for the desktop site by default and so says "Macintosh"; the only tell
 * is its touch screen, which Macs don't have. Pass `touchPoints` (navigator.maxTouchPoints) in
 * the browser; on the server it is unknown, so a "Mac" there gets the page.
 */
export function storeFor(userAgent: string, touchPoints = 0): string | null {
  if (ANDROID.test(userAgent)) return appStoreLinks.google
  if (APPLE_MOBILE.test(userAgent)) return appStoreLinks.apple
  if (MAC.test(userAgent) && touchPoints > 1) return appStoreLinks.apple
  return null
}
