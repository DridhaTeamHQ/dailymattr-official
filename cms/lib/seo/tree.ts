/**
 * Treats website paths as folders, so the SEO list can show one level at a time:
 * "/news/india/some-story" sits inside "/news/india", which sits inside "/news".
 * `null` stands for the top level (the home page "/" and every "/<name>").
 */

/** "/news/india" → "/news", "/about" → null (top level), "/" → null. */
export function parentOf(path: string): string | null {
  if (path === "/") return null
  const cut = path.lastIndexOf("/")
  return cut <= 0 ? null : path.slice(0, cut)
}

/** "/news/india" → ["/news", "/news/india"]: every folder from the top down to `path`. */
export function ancestry(path: string) {
  const parts = path.split("/").filter(Boolean)
  return parts.map((_, i) => `/${parts.slice(0, i + 1).join("/")}`)
}

export type TreeEntry = {
  path: string
  /** False for a folder that only exists because pages sit inside it (e.g. "/formats"). */
  isPage: boolean
  /** How many pages sit anywhere inside it. */
  inside: number
}

/**
 * The entries directly inside `folder` (null = top level), in the order their paths first
 * appear, with how many pages each one holds.
 */
export function childrenOf(folder: string | null, paths: string[]): TreeEntry[] {
  const pageSet = new Set(paths)
  const prefix = folder ? `${folder}/` : "/"
  const entries = new Map<string, TreeEntry>()

  for (const path of paths) {
    if (path === "/") {
      // The home page belongs to the top level, not inside anything.
      if (!folder && !entries.has("/")) entries.set("/", { path: "/", isPage: true, inside: 0 })
      continue
    }
    if (!path.startsWith(prefix)) continue
    const child = prefix + path.slice(prefix.length).split("/")[0]
    const entry = entries.get(child) ?? { path: child, isPage: pageSet.has(child), inside: 0 }
    if (path !== child) entry.inside += 1
    entries.set(child, entry)
  }
  return [...entries.values()]
}

/** "/news/india" → "india". */
export const lastSegment = (path: string) => path.split("/").filter(Boolean).pop() ?? "/"

/** Link to a folder in the SEO list. */
export const folderHref = (folder: string | null) => (folder ? `/seo?in=${encodeURIComponent(folder)}` : "/seo")
