import Image, { type StaticImageData } from "next/image"
import { ImageIcon } from "lucide-react"

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
 *
 * No `image` yet: a placeholder fills the photo's place (a soft grey panel with a framed
 * "Banner image 1920 × 747" where the subject goes), so the layout reads as it will with art.
 * Pass the image to replace it.
 */
export function PhotoCta({
  image,
  phoneFocus,
  overlay,
  className,
  children,
}: {
  /** A static import, so replacing the file changes its URL and busts the image cache. Leave
   *  it out until the banner exists: a placeholder shows instead. */
  image?: StaticImageData
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
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className={cn("object-cover", phoneFocus, "md:object-[25%_50%]")}
            />
          ) : (
            <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#eceef2]">
              <div className="absolute inset-0 bg-linear-to-r from-[#f5f6f8] via-[#eceef2] to-[#e1e4ea] motion-safe:animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[14%]">
                <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#c5cad3] bg-white/40 px-8 py-6 text-center text-[#8b94a3]">
                  <ImageIcon className="size-10" strokeWidth={1.5} />
                  <span className="text-sm font-semibold">Banner image</span>
                  <span className="text-xs">1920 × 747</span>
                </div>
              </div>
            </div>
          )}
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
