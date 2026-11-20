import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/inside")

/** /inside (navbar "Inside dailymattr"): empty until the page is built. */
export default function InsidePage() {
  return <EmptyPage title="Inside dailyMattr" />
}
