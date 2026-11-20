import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/download")

/** /download (navbar "Get the app" and the Download buttons across the site): empty until the page is built. */
export default function DownloadPage() {
  return <EmptyPage title="Get the dailyMattr app" />
}
