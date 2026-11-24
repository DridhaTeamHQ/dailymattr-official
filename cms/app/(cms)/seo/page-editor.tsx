"use client"

import { Fragment, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Braces, Globe, ImageIcon, RotateCcw, ScanSearch, Search, Share2 } from "lucide-react"

import { SectionTitle } from "@/components/cms/section-title"
import { ChecksCard } from "@/components/cms/seo/checks-card"
import { ChoiceSelect, Field, showSaveToast } from "@/components/cms/seo/form-parts"
import { GooglePreview, SocialPreview } from "@/components/cms/seo/previews"
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
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  absoluteUrl,
  changeFrequencies,
  effectivePage,
  normalizePath,
  priorities,
  seoChecks,
  type EffectiveSite,
  type PageDefaults,
  type PageOverrides,
} from "@/lib/seo/fields"
import { previewOverrides, toPageForm, type PageForm } from "@/lib/seo/forms"
import { folderHref, parentOf } from "@/lib/seo/tree"

import { resetPageSeo, savePageSeo } from "./actions"

type Props = {
  /** "new" adds a page the website has no defaults for. */
  mode: "edit" | "new"
  path: string
  defaults: PageDefaults | undefined
  overrides: PageOverrides
  site: EffectiveSite
  /** Where relative image paths load from in the previews (the website in dev). */
  previewOrigin: string
  updated: { at: string; by: string | null } | null
  /** The folders this page sits in, top down, e.g. /news then /news/india. */
  crumbs: { path: string; label: string }[]
}

export function PageEditor({
  mode,
  path: savedPath,
  defaults,
  overrides,
  site,
  previewOrigin,
  updated,
  crumbs,
}: Props) {
  const router = useRouter()
  const [initial] = useState(() => toPageForm(overrides))
  const [form, setForm] = useState(initial)
  const [newPath, setNewPath] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, startSaving] = useTransition()
  const [resetting, startResetting] = useTransition()
  const [resetOpen, setResetOpen] = useState(false)

  const set = <K extends keyof PageForm>(key: K) => (value: PageForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const path = mode === "new" ? (normalizePath(newPath) ?? "/") : savedPath
  const page = effectivePage(path, defaults, previewOverrides(form), site)
  const checks = seoChecks(page)
  const customized = Object.values(overrides).some((value) => value != null)
  const dirty = JSON.stringify(form) !== JSON.stringify(initial) || (mode === "new" && !!newPath)
  const isCustom = (key: keyof PageForm) => form[key] !== "" && form[key] !== "default"

  function save() {
    startSaving(async () => {
      const result = await savePageSeo(mode === "new" ? { newPath } : { path: savedPath }, form)
      setErrors(result.ok ? {} : (result.fieldErrors ?? {}))
      showSaveToast(result)
      if (result.ok && mode === "new") {
        router.push(`/seo/edit?path=${encodeURIComponent(normalizePath(newPath) ?? "/")}`)
      }
    })
  }

  function reset() {
    setResetOpen(false)
    startResetting(async () => {
      const result = await resetPageSeo(savedPath)
      showSaveToast(result, defaults ? "Back to the website's defaults" : "Page removed")
      // A page the website has no defaults for only exists through its overrides.
      if (result.ok && !defaults) router.push(folderHref(parentOf(savedPath)))
    })
  }

  function insertJsonLdTemplate() {
    set("jsonLd")(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.fullTitle,
          description: page.description,
          url: `${site.url}${path === "/" ? "" : path}`,
        },
        null,
        2
      )
    )
  }

  const flagChoices = (yes: string, no: string, defaultOn: boolean) => [
    { value: "default", label: `Default: ${defaultOn ? yes : no}` },
    { value: "no", label: no },
    { value: "yes", label: yes },
  ]

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        save()
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/seo" />}>All pages</BreadcrumbLink>
              </BreadcrumbItem>
              {crumbs.map((crumb) => (
                <Fragment key={crumb.path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href={folderHref(crumb.path)} />}>{crumb.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              ))}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-60 truncate">
                  {mode === "new" ? "Add a page" : page.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight">
            {mode === "new" ? "Add a page" : page.title}
          </h1>
          {mode === "edit" && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <code className="font-mono">{savedPath}</code>
              {!defaults && <Badge variant="secondary">Added in CMS</Badge>}
              <Badge variant={customized ? "info" : "outline"}>
                {customized ? "Customized" : "Website defaults"}
              </Badge>
              {updated && (
                <span>
                  Edited {updated.at}
                  {updated.by && ` by ${updated.by}`}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {mode === "edit" && customized && (
            <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
              <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={resetting} />}>
                {resetting ? <Spinner data-icon="inline-start" /> : <RotateCcw data-icon="inline-start" />}
                {defaults ? "Reset to defaults" : "Remove page"}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {defaults ? "Reset this page to the website's defaults?" : "Remove this page from SEO?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {defaults
                      ? "Every custom field on this page is cleared and the website goes back to the title, description and settings in its code."
                      : "This page has no defaults on the website, so its SEO entry is deleted."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={reset}>
                    {defaults ? "Reset" : "Remove"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" disabled={saving || !dirty}>
            {saving && <Spinner data-icon="inline-start" />}
            {mode === "new" ? "Add page" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          {/* Search appearance */}
          <Card>
            <CardHeader>
              <SectionTitle icon={Search} tone="green">Search appearance</SectionTitle>
              <CardDescription>
                What people see in Google before they click. Leave a field blank to use the website&apos;s
                default, shown in grey.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {mode === "new" && (
                <Field
                  id="path"
                  label="Route path"
                  hint="The page's address on the website, e.g. /news/sports. Only for pages that aren't in the list yet."
                  error={errors.path}
                >
                  <Input
                    id="path"
                    value={newPath}
                    onChange={(event) => setNewPath(event.target.value)}
                    placeholder="/new-page"
                    className="font-mono"
                    aria-invalid={!!errors.path}
                    required
                  />
                </Field>
              )}
              <Field
                id="title"
                label="Title"
                custom={isCustom("title")}
                counter={`${page.fullTitle.length} / 60`}
                hint={<>Shown as “{page.fullTitle}”</>}
                error={errors.title}
              >
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => set("title")(event.target.value)}
                  placeholder={defaults?.title ?? site.name}
                  aria-invalid={!!errors.title}
                />
              </Field>
              <Field
                id="description"
                label="Meta description"
                custom={isCustom("description")}
                counter={`${page.description.length} / 160`}
                error={errors.description}
              >
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => set("description")(event.target.value)}
                  placeholder={defaults?.description ?? site.description}
                  rows={3}
                  aria-invalid={!!errors.description}
                />
              </Field>
              <Field
                id="keywords"
                label="Focus keywords"
                custom={isCustom("keywords")}
                hint="Comma separated. The first is the main keyword. Without any, the site's default keywords apply."
                error={errors.keywords}
              >
                <Input
                  id="keywords"
                  value={form.keywords}
                  onChange={(event) => set("keywords")(event.target.value)}
                  placeholder={site.keywords.slice(0, 3).join(", ")}
                  aria-invalid={!!errors.keywords}
                />
              </Field>
              <Field
                id="canonical"
                label="Canonical URL"
                custom={isCustom("canonical")}
                hint="Leave blank to use this page's own address. Set it only when another URL is the main copy of this content."
                error={errors.canonical}
              >
                <Input
                  id="canonical"
                  value={form.canonical}
                  onChange={(event) => set("canonical")(event.target.value)}
                  placeholder={path}
                  aria-invalid={!!errors.canonical}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Social share */}
          <Card>
            <CardHeader>
              <SectionTitle icon={Share2} tone="teal">Social share</SectionTitle>
              <CardDescription>The card shown when the page is shared on WhatsApp, LinkedIn, X or Facebook.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Field id="ogTitle" label="Share title" custom={isCustom("ogTitle")} error={errors.ogTitle}>
                <Input
                  id="ogTitle"
                  value={form.ogTitle}
                  onChange={(event) => set("ogTitle")(event.target.value)}
                  placeholder={page.fullTitle}
                  aria-invalid={!!errors.ogTitle}
                />
              </Field>
              <Field
                id="ogDescription"
                label="Share description"
                custom={isCustom("ogDescription")}
                error={errors.ogDescription}
              >
                <Textarea
                  id="ogDescription"
                  value={form.ogDescription}
                  onChange={(event) => set("ogDescription")(event.target.value)}
                  placeholder={page.description}
                  rows={2}
                  aria-invalid={!!errors.ogDescription}
                />
              </Field>
              <Field
                id="image"
                label="Share image"
                custom={isCustom("image")}
                hint="A full https:// image URL, 1200 × 630 px. Leave blank to use the page's or the site's default image."
                error={errors.image}
              >
                <Input
                  id="image"
                  value={form.image}
                  onChange={(event) => set("image")(event.target.value)}
                  placeholder={defaults?.image ?? site.image}
                  aria-invalid={!!errors.image}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Indexing & sitemap */}
          <Card>
            <CardHeader>
              <SectionTitle icon={ScanSearch} tone="green">Indexing &amp; sitemap</SectionTitle>
              <CardDescription>Whether search engines list this page, and how it appears in sitemap.xml.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Field
                id="noindex"
                label="Search results"
                custom={isCustom("noindex")}
                hint="Hidden pages are also left out of the sitemap."
              >
                <ChoiceSelect
                  id="noindex"
                  value={form.noindex}
                  onChange={(value) => set("noindex")(value as PageForm["noindex"])}
                  items={flagChoices("Hide (noindex)", "Show in search", !!defaults?.noindex)}
                />
              </Field>
              <Field
                id="nofollow"
                label="Links on this page"
                custom={isCustom("nofollow")}
                hint="Nofollow stops search engines passing ranking through this page's links."
              >
                <ChoiceSelect
                  id="nofollow"
                  value={form.nofollow}
                  onChange={(value) => set("nofollow")(value as PageForm["nofollow"])}
                  items={flagChoices("Don't follow (nofollow)", "Follow", false)}
                />
              </Field>
              <Field id="priority" label="Sitemap priority" custom={isCustom("priority")} error={errors.priority}>
                <ChoiceSelect
                  id="priority"
                  value={form.priority}
                  onChange={set("priority")}
                  items={[
                    { value: "default", label: `Default: ${defaults?.priority?.toFixed(1) ?? "not set"}` },
                    ...priorities.map((value) => ({ value: String(value), label: value.toFixed(1) })),
                  ]}
                />
              </Field>
              <Field
                id="changeFrequency"
                label="Change frequency"
                custom={isCustom("changeFrequency")}
                error={errors.changeFrequency}
              >
                <ChoiceSelect
                  id="changeFrequency"
                  value={form.changeFrequency}
                  onChange={set("changeFrequency")}
                  items={[
                    { value: "default", label: `Default: ${defaults?.changeFrequency ?? "not set"}` },
                    ...changeFrequencies.map((value) => ({ value, label: value })),
                  ]}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Structured data */}
          <Card>
            <CardHeader>
              <SectionTitle icon={Braces} tone="amber">Structured data</SectionTitle>
              <CardDescription>Optional JSON-LD for rich results, added to this page only.</CardDescription>
              <CardAction>
                <Button type="button" variant="outline" size="sm" onClick={insertJsonLdTemplate}>
                  <Braces data-icon="inline-start" />
                  WebPage template
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Field id="jsonLd" label="JSON-LD" custom={isCustom("jsonLd")} error={errors.jsonLd}>
                <Textarea
                  id="jsonLd"
                  value={form.jsonLd}
                  onChange={(event) => set("jsonLd")(event.target.value)}
                  placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'}
                  rows={8}
                  spellCheck={false}
                  className="font-mono text-xs"
                  aria-invalid={!!errors.jsonLd}
                />
              </Field>
            </CardContent>
          </Card>
        </div>

        {/* Previews */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-20">
          <Card size="sm">
            <CardHeader>
              <SectionTitle icon={Globe} tone="green">Google preview</SectionTitle>
            </CardHeader>
            <CardContent>
              <GooglePreview
                siteName={site.name}
                siteUrl={site.url}
                path={path}
                title={page.fullTitle}
                description={page.description}
              />
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <SectionTitle icon={ImageIcon} tone="teal">Social preview</SectionTitle>
            </CardHeader>
            <CardContent>
              <SocialPreview
                siteUrl={site.url}
                image={absoluteUrl(page.image, previewOrigin)}
                title={page.ogTitle}
                description={page.ogDescription}
              />
            </CardContent>
          </Card>
          <ChecksCard checks={checks} />
        </div>
      </div>
    </form>
  )
}
