import { Suspense } from "react"
import type { Metadata } from "next"

import { WebsiteUnavailable } from "@/components/cms/seo/website-unavailable"
import { requireApprovedUser } from "@/lib/dal"
import { emptyPageOverrides } from "@/lib/seo/fields"

import { EditorSkeleton } from "../editor-skeleton"
import { loadSeoBase } from "../load"
import { PageEditor } from "../page-editor"

export const metadata: Metadata = { title: "Add a page" }

/** /seo/new: SEO for a website route that has no defaults in the website's code. */
export default function NewSeoPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <NewPageEditor />
    </Suspense>
  )
}

async function NewPageEditor() {
  await requireApprovedUser()
  const base = await loadSeoBase()
  if (base.error !== null) return <WebsiteUnavailable url={base.websiteUrl} message={base.error} />

  return (
    <PageEditor
      mode="new"
      path=""
      defaults={undefined}
      overrides={emptyPageOverrides}
      site={base.site}
      previewOrigin={base.websiteUrl}
      updated={null}
      crumbs={[]}
    />
  )
}
