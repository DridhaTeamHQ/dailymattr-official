import Image from "next/image"

import { cn } from "@/lib/utils"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LearnFormat } from "./content"
import { FeatureItem } from "./feature-item"
import { FormatCta, FormatTag, FormatTitle } from "./format-intro"

// Sizes from the Figma frame (1920 wide): shared 1200px column (same edges as the app
// preview media); split card 1200 × 720 as two 588px columns with a 24px gap.
// Each card is a tab set: the feature items are the tabs and switch what the media box shows.

const featureTrigger =
  "h-auto flex-none justify-start rounded-xl border-0 p-0 text-left font-normal whitespace-normal hover:bg-muted/60 data-active:bg-muted group-data-[variant=default]/tabs-list:data-active:shadow-none"

function FeatureTabs({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <TabsList
      className={cn("h-auto w-full gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto", className)}
    >
      {format.features.map((f) => (
        <TabsTrigger key={f.title} value={f.title} className={featureTrigger}>
          <FeatureItem feature={f} />
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

function Media({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl", format.mediaClassName, className)}>
      {format.features.map((f) => (
        <TabsContent
          key={f.title}
          value={f.title}
          className="absolute inset-0 animate-in duration-300 fade-in"
        >
          {f.video ? (
            <video src={f.video} poster={f.image} autoPlay muted loop playsInline className="size-full object-cover" />
          ) : (
            f.image && <Image src={f.image} alt={f.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          )}
        </TabsContent>
      ))}
    </div>
  )
}

function SplitCard({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <Tabs
      orientation="vertical"
      defaultValue={format.features[0].title}
      render={<article />}
      className={cn(CONTENT_WIDTH, "grid gap-6 bg-background md:grid-cols-2 lg:h-[45rem]", className)}
    >
      <div className="flex flex-col">
        <FormatTag>{format.tag}</FormatTag>
        <div className="mt-4">
          <FormatTitle format={format} />
        </div>
        <p className="mt-4 max-w-sm text-base text-[#1c1b17] lg:text-lg lg:leading-6">{format.description}</p>
        <FeatureTabs format={format} className="mt-8 md:mt-auto" />
        <div className="mt-6">
          <FormatCta format={format} />
        </div>
      </div>
      <Media format={format} className="min-h-80 md:min-h-0" />
    </Tabs>
  )
}

function WideCard({ format, className }: { format: LearnFormat; className?: string }) {
  return (
    <Tabs
      defaultValue={format.features[0].title}
      render={<article />}
      className={cn(CONTENT_WIDTH, "flex flex-col gap-6 bg-background", className)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <FormatTag>{format.tag}</FormatTag>
          <div className="mt-4">
            <FormatTitle format={format} />
          </div>
          <p className="mt-4 text-base text-[#1c1b17] lg:text-lg lg:leading-6">{format.description}</p>
        </div>
        <FormatCta format={format} />
      </div>
      {/* 440px tall, but allowed to shrink when the pinned stage is shorter */}
      <Media format={format} className="h-[27.5rem] min-h-56 shrink" />
      <FeatureTabs format={format} className="grid items-stretch sm:grid-cols-3 sm:gap-6" />
    </Tabs>
  )
}

export function FormatCard({ format, className }: { format: LearnFormat; className?: string }) {
  return format.layout === "split" ? (
    <SplitCard format={format} className={className} />
  ) : (
    <WideCard format={format} className={className} />
  )
}
