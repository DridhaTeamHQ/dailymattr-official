import { Suspense } from "react"
import Link from "next/link"

import { BrandMark } from "@/components/cms/brand-mark"
import { NavLinks } from "@/components/cms/nav-links"
import { UserMenu } from "@/components/cms/user-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { requireApprovedUser } from "@/lib/dal"
import { countPendingUsers } from "@/lib/users"

/** Every CMS page: top nav with the brand, page links and the account menu. */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-4 sm:px-6">
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
      <div className="ml-auto">
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
