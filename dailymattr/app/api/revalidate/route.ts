import { timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { after } from "next/server"

import { CMS_SEO_TAG, getCmsSeo } from "@/lib/cms"

/**
 * POST /api/revalidate: the CMS calls this after every SEO save, so the site drops its
 * cached copy (lib/cms.ts) and the next visit shows the change. Needs
 * `Authorization: Bearer <CMS_REVALIDATE_SECRET>`.
 */
export async function POST(request: Request) {
  const secret = process.env.CMS_REVALIDATE_SECRET
  const sent = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? ""
  if (!secret || !sameSecret(sent, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  // expire: 0 so the next request waits for fresh CMS data instead of being served the old copy.
  revalidateTag(CMS_SEO_TAG, { expire: 0 })
  // Then read the new data right away, once this response is out. Otherwise the first
  // visitor after a save triggers the refresh and is still shown the old meta tags.
  after(() => warmCache())
  return Response.json({ revalidated: true })
}

/**
 * GET /api/revalidate: the CMS calls this right after the POST and waits for it, so by the
 * time the CMS says "Live on the website now" the new SEO is already in the cache.
 */
export async function GET(request: Request) {
  const secret = process.env.CMS_REVALIDATE_SECRET
  const sent = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? ""
  if (!secret || !sameSecret(sent, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  await warmCache()
  return Response.json({ warm: true })
}

async function warmCache() {
  // Two reads: the first starts the refresh, the second waits until the new copy is cached.
  await getCmsSeo()
  await new Promise((resolve) => setTimeout(resolve, 250))
  await getCmsSeo()
}

function sameSecret(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
