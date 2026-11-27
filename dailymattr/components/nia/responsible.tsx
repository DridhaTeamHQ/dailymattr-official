import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"

/** Darkens the bottom and right edges of the photo. Figma node 9125:13944. */
const photoOverlay = [
  "linear-gradient(61.72deg, rgba(0, 0, 0, 0) 58.77%, rgba(0, 0, 0, 0.7) 99.7%)",
  "linear-gradient(179.03deg, rgba(0, 0, 0, 0) 10.72%, rgba(0, 0, 0, 0.7) 97.92%)",
].join(", ")

/**
 * "Responsible answers": both text blocks sit directly on a full-bleed photo.
 * Figma: background 9125:13944 (1920×747), left block 8856:11650, right block 8856:11661.
 */
export function NiaResponsible() {
  return (
    <section className="relative isolate overflow-hidden xl:h-[747px]">
      <Image
        src="/nia/responsible-answers.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[60%_center] xl:object-center"
      />
      {/* Phones get an extra dark wash so the stacked copy stays readable over the photo. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55 xl:hidden" />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: photoOverlay }} />

      <div className="flex flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-16 lg:py-24 xl:gap-0 xl:px-0 xl:pt-[150px] xl:pb-0 xl:pl-[206px]">
        <p className="text-sm leading-4.5 font-medium text-[#5b8cff] uppercase lg:text-lg">
          Responsible answers
        </p>

        <div className="flex flex-col gap-12 xl:mt-[252px] xl:flex-row xl:gap-0">
          <FadeIn className="xl:w-[897px] xl:shrink-0">
            <div className="flex flex-col gap-3 lg:gap-4">
              <h2 className="max-w-[554px] text-3xl leading-tight font-medium text-white sm:text-display lg:text-5xl lg:leading-12">
                Curiosity deserves clarity.
              </h2>
              <p className="max-w-[554px] text-base leading-relaxed text-white/60 lg:text-xl lg:leading-7.5">
                NIA is designed to help you explore information, not replace your judgement.
                AI-generated answers can make mistakes, so important claims should be checked
                against reliable sources.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col items-start gap-4 lg:gap-5">
              <h2 className="max-w-[554px] text-3xl leading-tight font-medium text-white sm:text-display lg:text-5xl lg:leading-12">
                Don&apos;t stop at the headline.
              </h2>
              <p className="text-base leading-relaxed text-white/60 lg:text-xl lg:leading-7.5">
                Ask NIA. Get the context. Make up your own mind.
              </p>
              <Link
                href="/"
                className="mt-3 flex h-10 items-center gap-2.5 rounded-[13px] bg-[#3979ff] py-2 pr-2 pl-4 drop-shadow-[0px_8px_14px_rgba(57,121,255,0.45)] transition-transform hover:-translate-y-px"
              >
                <span className="text-base leading-4 font-medium text-white">
                  Explore DailyMattr
                </span>
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
                  <Image
                    src="/nia/arrow-up-right.svg"
                    alt=""
                    width={12}
                    height={12}
                    className="block"
                  />
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
