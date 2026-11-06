import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { heroChat } from "./content"
import { NiaMark } from "./nia-mark"

/** Radial sheen behind the "Ask NIA" pill. Figma node 8856:9119. */
const askButtonBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 116 40' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(8.55 5.7 -16.53 24.795 -16.5 -15.5)'><stop stop-color='rgba(108,16,80,1)' offset='0'/><stop stop-color='rgba(81,12,60,0.75)' offset='0.25'/><stop stop-color='rgba(54,8,40,0.5)' offset='0.5'/><stop stop-color='rgba(0,0,0,0)' offset='1'/></radialGradient></defs></svg>")`,
  "linear-gradient(90deg, rgb(8, 45, 123) 0%, rgb(8, 45, 123) 100%)",
].join(", ")

export function NiaHero() {
  return (
    <section className="relative overflow-hidden bg-[#0e0e0e] px-4 py-24 sm:px-6 lg:px-8 lg:pt-[185px] lg:pb-[204px]">
      {/* Figma 8856:9100: copy (540) + 133 gap + chat card (430) = a 1103px column */}
      <div className="mx-auto flex max-w-[1103px] flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        {/* Copy */}
        <FadeIn className="flex w-full max-w-[540px] flex-col gap-6">
          <span className="w-fit rounded-[6px] bg-[rgba(28,104,255,0.1)] px-2 py-1 text-[13px] leading-4 font-medium tracking-[0.78px] text-[#3979ff] uppercase shadow-[0px_3px_3px_0px_rgba(39,39,42,0.3),inset_0px_0px_3px_0px_rgba(255,255,255,0.25)]">
            NIA · Ask
          </span>

          <h1 className="flex flex-col text-[44px] leading-[1] font-medium tracking-[-2px] text-white sm:text-[56px] lg:text-[64px] lg:leading-[64px] lg:tracking-[-3px]">
            <span>Know more.</span>
            <span className="flex gap-3">
              <span className="bg-[linear-gradient(90.4deg,rgb(125,41,169)_28.7%,rgb(57,121,255)_90%)] bg-clip-text text-transparent">
                Ask
              </span>
              <span>better.</span>
            </span>
          </h1>

          <p className="max-w-[500px] text-[18px] leading-7 tracking-[-0.2px] text-[#696969]">
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
            <span className="relative text-[16px] leading-4 font-medium tracking-[-0.2px] text-white">
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
        <FadeIn delay={0.15} className="relative w-full max-w-[430px] shrink-0">
          {/* Glows sitting behind the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-9 left-1/2 h-[168px] w-[360px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-[rgba(175,117,255,0.4)] to-[rgba(77,144,253,0.4)] opacity-90 blur-[72px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-1 left-1/2 h-[78px] w-[320px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-[rgba(175,117,255,0.08)] to-[rgba(77,144,253,0.08)] blur-[36px]"
          />

          <div className="relative flex flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_13.11%,rgba(255,255,255,0)_100%),linear-gradient(90deg,rgb(14,14,15)_0%,rgb(14,14,15)_100%)] shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.2),0px_11px_28px_-4px_rgba(0,0,0,0.2),0px_0px_0px_0.5px_rgba(255,255,255,0.16),inset_0px_0px_11px_0px_rgba(255,255,255,0.1)]">
            {/* Card header */}
            <div className="flex h-[90px] shrink-0 items-center gap-3 pr-4 pl-7">
              <NiaMark size={34} iconSize={18} />
              <p className="text-[20px] leading-[26px] font-semibold tracking-[-0.3px] text-white">
                {heroChat.title}
              </p>
            </div>

            {/* Conversation */}
            <div className="flex flex-col items-end gap-4 px-7 pb-2">
              <div className="w-[201px] rounded-[22px] bg-white/8 px-5 py-3">
                <p className="text-[15px] leading-[22px] text-white/90">{heroChat.question}</p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center gap-2">
                  <NiaMark size={26} iconSize={14} />
                  <p className="text-[14px] leading-[18px] font-semibold text-white/70">Nia</p>
                </div>

                <p className="max-w-[350px] text-[18px] leading-[27px] tracking-[-0.1px] text-white/95">
                  {heroChat.intro}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {heroChat.bullets.map((b) => (
                    <li key={b.id} className="flex gap-2.5">
                      <span className="text-[18px] leading-[27px] text-white/50">•</span>
                      <span
                        className={`max-w-[330px] text-[18px] leading-[27px] tracking-[-0.1px] ${
                          b.muted ? "text-white/32" : "text-white/95"
                        }`}
                      >
                        {"highlight" in b ? (
                          <>
                            {b.lead}{" "}
                            <span className="inline-block rounded-[5px] bg-[#3979ff] px-1.5 align-baseline text-white drop-shadow-[0px_0px_6px_rgba(91,140,255,0.45)]">
                              {b.highlight}
                            </span>{" "}
                            {b.trail}
                          </>
                        ) : (
                          b.text
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Composer */}
            <div className="mt-auto flex flex-col bg-gradient-to-b from-[rgba(39,39,42,0)] via-[rgba(26,26,28,0.98)] via-[76.9%] to-[#27272a] to-[124.6%] px-2 py-7">
              <div className="relative flex h-16 items-start rounded-[16px] bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_22.4%,rgba(0,0,0,0.067)_100%),linear-gradient(90deg,rgb(38,38,42)_0%,rgb(38,38,42)_100%)] py-2.5 pr-[50px] pl-4 shadow-[0px_0px_0px_0.75px_rgba(255,255,255,0.08),0px_2px_5px_0px_rgba(0,0,0,0.04)]">
                <p className="text-[13px] leading-5 tracking-[-0.065px] text-[#606169]">
                  {heroChat.placeholder}
                </p>
                <span className="absolute right-[14px] bottom-[6px] grid size-7 place-items-center rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_13.11%,rgba(255,255,255,0)_100%),linear-gradient(90deg,rgb(45,45,49)_0%,rgb(45,45,49)_100%)] shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.2)]">
                  <Image
                    src="/nia/send.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="block"
                  />
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
