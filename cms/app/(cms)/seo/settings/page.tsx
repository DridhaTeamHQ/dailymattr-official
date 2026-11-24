import { Suspense } from "react"
import type { Metadata } from "next"

import { WebsiteUnavailable } from "@/components/cms/seo/website-unavailable"
import { requireApprovedUser } from "@/lib/dal"
import { toSiteOverrides } from "@/lib/seo/data"

import { EditorSkeleton } from "../editor-skeleton"
import { formatEdited, loadSeoBase } from "../load"
import { SettingsForm } from "./settings-form"

export const metadata: Metadata = { title: "SEO site settings" }

/** Site-wide SEO: name, title template, fallbacks for every page, and verification codes. */
export default function SeoSettingsPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Settings />
    </Suspense>
  )
}

async function Settings() {
  await requireApprovedUser()
  const base = await loadSeoBase()
  if (base.error !== null) return <WebsiteUnavailable url={base.websiteUrl} message={base.error} />

  return (
    <SettingsForm
      key={base.settings?.updatedAt.toISOString() ?? "defaults"}
      defaults={base.defaults.site}
      overrides={toSiteOverrides(base.settings)}
      previewOrigin={base.websiteUrl}
      updated={base.settings ? { at: formatEdited(base.settings.updatedAt), by: base.settings.updatedBy } : null}
    />
  )
}
