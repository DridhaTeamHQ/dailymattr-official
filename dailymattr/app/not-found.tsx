import { DarkArrowLink } from "@/components/shared/dark-arrow-link"

/**
 * 404 for unknown URLs and notFound() calls. Replaces Next's built-in page, which sets its own
 * system font, so the 404 is Inter Tight like the rest of the site.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] flex-1 flex-col items-center justify-center gap-6 bg-white px-4 pt-40 pb-24 text-center">
      <p className="text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">404</p>
      <h1 className="text-balance text-3xl leading-none font-bold tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]">
        This page could not be found
      </h1>
      <p className="max-w-[30rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg">
        The link may be broken, or the page may have moved.
      </p>
      <DarkArrowLink href="/">Back to home</DarkArrowLink>
    </main>
  )
}
