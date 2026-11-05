import { AspectRatio } from "@/components/ui/aspect-ratio"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formats } from "./formats"

// Figma: media 1200 × 720 (shared content column); tab bar 1152 × 84 at (24, 612), padding 6,
// gap 0, radius 16. Subtitles show once the box is wide enough to fit them.
export function FormatTabs() {
  return (
    <Tabs defaultValue={formats[0].value} className={cn("@container gap-0", CONTENT_WIDTH)}>
      <AspectRatio ratio={1200 / 720} className="overflow-hidden rounded-xl bg-placeholder">
        {formats.map((f) => (
          <TabsContent key={f.value} value={f.value} className="absolute inset-0">
            {f.videoSrc && (
              <video
                src={f.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="size-full object-cover"
              />
            )}
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-2 bottom-2 w-auto gap-0 overflow-x-auto rounded-[16px] bg-foreground p-1.5 group-data-horizontal/tabs:h-14 sm:inset-x-6 sm:bottom-6 sm:group-data-horizontal/tabs:h-[84px]">
          {formats.map((f) => (
            <TabsTrigger
              key={f.value}
              value={f.value}
              className="h-full min-w-20 flex-1 flex-col gap-0.5 rounded-xl border-0 text-background/50 hover:text-background/80 data-active:bg-background/15 data-active:text-background group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:bg-background/15 dark:data-active:text-background"
            >
              <span className="text-sm font-medium">{f.title}</span>
              <span className="hidden text-xs font-normal text-background/40 @min-[900px]:block">
                {f.subtitle}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </AspectRatio>
    </Tabs>
  )
}
