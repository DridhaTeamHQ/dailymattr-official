import { AppPreviewSection } from "@/components/app-preview";
import { BriefingBentoSection } from "@/components/briefing-bento";
import { DailyRoutineSection } from "@/components/daily-routine";
import { ExplainersSection } from "@/components/explainers";
import { Hero } from "@/components/hero";
import { LearnFormatsSection } from "@/components/learn-formats";
import { NewsletterSection } from "@/components/newsletter";
import { StoriesSection } from "@/components/stories";
import { TemplatesSection } from "@/components/templates";
import { dummyImage } from "@/lib/dummy-media";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <StoriesSection />
      <AppPreviewSection />
      <LearnFormatsSection />
      <ExplainersSection />
      <DailyRoutineSection />
      <BriefingBentoSection />
      <TemplatesSection />
      <NewsletterSection image={dummyImage(600, 1600, 860)} />
    </main>
  );
}
