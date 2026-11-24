import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { regionScript } from "@/components/navbar/nav-config";
import { CmsJsonLd } from "@/components/shared/cms-json-ld";
import { CookieConsentPopup } from "@/components/shared/cookie-consent";
import { GoogleAnalytics } from "@/components/shared/google-analytics";
import { RouteTheme } from "@/components/shared/route-theme";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { siteScaleScript } from "@/lib/site-scale";
import { getSiteSeo } from "@/lib/site-seo";
import { jsonLdHtml, site, siteJsonLd } from "@/lib/site";

// Inter Tight is the site's only font. <html> sets font-sans and every page inherits it, so
// components don't set a font family of their own.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });

// Site-wide SEO: the defaults in lib/site.ts with the CMS's site settings on top
// (getSiteSeo). Pages override title / description / canonical with seoMetadata() in
// lib/seo.ts; the share image comes from the CMS or app/opengraph-image.tsx.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeo();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: seo.titleTemplate },
    description: seo.description,
    applicationName: seo.name,
    keywords: seo.keywords,
    authors: [{ name: site.publisher.name, url: site.url }],
    creator: site.publisher.name,
    publisher: site.publisher.name,
    category: "news",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: seo.name,
      locale: site.locale,
      url: "/",
      title: site.title,
      description: seo.description,
      ...(seo.image && { images: [{ url: seo.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: seo.description,
      ...(seo.twitterHandle && { site: seo.twitterHandle, creator: seo.twitterHandle }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Search Console / Bing Webmaster ownership tags: set in the CMS (or, for Google,
    // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION).
    ...((seo.googleVerification || seo.bingVerification) && {
      verification: {
        ...(seo.googleVerification && { google: seo.googleVerification }),
        ...(seo.bingVerification && { other: { "msvalidate.01": seo.bingVerification } }),
      },
    }),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", interTight.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Laptop scale as a number, for the navbar (see lib/site-scale.ts) */}
        <Script id="site-scale" strategy="beforeInteractive">
          {siteScaleScript}
        </Script>
        {/* Saved header region, so its image is right on first paint (see nav-config.ts) */}
        {/* Plain inline script (not next/script) so it runs during HTML parsing, before paint */}
        <script id="site-region" dangerouslySetInnerHTML={{ __html: regionScript }} />
        {/* Organization + WebSite structured data for search engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(siteJsonLd()) }} />
        {/* The current page's own JSON-LD, when the CMS sets one */}
        <Suspense fallback={null}>
          <CmsJsonLd />
        </Suspense>
        <SmoothScroll>
          <RouteTheme>
            <Navbar />
            {children}
            <Footer />
          </RouteTheme>
        </SmoothScroll>
        <CookieConsentPopup />
        {/* Google Analytics, only after the visitor accepts all cookies */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
