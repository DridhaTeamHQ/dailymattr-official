import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

// Inter Tight, the dailymattr website's only font (dailymattr/app/layout.tsx). Geist Mono is
// kept for page paths and code.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "dailymattr CMS", template: "%s · dailymattr CMS" },
  description: "Content management for dailymattr",
  // Internal tool: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", interTight.variable)}
    >
      <body className="min-h-full flex flex-col">
        {/* Toasts (components/ui/toast.tsx), e.g. "Saved" after editing SEO. */}
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
