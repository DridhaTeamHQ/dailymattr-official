"use client"

import { useState, useTransition } from "react"
import { Check, X } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { UserStatus } from "@/lib/generated/prisma/enums"

import { approveUser, rejectUser } from "./actions"

type Busy = "approve" | "reject" | null

export function UserActions({
  userId,
  label,
  status,
}: {
  userId: string
  label: string
  status: UserStatus
}) {
  const [busy, setBusy] = useState<Busy>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [, startTransition] = useTransition()

  function run(kind: Exclude<Busy, null>) {
    setBusy(kind)
    startTransition(async () => {
      try {
        await (kind === "approve" ? approveUser(userId) : rejectUser(userId))
      } finally {
        setBusy(null)
      }
    })
  }

  if (status === "pending") {
    return (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("reject")}>
          {busy === "reject" ? <Spinner data-icon="inline-start" /> : <X data-icon="inline-start" />}
          Reject
        </Button>
        <Button size="sm" disabled={!!busy} onClick={() => run("approve")}>
          {busy === "approve" ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />}
          Accept
        </Button>
      </div>
    )
  }

  if (status === "rejected") {
    return (
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run("approve")}>
          {busy === "approve" ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />}
          Approve
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger render={<Button size="sm" variant="outline" disabled={!!busy} />}>
          {busy === "reject" && <Spinner data-icon="inline-start" />}
          Revoke access
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke access for {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              They&apos;ll be moved to Rejected and can&apos;t use the CMS until an admin approves
              them again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false)
                run("reject")
              }}
            >
              Revoke access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
