import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RouteTheme } from "@/components/shared/route-theme";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "dailyMattr - News & Infotainment",
  description: "dailyMattr is a news and infotainment platform that provides curated content, insights, and analysis on various topics, keeping you informed and engaged with the latest trends and stories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
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
