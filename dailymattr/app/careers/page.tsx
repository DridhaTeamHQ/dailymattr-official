import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/careers")

/** /careers: empty until the Careers page is built. */
export default function CareersPage() {
  return <EmptyPage title="Careers" />
}
