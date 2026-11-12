import { FadeIn } from "@/components/shared/fade-in"
import { SiteVideo } from "@/components/shared/site-video"
import { videos } from "@/lib/videos"
import { hero } from "./content"
import { PixButton, PixTag } from "./primitives"

/**
 * Hero over the Pix entry video (1920×1080). The section takes the video's
 * 16:9 ratio on large screens so the whole frame shows uncropped; on smaller
 * screens the copy sits above and the video follows at full width.
 */
export function PixHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0d1a2b] lg:aspect-video">
      <div className="mx-auto flex max-w-[75rem] items-center px-4 py-16 sm:px-6 sm:py-20 lg:absolute lg:inset-0 lg:z-10 lg:py-0 lg:px-8">
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

      {/* The box always matches the video's ratio, so object-cover never crops it. */}
      <SiteVideo
        video={videos.pixEntry}
        priority
        aria-hidden
        className="block aspect-video w-full object-cover lg:absolute lg:inset-0 lg:size-full"
      />
    </section>
  )
}
