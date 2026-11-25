"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, Globe, ImageIcon, RotateCcw, Search } from "lucide-react"

import { SectionTitle } from "@/components/cms/section-title"
import { Field, showSaveToast } from "@/components/cms/seo/form-parts"
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  absoluteUrl,
  effectiveSite,
  emptySiteOverrides,
  type SiteDefaults,
  type SiteOverrides,
} from "@/lib/seo/fields"
import { previewSiteOverrides, toSiteForm, type SiteForm } from "@/lib/seo/forms"

import { saveSiteSettings } from "../actions"

type Props = {
  defaults: SiteDefaults
  overrides: SiteOverrides
  previewOrigin: string
  updated: { at: string; by: string | null } | null
}

export function SettingsForm({ defaults, overrides, previewOrigin, updated }: Props) {
  const [initial] = useState(() => toSiteForm(overrides))
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, startSaving] = useTransition()
  const [resetOpen, setResetOpen] = useState(false)

  const set = (key: keyof SiteForm) => (value: string) => setForm((current) => ({ ...current, [key]: value }))
  const site = effectiveSite(defaults, previewSiteOverrides(form))
  const customized = Object.values(overrides).some((value) => value != null)
  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const isCustom = (key: keyof SiteForm) => form[key] !== ""
  const exampleTitle = site.titleTemplate.replace("%s", "About Us")

  function submit(values: SiteForm, title?: string) {
    startSaving(async () => {
      const result = await saveSiteSettings(values)
      setErrors(result.ok ? {} : (result.fieldErrors ?? {}))
      showSaveToast(result, title)
    })
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        submit(form)
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href="/seo"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            SEO
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Site settings</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Defaults for every page on {site.url.replace(/^https?:\/\//, "")}</span>
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
        </div>
        <div className="flex gap-2">
          {customized && (
            <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
              <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={saving} />}>
                <RotateCcw data-icon="inline-start" />
                Reset to defaults
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset site settings to the website&apos;s defaults?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Every site-wide setting here is cleared. Pages you customized keep their own changes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      setResetOpen(false)
                      submit(toSiteForm(emptySiteOverrides), "Back to the website's defaults")
                    }}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" disabled={saving || !dirty}>
            {saving && <Spinner data-icon="inline-start" />}
            Save changes
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <SectionTitle icon={Globe} tone="blue">Site identity</SectionTitle>
              <CardDescription>
                Used on every page unless a page sets its own. Leave a field blank to keep the website&apos;s
                default, shown in grey.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="siteName" label="Site name" custom={isCustom("siteName")} error={errors.siteName}>
                  <Input
                    id="siteName"
                    value={form.siteName}
                    onChange={(event) => set("siteName")(event.target.value)}
                    placeholder={defaults.name}
                    aria-invalid={!!errors.siteName}
                  />
                </Field>
                <Field
                  id="titleTemplate"
                  label="Title template"
                  custom={isCustom("titleTemplate")}
                  hint={<>%s is the page title, e.g. “{exampleTitle}”</>}
                  error={errors.titleTemplate}
                >
                  <Input
                    id="titleTemplate"
                    value={form.titleTemplate}
                    onChange={(event) => set("titleTemplate")(event.target.value)}
                    placeholder={defaults.titleTemplate}
                    aria-invalid={!!errors.titleTemplate}
                  />
                </Field>
              </div>
              <Field
                id="defaultDescription"
                label="Default meta description"
                custom={isCustom("defaultDescription")}
                counter={`${site.description.length} / 160`}
                hint="For pages without a description of their own."
                error={errors.defaultDescription}
              >
                <Textarea
                  id="defaultDescription"
                  value={form.defaultDescription}
                  onChange={(event) => set("defaultDescription")(event.target.value)}
                  placeholder={defaults.description}
                  rows={3}
                  aria-invalid={!!errors.defaultDescription}
                />
              </Field>
              <Field
                id="defaultKeywords"
                label="Default keywords"
                custom={isCustom("defaultKeywords")}
                hint="Comma separated. Used on pages without focus keywords."
                error={errors.defaultKeywords}
              >
                <Textarea
                  id="defaultKeywords"
                  value={form.defaultKeywords}
                  onChange={(event) => set("defaultKeywords")(event.target.value)}
                  placeholder={defaults.keywords.join(", ")}
                  rows={2}
                  aria-invalid={!!errors.defaultKeywords}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="defaultImage"
                  label="Default share image"
                  custom={isCustom("defaultImage")}
                  hint="A full https:// image URL, 1200 × 630 px."
                  error={errors.defaultImage}
                >
                  <Input
                    id="defaultImage"
                    value={form.defaultImage}
                    onChange={(event) => set("defaultImage")(event.target.value)}
                    placeholder={defaults.image}
                    aria-invalid={!!errors.defaultImage}
                  />
                </Field>
                <Field
                  id="twitterHandle"
                  label="X (Twitter) handle"
                  custom={isCustom("twitterHandle")}
                  hint="Credited on X share cards."
                  error={errors.twitterHandle}
                >
                  <Input
                    id="twitterHandle"
                    value={form.twitterHandle}
                    onChange={(event) => set("twitterHandle")(event.target.value)}
                    placeholder={defaults.twitterHandle ?? "@dailymattr"}
                    aria-invalid={!!errors.twitterHandle}
                  />
                </Field>
              </div>
              <Field
                id="siteUrl"
                label="Site URL"
                hint="Set by NEXT_PUBLIC_SITE_URL on the website, since canonical links and the sitemap depend on it."
              >
                <Input id="siteUrl" value={defaults.url} readOnly disabled />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle icon={BadgeCheck} tone="blue">Search engine verification</SectionTitle>
              <CardDescription>
                Prove you own the site. Choose the “HTML tag” method and paste only the code from content=&quot;…&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Field
                id="googleVerification"
                label="Google Search Console"
                custom={isCustom("googleVerification")}
                error={errors.googleVerification}
              >
                <Input
                  id="googleVerification"
                  value={form.googleVerification}
                  onChange={(event) => set("googleVerification")(event.target.value)}
                  placeholder={defaults.googleVerification ?? "Not set"}
                  className="font-mono"
                  aria-invalid={!!errors.googleVerification}
                />
              </Field>
              <Field
                id="bingVerification"
                label="Bing Webmaster Tools"
                custom={isCustom("bingVerification")}
                error={errors.bingVerification}
              >
                <Input
                  id="bingVerification"
                  value={form.bingVerification}
                  onChange={(event) => set("bingVerification")(event.target.value)}
                  placeholder={defaults.bingVerification ?? "Not set"}
                  className="font-mono"
                  aria-invalid={!!errors.bingVerification}
                />
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-20">
          <Card size="sm">
            <CardHeader>
              <SectionTitle icon={Search} tone="blue">Example result</SectionTitle>
              <CardDescription>A page that only sets its title, “About Us”.</CardDescription>
            </CardHeader>
            <CardContent>
              <GooglePreview
                siteName={site.name}
                siteUrl={site.url}
                path="/about"
                title={exampleTitle}
                description={site.description}
              />
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <SectionTitle icon={ImageIcon} tone="teal">Default share card</SectionTitle>
            </CardHeader>
            <CardContent>
              <SocialPreview
                siteUrl={site.url}
                image={absoluteUrl(site.image, previewOrigin)}
                title={exampleTitle}
                description={site.description}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
