"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Folder, FolderOpen, Pencil, Search } from "lucide-react"

import { IconChip } from "@/components/cms/icon-chip"
import { ChoiceSelect } from "@/components/cms/seo/form-parts"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ancestry, childrenOf, folderHref, lastSegment } from "@/lib/seo/tree"

export type SeoListItem = {
  path: string
  title: string
  noindex: boolean
  customized: boolean
  addedInCms: boolean
  score: number
  total: number
  edited: { at: string; by: string | null } | null
}

type Row =
  | { kind: "page"; item: SeoListItem; inside: number }
  | { kind: "folder"; path: string; inside: number }

const filters = [
  { value: "all", label: "All pages" },
  { value: "customized", label: "Customized" },
  { value: "defaults", label: "Using defaults" },
  { value: "hidden", label: "Hidden from search" },
  { value: "needs-work", label: "Needs work" },
]

const PAGE_SIZE = 25

export const editHref = (path: string) => `/seo/edit?path=${encodeURIComponent(path)}`

/**
 * The SEO list, one folder at a time: top-level pages first, and the pages inside a page
 * (e.g. /news → /news/india → stories) one click further in. Searching or filtering looks
 * through every level at once.
 */
export function SeoTable({ items, folder }: { items: SeoListItem[]; folder: string | null }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(0)

  const byPath = new Map(items.map((item) => [item.path, item]))
  const paths = items.map((item) => item.path)
  // How many pages sit inside each path, at any depth.
  const insideCount = new Map<string, number>()
  for (const path of paths) {
    for (const folderPath of ancestry(path).slice(0, -1)) {
      insideCount.set(folderPath, (insideCount.get(folderPath) ?? 0) + 1)
    }
  }

  const q = query.trim().toLowerCase()
  const searching = q !== "" || filter !== "all"
  const matches = (item: SeoListItem) => {
    if (q && !item.path.toLowerCase().includes(q) && !item.title.toLowerCase().includes(q)) return false
    if (filter === "customized") return item.customized
    if (filter === "defaults") return !item.customized
    if (filter === "hidden") return item.noindex
    if (filter === "needs-work") return item.score < item.total
    return true
  }

  const rows: Row[] = searching
    ? items.filter(matches).map((item) => ({ kind: "page", item, inside: insideCount.get(item.path) ?? 0 }))
    : childrenOf(folder, paths).map((entry) =>
        entry.isPage
          ? { kind: "page", item: byPath.get(entry.path)!, inside: entry.inside }
          : { kind: "folder", path: entry.path, inside: entry.inside }
      )

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pageCount - 1)
  const visible = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE)
  const folderItem = folder ? byPath.get(folder) : undefined
  const label = (path: string) => byPath.get(path)?.title ?? lastSegment(path)

  return (
    <div className="flex flex-col gap-4">
      {/* Where you are */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {folder ? (
              <BreadcrumbLink render={<Link href="/seo" />}>All pages</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>All pages</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {folder &&
            ancestry(folder).map((path, i, all) => (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === all.length - 1 ? (
                    <BreadcrumbPage>{label(path)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={folderHref(path)} />}>{label(path)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* The page whose inside pages are listed below */}
      {folder && !searching && (
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              <IconChip icon={FolderOpen} tone="amber" size="sm" />
              {folderItem ? folderItem.title : lastSegment(folder)}
              {folderItem && (
                <Badge variant={folderItem.customized ? "info" : "outline"}>
                  {folderItem.customized ? "Customized" : "Default"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              <code className="font-mono">{folder}</code>
              {folderItem ? " · this page" : " · groups the pages below, no page of its own"}
              {` · ${insideCount.get(folder) ?? 0} pages inside`}
            </CardDescription>
            {folderItem && (
              <CardAction>
                <Link href={editHref(folder)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  <Pencil data-icon="inline-start" />
                  Edit SEO
                </Link>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <InputGroup className="max-w-sm flex-1">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(0)
            }}
            placeholder="Search all pages by title or path"
            aria-label="Search pages"
          />
        </InputGroup>
        <div className="w-48">
          <ChoiceSelect
            id="seo-filter"
            value={filter}
            onChange={(value) => {
              setFilter(value)
              setPage(0)
            }}
            items={filters}
          />
        </div>
        <p className="ml-auto self-center text-sm text-muted-foreground tabular-nums">
          {searching ? `${rows.length} matches across all levels` : `${rows.length} here`}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Page</TableHead>
              <TableHead>Search</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Checks</TableHead>
              <TableHead className="hidden lg:table-cell">Last edited</TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Open</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {searching ? "No pages match." : "Nothing inside this page yet."}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row) =>
                row.kind === "folder" ? (
                  <FolderRow key={row.path} path={row.path} inside={row.inside} />
                ) : (
                  <PageRow key={row.item.path} item={row.item} inside={row.inside} />
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {current + 1} of {pageCount}
          </span>
          <Button variant="outline" size="icon-sm" aria-label="Previous page" disabled={current === 0} onClick={() => setPage(current - 1)}>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={current >= pageCount - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

/** Green when every check passes, amber when about half do, calm grey below that. */
function scoreVariant(score: number, total: number) {
  if (score === total) return "success" as const
  if (score >= total / 2) return "warning" as const
  return "secondary" as const
}

function InsideLink({ path, inside }: { path: string; inside: number }) {
  return (
    <Link
      href={folderHref(path)}
      className={buttonVariants({ variant: "secondary", size: "xs" })}
      aria-label={`Open the ${inside} pages inside ${path}`}
    >
      <FolderOpen data-icon="inline-start" />
      {inside} inside
    </Link>
  )
}

function PageRow({ item, inside }: { item: SeoListItem; inside: number }) {
  return (
    <TableRow>
      <TableCell className="pl-4">
        <div className="flex items-center gap-3">
          <Link href={editHref(item.path)} className="block min-w-0 max-w-56 sm:max-w-md">
            <span className="block truncate font-medium hover:underline">{item.title}</span>
            <code className="block truncate font-mono text-xs text-muted-foreground">{item.path}</code>
          </Link>
          {inside > 0 && <InsideLink path={item.path} inside={inside} />}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={item.noindex ? "warning" : "success"}>{item.noindex ? "Hidden" : "Indexed"}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Badge variant={item.customized ? "info" : "outline"}>
            {item.customized ? "Customized" : "Default"}
          </Badge>
          {item.addedInCms && <Badge variant="secondary">Added in CMS</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={scoreVariant(item.score, item.total)} className="tabular-nums">
          {item.score}/{item.total}
        </Badge>
      </TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {item.edited ? (
          <div className="leading-tight">
            <p>{item.edited.at}</p>
            {item.edited.by && <p className="text-xs">by {item.edited.by}</p>}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="pr-4">
        <Link
          href={editHref(item.path)}
          aria-label={`Edit SEO for ${item.path}`}
          className="flex text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  )
}

/** A path that only groups other pages, e.g. /formats (its pages are /formats/pix, …). */
function FolderRow({ path, inside }: { path: string; inside: number }) {
  return (
    <TableRow>
      <TableCell className="pl-4">
        <Link href={folderHref(path)} className="flex items-center gap-3">
          <IconChip icon={Folder} tone="amber" size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium capitalize hover:underline">{lastSegment(path)}</span>
            <code className="block truncate font-mono text-xs text-muted-foreground">{path}</code>
          </span>
        </Link>
      </TableCell>
      <TableCell colSpan={4} className="text-muted-foreground">
        Folder · {inside} {inside === 1 ? "page" : "pages"}
      </TableCell>
      <TableCell className="pr-4">
        <Link
          href={folderHref(path)}
          aria-label={`Open ${path}`}
          className="flex text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  )
}
