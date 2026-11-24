import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Clock, RefreshCw, ShieldX } from "lucide-react"

import { signOutAction } from "@/app/actions"
import { BrandBackdrop } from "@/components/cms/brand-backdrop"
import { IconChip } from "@/components/cms/icon-chip"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getViewer } from "@/lib/dal"

export const metadata: Metadata = { title: "Waiting for approval" }

/** Where signed-in people land until an admin approves them (or after a rejection). */
export default function VerificationPage() {
  return (
    <BrandBackdrop>
      <Suspense fallback={<Skeleton className="h-72 w-full max-w-md rounded-xl" />}>
        <VerificationStatus />
      </Suspense>
    </BrandBackdrop>
  )
}

async function VerificationStatus() {
  const viewer = await getViewer()
  if (!viewer) redirect("/login")
  if (viewer.user?.status === "approved") redirect("/")

  const rejected = viewer.user?.status === "rejected"

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          <IconChip icon={rejected ? ShieldX : Clock} tone={rejected ? "rose" : "amber"} size="lg" />
          <Badge variant={rejected ? "destructive" : "warning"}>{rejected ? "Declined" : "Pending approval"}</Badge>
        </div>
        <CardTitle className="text-xl">{rejected ? "Access not approved" : "Waiting for approval"}</CardTitle>
        <CardDescription>
          {rejected
            ? "An admin has declined CMS access for this account. If you think this is a mistake, contact the dailymattr team."
            : "Your request to use the dailymattr CMS has been sent. An admin needs to accept it before you can sign in."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-lg bg-muted px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">Signed in as </span>
          <span className="font-medium">{viewer.email}</span>
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        {!rejected && (
          // Opening the CMS re-checks the status: approved people get in, others come back here.
          <Link href="/" prefetch={false} className={buttonVariants()}>
            <RefreshCw data-icon="inline-start" />
            Check again
          </Link>
        )}
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            {rejected ? "Sign out" : "Use another account"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
