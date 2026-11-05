import { dummyImage } from "@/lib/dummy-media"

export type AppFeature = {
  value: string
  label: string
  /** Screenshot shown when this feature is selected, e.g. "/features/feed.png". */
  image?: string
}

export const appFeatures: AppFeature[] = [
  { value: "personalise", label: "Personalise your feed", image: dummyImage(300, 1078, 1480) },
  { value: "save", label: "Save stories for later", image: dummyImage(304, 1078, 1480) },
  { value: "ask-ai", label: "Ask questions with AI", image: dummyImage(308, 1078, 1480) },
  { value: "polls", label: "Vote in quick polls", image: dummyImage(312, 1078, 1480) },
  { value: "habit", label: "Build your reading habit", image: dummyImage(316, 1078, 1480) },
  { value: "theme", label: "Choose light or dark mode", image: dummyImage(320, 1078, 1480) },
  { value: "formats", label: "Read, watch or listen", image: dummyImage(324, 1078, 1480) },
  { value: "discover", label: "Discover stories by format", image: dummyImage(328, 1078, 1480) },
  { value: "progress", label: "Track your reading progress", image: dummyImage(332, 1078, 1480) },
  { value: "briefing", label: "Get your daily briefing", image: dummyImage(336, 1078, 1480) },
  { value: "depth", label: "Explore topics in depth", image: dummyImage(340, 1078, 1480) },
  { value: "matter", label: "Find stories that matter", image: dummyImage(344, 1078, 1480) },
  { value: "pace", label: "Catch up at your own pace", image: dummyImage(348, 1078, 1480) },
]
