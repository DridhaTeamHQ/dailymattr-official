import { CircleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/** Shown when the CMS can't load the website's SEO defaults; `message` says why. */
export function WebsiteUnavailable({ message }: { url?: string; message: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>Couldn&apos;t reach the dailymattr website</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
