import type { Metadata } from "next";
import Script from "next/script";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RouteTheme } from "@/components/shared/route-theme";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { siteScaleScript } from "@/lib/site-scale";
import { jsonLdHtml, site, siteJsonLd } from "@/lib/site";

// Inter Tight is the site's only sans: font-sans, plus the font-tight alias used by headings and NIA.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });

// Site-wide SEO defaults (lib/site.ts). Pages override title / description / canonical with
// seoMetadata() in lib/seo.ts; the share image comes from app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.publisher.name, url: site.url }],
  creator: site.publisher.name,
  publisher: site.publisher.name,
  category: "news",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
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
  // Google Search Console ownership tag; set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to enable.
  ...(site.googleSiteVerification && { verification: { google: site.googleSiteVerification } }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", interTight.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Laptop scale as a number, for the navbar (see lib/site-scale.ts) */}
        <Script id="site-scale" strategy="beforeInteractive">
          {siteScaleScript}
        </Script>
        {/* Organization + WebSite structured data for search engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(siteJsonLd()) }} />
        <SmoothScroll>
          <RouteTheme>
            <Navbar />
            {children}
            <Footer />
          </RouteTheme>
        </SmoothScroll>
      </body>
    </html>
  );
}
