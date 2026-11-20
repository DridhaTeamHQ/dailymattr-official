# Page slugs — new dailymattr site

The new design keeps the **same URLs and slugs as the old site** (see `README-OLD-SITE.md`).
This file is the plan only: one entry per page with its slug, title and description text.
No pages have been created from it yet.

**Trailing slash:** the old site's URLs end in `/` (e.g. `/about/`). To match them exactly,
set `trailingSlash: true` in `next.config.ts` when the pages are built. Otherwise Next.js
redirects `/about/` to `/about`.

**Status key:**
- **Exists**: the route is already built in the new site.
- **To build**: the page is not built yet.
- **Rename**: the page exists under a different slug and must move to the old slug.

---

## Main pages

### Home
- **Slug:** `/`
- **Old URL:** https://www.dailymattr.com/
- **Status:** Exists (`app/page.tsx`)
- **Title:** dailymattr – News & Infotainment
- **Description:** Official dailymattr website and news discovery platform. Concise news updates, visual news stories, video explainers, audio stories, articles, polls and newsletters to help you stay informed.

### About Us
- **Slug:** `/about/`
- **Old URL:** https://www.dailymattr.com/about/
- **Status:** Exists (`app/about/page.tsx`)
- **Title:** About Us
- **Description:** Information about dailymattr, its mission and its platform: a digital news and infotainment platform by Dridha Technologies Private Limited, Hyderabad, India.

### Latest News
- **Slug:** `/news/`
- **Old URL:** https://www.dailymattr.com/news/
- **Status:** Empty page (`app/news/page.tsx`), linked from the navbar's "Latest Stories", the announcement bar, the "today's stories" buttons, Pix and the footer's Latest Stories → Top. Design to build. (Those links used to point to `/stories`.)
- **Title:** Latest News
- **Description:** News articles, updates and current affairs. Latest news, breaking news and the latest headlines today from India and around the world.

### Newsletter
- **Slug:** `/newsletter/`
- **Old URL:** https://www.dailymattr.com/newsletter/
- **Status:** Empty page (`app/newsletter/page.tsx`), linked from the navbar and the footer's "Subscribe to newsletter". Design to build.
- **Title:** Newsletter
- **Description:** Curated news briefings and summarized stories, delivered as a daily news briefing.

---

## News categories

All category pages sit under `/news/<category>/`.

### India News
- **Slug:** `/news/india/`
- **Old URL:** https://www.dailymattr.com/news/india/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** India News
- **Description:** Latest India news, national news headlines, politics news, government updates and current affairs.

### World News
- **Slug:** `/news/world/`
- **Old URL:** https://www.dailymattr.com/news/world/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** World News
- **Description:** Latest world news, international news headlines, global affairs and major developments from around the world.

### Business News
- **Slug:** `/news/business/`
- **Old URL:** https://www.dailymattr.com/news/business/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** Business News
- **Description:** Latest business news, financial updates, market developments, company news and economic current affairs.

### Technology News
- **Slug:** `/news/technology/`
- **Old URL:** https://www.dailymattr.com/news/technology/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** Technology News
- **Description:** Latest technology news, artificial intelligence updates, digital innovation, gadgets and tech industry developments.

### Sports News
- **Slug:** `/news/sports/`
- **Old URL:** https://www.dailymattr.com/news/sports/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** Sports News
- **Description:** Latest sports news, cricket updates, sports headlines, tournaments and major sporting events.

### Entertainment News
- **Slug:** `/news/entertainment/`
- **Old URL:** https://www.dailymattr.com/news/entertainment/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** Entertainment News
- **Description:** Latest entertainment news, cinema news, movie updates, celebrity news and film industry headlines.

### Lifestyle News
- **Slug:** `/news/lifestyle/`
- **Old URL:** https://www.dailymattr.com/news/lifestyle/
- **Status:** Empty page (`app/news/[category]/page.tsx`), linked from the footer. Design to build.
- **Title:** Lifestyle News
- **Description:** Lifestyle news, health news, wellness topics, culture and everyday-interest stories.

### State News
- **Slug:** `/news/states/`
- **Old URL:** https://www.dailymattr.com/news/states/
- **Status:** To build
- **Title:** State News
- **Description:** Latest state news, regional news, district news, local news updates and important developments across India.

---

## Editorial and trust

### Editorial Team
- **Slug:** `/author/dailymattr-editorial-team/`
- **Old URL:** https://www.dailymattr.com/author/dailymattr-editorial-team/
- **Status:** To build. Use a dynamic `/author/<slug>/` route so other authors can be added later.
- **Title:** dailymattr Editorial Team
- **Description:** The dailymattr editorial team and the stories it has published.

### Editorial Guidelines
- **Slug:** `/editorialguidelines/`
- **Old URL:** https://www.dailymattr.com/editorialguidelines/
- **Status:** To build
- **Title:** Editorial Guidelines
- **Description:** Editorial practices, content standards and the reporting principles dailymattr follows.

---

## Support and legal

### Support
- **Slug:** `/support/`
- **Old URL:** https://www.dailymattr.com/support/
- **Status:** Empty page (`app/support/page.tsx`), linked from the footer's Inside DailyMattr → Contact. Design to build.
- **Title:** Support
- **Description:** User support and assistance for the dailymattr website and app.

### Privacy Policy
- **Slug:** `/privacypolicy/`
- **Old URL:** https://www.dailymattr.com/privacypolicy/
- **Status:** Exists (`app/privacypolicy/page.tsx`). Renamed from `/privacy`, which now redirects here permanently (`next.config.ts`).
- **Title:** Privacy Policy
- **Description:** Privacy and data-handling information: how Dridha Technologies Private Limited collects, uses, shares and protects personal data across the dailymattr website, app and related services.

### Terms and Conditions
- **Slug:** `/termsandconditions/`
- **Old URL:** https://www.dailymattr.com/termsandconditions/
- **Status:** Empty page (`app/termsandconditions/page.tsx`), linked from the footer's Legal → Terms. Design to build.
- **Title:** Terms and Conditions
- **Description:** The terms that apply to the dailymattr website and services.

---

## Sitemaps

| Old URL | Status in the new site |
| --- | --- |
| `/sitemap-pages.xml` | The new site serves `/sitemap.xml` (`app/sitemap.ts`). Add a rewrite from `/sitemap-pages.xml` so the URL already submitted to search engines keeps working. |
| `/news/sitemap-index.xml` | To build once news articles come from the CMS. |
| `/news-studio/sitemap-index.xml` | To build once News Studio content is connected. |

---

## Pages only in the new site

These pages have no old URL. Keep their slugs as they are.

| Slug | Page | Status |
| --- | --- | --- |
| `/nia/` | NIA – AI News Assistant | Exists |
| `/formats/pix/` | Pix – Visual News Stories | Exists |
| `/formats/qix/` | Qix – Short Video Explainers | Exists |
| `/formats/trax/` | Trax – Listen to the News | Exists |
| `/formats/xplaind/` | Xplaind – Explainers | To build (already linked) |
| `/benchmark/` | Benchmark (was `/newsroom/`) | Exists (linked from the nav and the footer's Inside DailyMattr → Benchmark) |
| `/advertise/` | Advertise | Exists (linked from the footer's Support → Advertise) |
| `/careers/` | Careers | Empty page (`app/careers/page.tsx`), linked from the footer's Inside DailyMattr → Careers. Design to build. |
| `/inside/` | Inside dailyMattr | Empty page (`app/inside/page.tsx`), linked from the navbar. Design to build. |
| `/login/` | Log in | Empty page (`app/login/page.tsx`), linked from the navbar and mobile menu. Sign-in to build. |
| `/download/` | Get the app | Empty page (`app/download/page.tsx`), linked from the navbar's "Get the app" and the Download buttons on the home page. Design to build. |

Empty pages render `components/shared/empty-page.tsx` and are marked `noindex` in `lib/seo.ts`, which keeps them out of search and the sitemap. Remove `noindex` when a page gets its content.

---

## Mobile apps (external links)

- Google Play: https://play.google.com/store/apps/details?id=com.dailymattr
- Apple App Store: https://apps.apple.com/in/app/dailymattr/id6791996138
