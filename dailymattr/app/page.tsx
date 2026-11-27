import { seoMetadata } from "@/lib/seo";
import { SeoJsonLd } from "@/components/shared/seo-json-ld";
import { AppPreviewSection } from "@/components/app-preview";
import { BriefingBentoSection } from "@/components/briefing-bento";
import { DailyRoutineSection } from "@/components/daily-routine";
import { ExplainersSection } from "@/components/explainers";
import { Hero } from "@/components/hero";
import { LearnFormatsSection } from "@/components/learn-formats";
import { NewsletterSection } from "@/components/newsletter";
import { RecognizedInSection } from "@/components/recognized-in";
import { StoriesSection } from "@/components/stories";
import { TemplatesSection } from "@/components/templates";
import { SoftReveal } from "@/components/shared/fade-in";

// Landing page, Figma 8585:9489. The frame's Helvetica Neue text styles are set in Inter Tight,
// the site font (app/layout.tsx).
export const generateMetadata = () => seoMetadata("/")

export default function Home() {
  return (
    <main className="flex-1">
      <SeoJsonLd path="/" />
      {/* The home page keeps its original soft reveal; every other page uses the fade-up. */}
      <SoftReveal>
        <Hero />
        <RecognizedInSection />
        <StoriesSection />
        <AppPreviewSection />
        {/* <LearnFormatsSection /> */}
        <ExplainersSection />
        <DailyRoutineSection />
        <BriefingBentoSection />
        <TemplatesSection />
        <NewsletterSection />
      </SoftReveal>
    </main>
  );
}
