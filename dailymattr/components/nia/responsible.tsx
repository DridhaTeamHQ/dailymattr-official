import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"

/** Corner washes on the "Responsible answers" card. Figma node 8856:11650. */
const leftCardBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 588 508' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -27.94 -35.28 0 129.36 91.44)'><stop stop-color='rgba(57,121,255,0.18)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 588 508' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -27.94 -32.34 0 482.16 431.8)'><stop stop-color='rgba(122,77,240,0.18)' offset='0'/><stop stop-color='rgba(122,77,240,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  "linear-gradient(90deg, rgb(20, 20, 23) 0%, rgb(20, 20, 23) 100%)",
].join(", ")

/** Top and bottom washes on the CTA card. Figma node 8856:11661. */
const rightCardBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 588 508' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -30.48 -35.28 0 294 0)'><stop stop-color='rgba(110,72,255,0.32)' offset='0'/><stop stop-color='rgba(110,72,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 588 508' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -27.94 -32.34 0 294 508)'><stop stop-color='rgba(57,121,255,0.22)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  "linear-gradient(90deg, rgb(20, 20, 23) 0%, rgb(20, 20, 23) 100%)",
].join(", ")

export function NiaResponsible() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-[160px]">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
        <FadeIn>
          <div
            className="flex h-full flex-col gap-8 overflow-hidden rounded-[24px] border border-white/8 p-10 lg:p-16"
            style={{ backgroundImage: leftCardBackground }}
          >
            <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-[20px] border border-white/28 bg-white/12">
              <Image src="/nia/shield.svg" alt="" width={34} height={34} className="block" />
            </span>

            <div className="flex flex-col gap-4">
              <p className="text-[18px] leading-[18px] font-medium text-[#5b8cff] uppercase">
                Responsible answers
              </p>
              <h2 className="max-w-[458px] text-[32px] leading-tight font-medium text-white sm:text-[40px] lg:text-[48px] lg:leading-[48px]">
                Curiosity deserves clarity.
              </h2>
              <p className="max-w-[458px] text-[20px] leading-[30px] text-white/60">
                NIA is designed to help you explore information, not replace your judgement.
                AI-generated answers can make mistakes, so important claims should be checked
                against reliable sources.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            className="flex h-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[24px] border border-white/8 px-10 py-16"
            style={{ backgroundImage: rightCardBackground }}
          >
            <h2 className="max-w-[506px] text-center text-[32px] leading-tight font-medium text-white sm:text-[40px] lg:text-[48px] lg:leading-[48px]">
              Don&apos;t stop at the headline.
            </h2>
            <p className="text-center text-[20px] leading-[30px] text-white/60">
              Ask NIA. Get the context. Make up your own mind.
            </p>
            <Link
              href="/"
              className="mt-3 flex h-10 items-center gap-2.5 rounded-[13px] bg-[#3979ff] py-2 pr-2 pl-4 drop-shadow-[0px_8px_14px_rgba(57,121,255,0.45)] transition-transform hover:-translate-y-px"
            >
              <span className="text-[16px] leading-4 font-medium text-white">
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
    </section>
  )
}
