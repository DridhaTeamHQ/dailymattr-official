import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/login")

/** /login (navbar and mobile menu "Log in"): empty until sign-in is built. */
export default function LoginPage() {
  return <EmptyPage title="Log in" />
}
