import { seoMetadata } from "@/lib/seo";
import { AppPreviewSection } from "@/components/app-preview";
import { BriefingBentoSection } from "@/components/briefing-bento";
import { DailyRoutineSection } from "@/components/daily-routine";
import { ExplainersSection } from "@/components/explainers";
import { Hero } from "@/components/hero";
import { LearnFormatsSection } from "@/components/learn-formats";
import { LookInsideSection } from "@/components/look-inside";
import { NewsletterSection } from "@/components/newsletter";
import { StoriesSection } from "@/components/stories";
import { TemplatesSection } from "@/components/templates";

// Landing page, Figma 8585:9489. Every text style in the frame is Helvetica Neue
// (Regular / Medium / Bold); font-helvetica falls back to Inter Tight where it isn't installed.
export const generateMetadata = () => seoMetadata("/")

export default function Home() {
  return (
    <main className="flex-1 font-helvetica">
      <Hero />
      <StoriesSection />
      <AppPreviewSection />
      {/* <LearnFormatsSection /> */}
      <ExplainersSection />
      <DailyRoutineSection />
      <BriefingBentoSection />
      <TemplatesSection />
      <LookInsideSection />
      <NewsletterSection />
    </main>
  );
}
