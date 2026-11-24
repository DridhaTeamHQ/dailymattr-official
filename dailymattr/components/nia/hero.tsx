import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { HeroChat } from "./hero-chat"

/** Radial sheen behind the "Ask NIA" pill. Figma node 8856:9119. */
const askButtonBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 116 40' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(8.55 5.7 -16.53 24.795 -16.5 -15.5)'><stop stop-color='rgba(108,16,80,1)' offset='0'/><stop stop-color='rgba(81,12,60,0.75)' offset='0.25'/><stop stop-color='rgba(54,8,40,0.5)' offset='0.5'/><stop stop-color='rgba(0,0,0,0)' offset='1'/></radialGradient></defs></svg>")`,
  "linear-gradient(90deg, rgb(8, 45, 123) 0%, rgb(8, 45, 123) 100%)",
].join(", ")

export function NiaHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.1)_100%),linear-gradient(90deg,rgb(15,15,15)_0%,rgb(15,15,15)_100%)] px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-[140px] lg:pb-[204px]">
      {/* Figma 8856:9100: copy (540) + 133 gap + chat card (430) = a 1103px column */}
      <div className="mx-auto flex max-w-[1103px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        {/* Copy */}
        <FadeIn className="flex w-full max-w-[540px] flex-col gap-5 lg:gap-6">
          <span className="w-fit rounded-[6px] bg-[rgba(28,104,255,0.1)] px-2 py-1 text-sm leading-4 font-medium tracking-[0.78px] text-[#3979ff] uppercase shadow-[0px_3px_3px_0px_rgba(39,39,42,0.3),inset_0px_0px_3px_0px_rgba(255,255,255,0.25)]">
            NIA · Ask
          </span>

          <h1 className="flex flex-col text-4xl leading-none font-medium tracking-[-1.5px] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-3px]">
            <span>Know more.</span>
            <span className="flex gap-3">
              <span className="bg-[linear-gradient(90.4deg,rgb(125,41,169)_28.7%,rgb(57,121,255)_90%)] bg-clip-text text-transparent">
                Ask
              </span>
              <span>better.</span>
            </span>
          </h1>

          <p className="max-w-[500px] text-base leading-6 tracking-[-0.2px] text-[#696969] lg:text-lg lg:leading-7">
            The news is only the beginning. Ask NIA to explain a story, simplify a complex
            topic, or help you connect the dots.
          </p>

          <Link
            href="/nia/ask"
            className="relative flex h-10 w-fit items-center gap-2.5 overflow-hidden rounded-[13px] py-2 pr-2 pl-4 shadow-[0px_3px_3px_0px_rgba(39,39,42,0.3),inset_0px_0px_3px_0px_rgba(255,255,255,0.25)] transition-transform hover:-translate-y-px"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[13px]"
              style={{ backgroundImage: askButtonBackground }}
            />
            <span className="relative text-base leading-4 font-medium tracking-[-0.2px] text-white">
              Ask NIA
            </span>
            <span className="relative grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
              <Image
                src="/nia/arrow-up-right.svg"
                alt=""
                width={12}
                height={12}
                className="block"
              />
            </span>
          </Link>
        </FadeIn>

        {/* Chat mock */}
        <FadeIn delay={0.2} className="relative w-full max-w-[430px] shrink-0">
          {/* Glows sitting behind the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-9 left-1/2 h-[168px] w-[360px] max-w-full -translate-x-1/2 rounded-[122.963px] bg-linear-to-r/srgb from-[rgba(175,117,255,0.4)] from-[2.404%] to-[rgba(77,144,253,0.4)] to-[97.5%] opacity-90 blur-[72px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[5px] left-1/2 h-[78px] w-[320px] max-w-full -translate-x-1/2 rounded-full bg-linear-to-r/srgb from-[rgba(175,117,255,0.08)] from-[2.404%] to-[rgba(77,144,253,0.08)] to-[97.5%] blur-[36px]"
          />

          <HeroChat />
        </FadeIn>
      </div>
    </section>
  )
}
