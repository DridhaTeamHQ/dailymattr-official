"use client"

import { useState, useTransition } from "react"
import { ArrowUpRight, Eye, EyeOff, History, Link2, PenLine, ShieldCheck } from "lucide-react"

import { IconChip } from "@/components/cms/icon-chip"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import type { NewsItem } from "@/lib/news/data"
import { cn } from "@/lib/utils"

import { setNewsVisibility } from "./actions"
import { StoryPhoto, VisibilityChip } from "./story-parts"

/**
 * Customize a story: a preview of its card in the website's news section, and the switch
 * that shows or hides it there. Saving tells the website to refresh straight away.
 */
export function CustomizeDialog({
  item,
  onOpenChange,
}: {
  item: NewsItem | null
  onOpenChange: (open: boolean) => void
}) {
  // The last story shown, so the dialog keeps its content while it animates closed.
  const [shown, setShown] = useState(item)
  const [show, setShow] = useState(item?.show ?? true)
  const [saving, startSaving] = useTransition()

  // A different story (or its saved setting changed): start from its saved setting. Set
  // during render, React's pattern for state that follows a prop.
  if (item && (item.id !== shown?.id || item.show !== shown?.show)) {
    setShown(item)
    setShow(item.show)
  }

  const story = item ?? shown
  const changed = story ? show !== story.show : false

  function save() {
    if (!story) return
    startSaving(async () => {
      const result = await setNewsVisibility([{ id: story.id, pixId: story.pixId }], show)
      showSaveToast(result, show ? "Showing on the website" : "Hidden from the website")
      if (result.ok) onOpenChange(false)
    })
  }

  return (
    <Dialog open={item !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        {story && (
          <div className="grid md:grid-cols-[17rem_minmax(0,1fr)]">
            {/* Website preview */}
            <div className="flex flex-col gap-3 border-b bg-muted/60 p-5 md:border-r md:border-b-0">
              <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Website preview
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <StoryPhoto
                    src={story.image}
                    sizes="272px"
                    className={cn("transition-[filter,opacity] duration-300", !show && "opacity-45 grayscale")}
                  />
                  <span className="absolute top-2.5 left-2.5">
                    <VisibilityChip show={show} />
                  </span>
                  {!show && (
                    <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-xs font-medium shadow-sm">
                      <EyeOff className="size-3.5 shrink-0 text-warning" aria-hidden />
                      Visitors won&apos;t see this story
                    </span>
                  )}
                </div>
                <p className="text-[0.9375rem] leading-[1.35] font-semibold tracking-[-0.01em]">{story.headline}</p>
                <p className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{story.day}</span>
                  {story.section && <span className="font-semibold text-primary">{story.section.label}</span>}
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="flex min-w-0 flex-col gap-5 p-6">
              <div className="pr-8">
                <DialogTitle className="text-lg font-semibold tracking-tight">Customize story</DialogTitle>
                <DialogDescription className="mt-1">
                  Pix #{story.pixId} · Published {story.day}, {story.time}
                </DialogDescription>
              </div>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition-colors",
                  show ? "bg-success/8 ring-success/25" : "bg-warning/8 ring-warning/30"
                )}
              >
                <IconChip icon={show ? Eye : EyeOff} tone={show ? "green" : "amber"} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Show in the website&apos;s news section</span>
                  <span className="mt-0.5 block text-muted-foreground">
                    {show
                      ? `Visitors see it under Latest${story.section ? ` and ${story.section.label}` : ""}, and its story page is open.`
                      : "It's left out of every news list, and its story page shows “not found”."}
                  </span>
                </span>
                <Switch checked={show} onCheckedChange={setShow} aria-label="Show in the website's news section" className="mt-1" />
              </label>

              {story.points.length > 0 && (
                <section aria-labelledby="key-points">
                  <h3 id="key-points" className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    Key points
                  </h3>
                  <ul className="mt-2 flex max-h-44 flex-col gap-2.5 overflow-y-auto pr-1">
                    {story.points.map((point, i) => (
                      <li key={i} className="flex gap-2.5 leading-relaxed">
                        <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-brand-blue" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <dl className="grid gap-2.5 rounded-2xl bg-muted/60 p-4 sm:grid-cols-2">
                {story.source && (
                  <Detail icon={Link2} label="Source">
                    <a href={story.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {story.source.label}
                    </a>
                  </Detail>
                )}
                {story.author && (
                  <Detail icon={PenLine} label="Made in Pix by">
                    {story.author}
                  </Detail>
                )}
                {story.approvedBy && (
                  <Detail icon={ShieldCheck} label="Approved by">
                    {story.approvedBy}
                  </Detail>
                )}
                <Detail icon={History} label="Website setting">
                  {story.changed ? (
                    <span>
                      <Badge variant={story.show ? "success" : "warning"} className="mr-1.5">
                        {story.show ? "Shown" : "Hidden"}
                      </Badge>
                      {story.changed.by ? `${story.changed.by}, ` : ""}
                      {story.changed.at}
                    </span>
                  ) : (
                    "Default (shown)"
                  )}
                </Detail>
              </dl>

              <div className="mt-auto flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center">
                {story.websiteHref && story.show && (
                  <a
                    href={story.websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "link" }), "px-0 sm:mr-auto")}
                  >
                    Open on website
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
                <div className="flex gap-2 sm:ml-auto">
                  <DialogClose render={<Button variant="outline" className="flex-1 sm:flex-none" />}>Cancel</DialogClose>
                  <Button onClick={save} disabled={!changed || saving} className="flex-1 sm:flex-none">
                    {saving && <Spinner data-icon="inline-start" />}
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Eye
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 truncate">{children}</dd>
      </div>
    </div>
  )
}
