import { seoMetadata } from "@/lib/seo"

import { DownloadFormats, DownloadHero } from "@/components/download/sections"

export const generateMetadata = () => seoMetadata("/download")

/**
 * /download: the navbar's "Get the app", the Download buttons across the site and the link the
 * app's referral invites share. Phones never reach this page: proxy.ts sends iPhones to the App
 * Store and Android phones to Google Play (as the old site's api/download.js did). Desktops and
 * link-preview bots get it: store badges, a QR code to scan, and the four formats.
 */
export default function DownloadPage() {
  return (
    <main className="flex-1 bg-white">
      <DownloadHero />
      <DownloadFormats />
    </main>
  )
}
