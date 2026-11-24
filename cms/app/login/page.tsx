import { Suspense } from "react"
import type { Metadata } from "next"
import { CircleAlert } from "lucide-react"

import { signIn } from "@/auth"
import { BrandBackdrop } from "@/components/cms/brand-backdrop"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = { title: "Sign in" }

const errorMessages: Record<string, string> = {
  AccessDenied: "This Google account couldn't be used. Make sure its email address is verified.",
  Configuration: "Google sign-in isn't set up correctly. Check the CMS environment variables.",
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  async function signInWithGoogle() {
    "use server"
    await signIn("google", { redirectTo: "/" })
  }

  return (
    <BrandBackdrop>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Use your Google account. New accounts need an admin&apos;s approval before they can
            get in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Suspense>
            <SignInError searchParams={searchParams} />
          </Suspense>
          <form action={signInWithGoogle}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">For the dailymattr team only.</p>
        </CardFooter>
      </Card>
    </BrandBackdrop>
  )
}

async function SignInError({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { error } = await searchParams
  if (typeof error !== "string") return null

  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>
        {errorMessages[error] ?? "Sign-in didn't work. Please try again."}
      </AlertDescription>
    </Alert>
  )
}

/** Google's "G" mark, as Google's sign-in branding guidelines require on this button. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}
