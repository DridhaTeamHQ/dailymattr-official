/**
 * The old site's URL forms, which the new site keeps so search engines see the same URLs:
 *
 * - Pages end in a slash: /about/, /news/, /news/india/, /news/page/2/.
 * - Story pages don't: /news/<headline>-<Pix ID>.
 * - Files keep their name: /llms.txt, /news/sitemap.xml.
 *
 * Routes and the CMS name pages without the slash ("/about"); canonicalPath() turns that into
 * the public URL. proxy.ts redirects every other form to it. No server-only code here: the
 * proxy and client components import it.
 */

/** A story page: one segment under /news ending in the Pix ID ("/news/some-headline-20245"). */
export const isStoryPath = (path: string) => /^\/news\/(?:[^/]*-)?\d{1,12}$/.test(path.replace(/\/+$/, ""))

/** The last segment has an extension (a file, not a page). */
export const isFilePath = (path: string) => /\.[a-z0-9]+$/i.test(path.replace(/\/+$/, ""))

/** The public URL path for a route: "/about" -> "/about/", a story path stays as it is. */
export function canonicalPath(path: string) {
  const [pathname, rest = ""] = splitPath(path)
  if (pathname === "/") return path
  const bare = pathname.replace(/\/+$/, "")
  if (isStoryPath(bare) || isFilePath(bare)) return bare + rest
  return `${bare}/${rest}`
}

/** "/a/b?x=1#y" -> ["/a/b", "?x=1#y"] */
function splitPath(path: string): [string, string] {
  const i = path.search(/[?#]/)
  return i === -1 ? [path, ""] : [path.slice(0, i), path.slice(i)]
}
