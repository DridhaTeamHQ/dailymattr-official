"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/** Move an item one place earlier or later in a list. */
export function MoveButtons({
  index,
  count,
  onMove,
  disabled,
  label,
}: {
  index: number
  count: number
  onMove: (from: number, to: number) => void
  disabled?: boolean
  label: string
}) {
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        disabled={disabled || index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label={`Move ${label} earlier`}
      >
        <ArrowUp className="-rotate-90 sm:rotate-0" />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        disabled={disabled || index === count - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label={`Move ${label} later`}
      >
        <ArrowDown className="-rotate-90 sm:rotate-0" />
      </Button>
    </div>
  )
}

/** Delete, behind an "are you sure?" step. */
export function DeleteButton({
  what,
  onConfirm,
  disabled,
  compact,
}: {
  what: string
  onConfirm: () => void
  disabled?: boolean
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size={compact ? "icon-sm" : "default"}
            disabled={disabled}
            aria-label={compact ? `Delete ${what}` : undefined}
          />
        }
      >
        <Trash2 data-icon={compact ? undefined : "inline-start"} />
        {!compact && "Delete"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {what}?</AlertDialogTitle>
          <AlertDialogDescription>
            It comes off the website straight away and can&apos;t be brought back. To take it down for a while
            instead, switch off &ldquo;Show on website&rdquo;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** A labelled on / off setting in a form. */
export function SwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-border transition-colors",
        checked && "bg-brand-blue-soft/50 ring-primary/25",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} aria-label={label} className="mt-0.5" />
    </label>
  )
}

/** Moves one item in a copy of a list. */
export function moved<T>(list: T[], from: number, to: number): T[] {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/** "25 Nov, 2:05 pm" in India time. */
export function shortWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}
