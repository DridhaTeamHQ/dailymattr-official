import { PixSlideCard, type PixCardSlide } from "./pix-slides"

export type PixRowItem = { id: string; headline: string; href: string; slides: PixCardSlide[] }

/**
 * The home page's "Happening now" row: the latest real Pix (lib/news.ts getLatestPix) as the
 * Pix page's cards, in one row that scrolls sideways with the trackpad, Shift + mouse wheel or
 * a swipe (no buttons). On desktop the row sits 64px in from both screen edges (fixed px, not
 * rem, which shrinks on laptops) and cards scroll out of view at that line.
 */
export function PixRow({ items }: { items: PixRowItem[] }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-[64px]">
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:gap-4 lg:snap-none lg:gap-6 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Latest Pix stories"
      >
        {items.map((item) => (
          <div key={item.id} className="w-[13.75rem] shrink-0 snap-start snap-always sm:w-[16rem] lg:w-[17.625rem]">
            <PixSlideCard slides={item.slides} headline={item.headline} href={item.href} />
          </div>
        ))}
      </div>
    </div>
  )
}
