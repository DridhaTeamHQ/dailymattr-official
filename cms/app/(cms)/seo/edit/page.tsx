import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { WebsiteUnavailable } from "@/components/cms/seo/website-unavailable"
import { requireApprovedUser } from "@/lib/dal"
import { getSeoPage, toPageOverrides } from "@/lib/seo/data"
import { normalizePath } from "@/lib/seo/fields"
import { ancestry, lastSegment } from "@/lib/seo/tree"

import { EditorSkeleton } from "../editor-skeleton"
import { formatEdited, loadSeoBase } from "../load"
import { PageEditor } from "../page-editor"

export const metadata: Metadata = { title: "Edit page SEO" }

/** /seo/edit?path=/about: one page's SEO, with the website's defaults as placeholders. */
export default function EditSeoPage({ searchParams }: PageProps<"/seo/edit">) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Editor searchParams={searchParams} />
    </Suspense>
  )
}

async function Editor({ searchParams }: Pick<PageProps<"/seo/edit">, "searchParams">) {
  await requireApprovedUser()
  const { path: raw } = await searchParams
  const path = typeof raw === "string" ? normalizePath(raw) : null
  if (!path) notFound()

  const base = await loadSeoBase()
  if (base.error !== null) return <WebsiteUnavailable url={base.websiteUrl} message={base.error} />

  const defaults = base.defaults.pages.find((page) => page.path === path)
  const row = await getSeoPage(path)
  // Neither on the website nor added in the CMS: nothing to edit.
  if (!defaults && !row) notFound()

  return (
    <PageEditor
      // Remount after each save, so the form starts from what was just stored.
      key={row?.updatedAt.toISOString() ?? "defaults"}
      mode="edit"
      path={path}
      defaults={defaults}
      overrides={toPageOverrides(row)}
      site={base.site}
      previewOrigin={base.websiteUrl}
      updated={row ? { at: formatEdited(row.updatedAt), by: row.updatedBy } : null}
      crumbs={ancestry(path)
        .slice(0, -1)
        .map((folder) => ({
          path: folder,
          label: base.defaults.pages.find((page) => page.path === folder)?.title ?? lastSegment(folder),
        }))}
    />
  )
}
