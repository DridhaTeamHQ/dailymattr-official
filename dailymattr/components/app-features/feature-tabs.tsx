import Image from "next/image"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { appFeatures } from "./features"

// Figma: feature list on the left, 539 × 740 preview on the right. On desktop the rows have a
// fixed height so the list and the preview are the same height (13 rows + 12 × 4px gaps).
export function FeatureTabs() {
  return (
    <Tabs
      orientation="vertical"
      defaultValue={appFeatures[0].value}
      className={cn(CONTENT_WIDTH, "flex-col items-center justify-between gap-10 lg:flex-row")}
    >
      <TabsList className="w-full items-stretch gap-1 bg-transparent p-0 lg:w-auto lg:max-w-[440px] lg:flex-1">
        {appFeatures.map((f) => (
          <TabsTrigger
            key={f.value}
            value={f.value}
            className="h-auto justify-start rounded-lg px-4 py-2 text-left text-base lg:h-11 lg:flex-none 2xl:h-[53px] font-normal whitespace-normal text-muted-foreground/70 hover:text-foreground data-active:bg-muted data-active:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-none lg:text-lg 2xl:text-xl"
          >
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="relative aspect-[539/740] w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-placeholder lg:h-[620px] lg:w-auto lg:max-w-none 2xl:h-[737px]">
        {appFeatures.map((f) => (
          <TabsContent
            key={f.value}
            value={f.value}
            className="absolute inset-0 animate-in duration-300 fade-in"
          >
            {f.image && <Image
                src={f.image}
                alt={f.label}
                fill
                // Matches the frame: up to 448px wide on small screens, ~452px at lg, ~537px at 2xl.
                sizes="(min-width: 1536px) 540px, (min-width: 1024px) 460px, min(100vw, 448px)"
                className="object-cover"
              />}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
