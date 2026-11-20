import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/termsandconditions")

/** /termsandconditions: empty until the Terms and Conditions page is built (PAGE-SLUGS.md). */
export default function TermsPage() {
  return <EmptyPage title="Terms and Conditions" />
}
