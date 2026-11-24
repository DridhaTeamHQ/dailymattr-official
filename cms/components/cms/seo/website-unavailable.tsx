import { CircleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/** Shown when the CMS can't load the website's SEO defaults. */
export function WebsiteUnavailable({ url, message }: { url: string; message: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>Couldn&apos;t reach the dailymattr website</AlertTitle>
      <AlertDescription>
        The SEO pages need the website&apos;s defaults from {url || "WEBSITE_URL"}/api/seo/defaults.
        Make sure the website is running, then reload. ({message})
      </AlertDescription>
    </Alert>
  )
}
