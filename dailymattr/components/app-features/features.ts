export type AppFeature = {
  value: string
  label: string
  /** Screenshot shown when this feature is selected, e.g. "/features/feed.png". */
  image?: string
}

export const appFeatures: AppFeature[] = [
  { value: "personalise", label: "Personalise your feed" },
  { value: "save", label: "Save stories for later" },
  { value: "ask-ai", label: "Ask questions with AI" },
  { value: "polls", label: "Vote in quick polls" },
  { value: "habit", label: "Build your reading habit" },
  { value: "theme", label: "Choose light or dark mode" },
  { value: "formats", label: "Read, watch or listen" },
  { value: "discover", label: "Discover stories by format" },
  { value: "progress", label: "Track your reading progress" },
  { value: "briefing", label: "Get your daily briefing" },
  { value: "depth", label: "Explore topics in depth" },
  { value: "matter", label: "Find stories that matter" },
  { value: "pace", label: "Catch up at your own pace" },
]
