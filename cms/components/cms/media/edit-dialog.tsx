"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/** ["a title", "a video"] → "a title and a video". */
export function listWords(items: string[]) {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}

/**
 * The frame every Qix / Trax editor shares: a website preview on the left, the form on the
 * right, and Delete / Cancel / Save along the bottom.
 */
export function EditDialog({
  open,
  onClose,
  title,
  description,
  preview,
  children,
  onSave,
  saving,
  canSave,
  saveHint,
  deleteButton,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  description: string
  preview: React.ReactNode
  children: React.ReactNode
  onSave: () => void
  saving: boolean
  canSave: boolean
  /** Why Save is off (what's missing), shown beside it. */
  saveHint?: string
  deleteButton?: React.ReactNode
  wide?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && !saving && onClose()}>
      <DialogContent className={`max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 ${wide ? "sm:max-w-4xl" : "sm:max-w-3xl"}`}>
        <form
          className="grid md:grid-cols-[16rem_minmax(0,1fr)]"
          onSubmit={(e) => {
            e.preventDefault()
            if (canSave && !saving) onSave()
          }}
        >
          <div className="flex flex-col gap-3 border-b bg-muted/60 p-5 md:border-r md:border-b-0">
            <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">Website preview</p>
            {preview}
          </div>

          <div className="flex min-w-0 flex-col gap-5 p-6">
            <div className="pr-8">
              <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
              <DialogDescription className="mt-1">{description}</DialogDescription>
            </div>

            {children}

            <div className="mt-auto flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center">
              {deleteButton && <div className="sm:mr-auto">{deleteButton}</div>}
              {!canSave && !saving && saveHint && (
                <p role="status" className="text-xs text-muted-foreground sm:ml-auto sm:max-w-56 sm:text-right">
                  {saveHint}
                </p>
              )}
              <div className={cn("flex gap-2", (canSave || saving || !saveHint) && "sm:ml-auto")}>
                <DialogClose render={<Button type="button" variant="outline" className="flex-1 sm:flex-none" disabled={saving} />}>
                  Cancel
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!canSave || saving}
                  className="flex-1 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 sm:flex-none"
                >
                  {saving && <Spinner data-icon="inline-start" />}
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
