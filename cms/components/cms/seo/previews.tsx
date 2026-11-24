"use client"

import { useState } from "react"
import { Globe, ImageOff } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)

/** Roughly how the page shows up in Google results. */
export function GooglePreview({
  siteName,
  siteUrl,
  path,
  title,
  description,
}: {
  siteName: string
  siteUrl: string
  path: string
  title: string
  description: string
}) {
  let host = siteUrl
  try {
    host = new URL(siteUrl).host
  } catch {}
  const crumbs = [host, ...path.split("/").filter(Boolean)].join(" › ")

  return (
    <div className="grid gap-1.5 rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
          <Globe className="size-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm">{siteName}</p>
          <p className="truncate text-xs text-muted-foreground">{crumbs}</p>
        </div>
      </div>
      <p className="text-lg leading-snug text-primary">{clip(title, 60)}</p>
      <p className="text-sm text-muted-foreground">
        {description ? clip(description, 160) : "Add a meta description to control this snippet."}
      </p>
    </div>
  )
}

/** Roughly how the share card looks on WhatsApp, LinkedIn, X and Facebook. */
export function SocialPreview({
  siteUrl,
  image,
  title,
  description,
}: {
  siteUrl: string
  image: string
  title: string
  description: string
}) {
  const [failed, setFailed] = useState<string | null>(null)
  let host = siteUrl
  try {
    host = new URL(siteUrl).host
  } catch {}

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <AspectRatio ratio={1200 / 630} className="bg-muted">
        {failed === image ? (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <ImageOff className="size-5" />
            Image couldn&apos;t be loaded
          </div>
        ) : (
          // A plain <img>: the share image can live on any host, so next/image doesn't fit here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="size-full object-cover"
            onError={() => setFailed(image)}
          />
        )}
      </AspectRatio>
      <div className="grid gap-0.5 border-t p-3">
        <p className="text-xs text-muted-foreground uppercase">{host}</p>
        <p className="line-clamp-1 text-sm font-medium">{title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
