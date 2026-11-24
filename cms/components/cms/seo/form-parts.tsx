"use client"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import type { SaveResult } from "@/lib/seo/forms"

/** Label row (with a "Custom" badge when the field overrides a default), control, then hint or error. */
export function Field({
  id,
  label,
  custom,
  counter,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  custom?: boolean
  counter?: React.ReactNode
  hint?: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {custom && <Badge variant="info">Custom</Badge>}
        {counter && <span className="ml-auto text-xs text-muted-foreground tabular-nums">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export type Choice = { value: string; label: string }

/** A full-width Select over a fixed list of choices. */
export function ChoiceSelect({
  id,
  value,
  onChange,
  items,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  items: Choice[]
}) {
  return (
    <Select items={items} value={value} onValueChange={(next) => onChange(String(next))}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Toast after a save: says whether the website already shows the change. */
export function showSaveToast(result: SaveResult, title = "Saved") {
  if (result.ok) {
    toast.add({
      type: "success",
      title,
      description: result.live
        ? "Live on the website now."
        : "The website couldn't be reached just now. It will show the change within a minute or two.",
    })
  } else {
    toast.add({ type: "error", title: "Not saved", description: result.error })
  }
}
