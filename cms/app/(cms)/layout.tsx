import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { BrandMark } from "@/components/cms/brand-mark"
import { NavLinks } from "@/components/cms/nav-links"
import { UserMenu } from "@/components/cms/user-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { websiteUrl } from "@/lib/seo/website"
import { countPendingUsers } from "@/lib/users"

/**
 * Every CMS page, dressed like the dailymattr website: its blue announcement strip, then a
 * white top nav with the wordmark, page pills and the account menu, over a soft grey page.
 */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-brand-blue text-white">
        <p className="mx-auto flex h-9 w-full max-w-6xl items-center justify-center gap-2 px-4 text-sm font-semibold sm:px-6">
          <Sparkles className="size-4 shrink-0" aria-hidden />
          <span className="truncate">Edit what matters on dailymattr.</span>
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 font-medium text-white/85 hover:text-white"
            >
              Open the website
              <ArrowRight className="size-3.5" aria-hidden />
            </a>
          )}
        </p>
      </div>
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:gap-8 sm:px-6">
          <Link href="/" className="shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="dailymattr CMS home">
            <BrandMark />
          </Link>
          <Suspense fallback={<HeaderSkeleton />}>
            <HeaderNav />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}

async function HeaderNav() {
  const user = await requireApprovedUser()
  const isAdmin = user.role === "admin"
  const pendingCount = isAdmin ? await countPendingUsers() : 0

  return (
    <>
      <NavLinks />
      <div className="ml-auto shrink-0">
        <UserMenu
          user={{ name: user.name, email: user.email, image: user.image, role: user.role }}
          pendingCount={pendingCount}
        />
      </div>
    </>
  )
}

function HeaderSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="ml-auto h-9 w-44" />
    </>
  )
}
