import { FadeIn } from "@/components/shared/fade-in"
import { SiteVideo } from "@/components/shared/site-video"
import { videos } from "@/lib/videos"
import { hero } from "./content"
import { PixButton, PixTag } from "./primitives"

/**
 * Hero over the Pix entry video (1920×1080). The section takes the video's
 * 16:9 ratio on large screens so the whole frame shows uncropped. On smaller
 * screens the video fills a full-height hero behind the copy, cropped to keep
 * the phone in view, with a shade at the top so the text stays readable.
 */
export function PixHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--chrome-height,5.5rem))] flex-col overflow-hidden bg-[#0d1a2b] lg:block lg:min-h-0 lg:aspect-video">
      <div className="relative z-10 mx-auto flex w-full max-w-[75rem] items-center px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:absolute lg:inset-0 lg:py-0 lg:px-8">
        <FadeIn className="flex max-w-[33.75rem] flex-col items-start gap-5 font-helvetica lg:gap-6">
          <PixTag>{hero.tag}</PixTag>

          <h1 className="text-display leading-none font-medium tracking-[-0.0938rem] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-[31.25rem] text-base leading-6 tracking-[-0.0125rem] text-white lg:text-lg lg:leading-7">
            {hero.description}
          </p>

          <PixButton href={hero.cta.href}>{hero.cta.label}</PixButton>
        </FadeIn>
      </div>

      {/* Large screens: the box matches the video's ratio, so object-cover never crops it.
          Smaller screens: it covers the tall hero, anchored right of centre on the phone. */}
      <SiteVideo
        video={videos.pixEntry}
        priority
        aria-hidden
        className="absolute inset-0 size-full object-cover object-[68%_50%] lg:object-center"
      />

      {/* Below lg the copy sits over the video: darken the top so it reads cleanly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-[#0d1a2b] via-[#0d1a2b]/80 to-transparent lg:hidden"
      />
    </section>
  )
}
