import Image, { type StaticImageData } from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"

/**
 * Closing CTA over a full-bleed 1920×747 photo (Trax Figma 9344:7320, Qix 9344:7440).
 *
 * From md up the copy sits on the photo, left-aligned with the page's content column (the
 * 75rem container plus the old card's padding), a little below centre as in the frames. The
 * box keeps the photo's shape (747/1920 of the width) but never drops under 25rem, so on
 * tablets the photo is cropped on the right instead and its subject moves clear of the copy.
 * On phones there is no room beside the subject, so the copy stacks above the photo; give the
 * heading dark text there and white from md (`text-[#1c1c1e] md:text-white`).
 *
 * Only the copy fades up; the photo stays put behind it.
 */
export function PhotoCta({
  image,
  phoneFocus,
  overlay,
  className,
  children,
}: {
  /** A static import, so replacing the file changes its URL and busts the image cache. */
  image: StaticImageData
  /**
   * Object-position class for the phone crop (4:3), e.g. "object-[72%_50%]", chosen to keep
   * the photo's subject in frame. From md up the crop is fixed at 25% across.
   */
  phoneFocus: string
  /** Optional CSS background drawn over the photo from md up, e.g. a gradient behind the copy. */
  overlay?: string
  className?: string
  /** The heading and button. */
  children: React.ReactNode
}) {
  return (
    <section className="@container bg-white pb-10 lg:pb-16">
      {/* Height, not aspect-ratio + min-height: through the ratio, a min-height also forces
          a min-width, which pushed the box wider than the screen on tablets. */}
      <div className="relative flex flex-col md:h-[max(25rem,38.90625cqw)] md:justify-center">
        <div className="relative order-last aspect-[4/3] w-full md:absolute md:inset-0 md:aspect-auto">
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className={cn("object-cover", phoneFocus, "md:object-[25%_50%]")}
          />
          {overlay && (
            <div aria-hidden className="absolute inset-0 hidden md:block" style={{ backgroundImage: overlay }} />
          )}
        </div>

        <div className="relative px-4 pb-10 sm:px-6 md:pt-12 md:pb-0 lg:px-8">
          <FadeIn
            className={cn("mx-auto flex max-w-[75rem] flex-col items-start gap-6 md:px-12 lg:px-20", className)}
          >
            {children}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
