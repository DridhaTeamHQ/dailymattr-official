import Image from "next/image"
import Link from "next/link"

import { formatItems } from "./nav-config"

// Radial glows layered over the base gradient — exported straight from Figma
// node 8856:12357 so the NIA panel lighting matches the design pixel for pixel.
const niaPanelBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -16.28 -20.4 0 61.2 35.52)'><stop stop-color='rgba(108,140,255,0.55)' offset='0'/><stop stop-color='rgba(108,140,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -17.76 -18.7 0 312.8 281.2)'><stop stop-color='rgba(178,92,255,0.65)' offset='0'/><stop stop-color='rgba(178,92,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -11.84 -13.6 0 238 103.6)'><stop stop-color='rgba(57,121,255,0.35)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  "linear-gradient(162.41824684353088deg, rgb(18, 10, 58) 8.4861%, rgb(26, 11, 79) 45.849%, rgb(42, 15, 110) 91.514%)",
].join(", ")

const panelShadow =
  "0px 0px 0px 1px rgba(16,24,40,0.06), 0px 24px 64px 0px rgba(16,24,40,0.14), 0px 6px 16px 0px rgba(16,24,40,0.06)"

/**
 * The Features mega-menu card. Figma: "Container" — node 8856:12356.
 * 780 × 320 overall: a 340px NIA promo panel beside a 404px format list.
 */
export function FeaturesMenuPanel() {
  return (
    <div
      className="relative grid grid-cols-[340px_404px] grid-rows-[296px] gap-3 overflow-clip rounded-[24px] bg-white p-3 [.theme-nia_&]:bg-[#18181b] [.theme-nia_&]:outline [.theme-nia_&]:-outline-offset-1 [.theme-nia_&]:outline-white/10"
      style={{ boxShadow: panelShadow }}
      data-node-id="8856:12356"
    >
      {/* NIA promo panel — the whole card links to the NIA page */}
      <Link
        href="/nia"
        aria-label="NIA, your AI assistant"
        className="flex min-h-[296px] flex-col items-start self-stretch overflow-clip rounded-[16px] p-[22px] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3979ff]"
        style={{ backgroundImage: niaPanelBackground }}
        data-node-id="8856:12357"
      >
        <div className="flex shrink-0 items-center gap-2">
          <Image
            src="/nav-menu/nia-icon.svg"
            alt=""
            width={32}
            height={32}
            className="block shrink-0"
          />
          <p className="text-[15px] leading-4 font-medium tracking-[0.8px] text-white/75">
            AI ASSISTANT
          </p>
        </div>

        <div className="flex h-10 w-[296px] shrink-0 flex-col items-start pt-2">
          <p className="w-full text-[28px] leading-8 font-medium tracking-[-0.8px] text-white">
            NIA
          </p>
        </div>

        <div className="flex h-7 w-[296px] shrink-0 flex-col items-start pt-1.5">
          <p className="w-full text-[15px] leading-[22px] text-white/72">
            Know more. Ask better.
          </p>
        </div>

        <div className="flex min-h-px flex-1 flex-col items-start justify-end">
          <div className="h-12 w-[296px] shrink-0" />
        </div>
      </Link>

      {/* Format list */}
      <div className="flex flex-col items-start self-stretch" data-node-id="8856:12379">
        <div className="flex w-full flex-col items-start px-1 py-1.5">
          {formatItems.map((item, i) => (
            <div key={item.href} className="contents">
              {i > 0 && (
                <div className="flex w-full shrink-0 flex-col items-start px-[14px]">
                  <div className="h-px w-full shrink-0 bg-[#eef0f3] [.theme-nia_&]:bg-white/8" />
                </div>
              )}
              <Link
                href={item.href}
                className="group/row flex w-[396px] shrink-0 items-center gap-[14px] rounded-[14px] p-[14px] transition-colors hover:bg-[#f5f7fb] focus-visible:bg-[#f5f7fb] focus-visible:outline-none [.theme-nia_&]:hover:bg-white/5 [.theme-nia_&]:focus-visible:bg-white/5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#eaf1ff] [.theme-nia_&]:bg-[rgba(57,121,255,0.14)]">
                  <Image
                    src={item.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="block"
                  />
                </span>

                <span className="flex min-w-px flex-1 flex-col items-start">
                  <span className="flex w-full items-center gap-2">
                    <span className="text-[16px] leading-5 font-medium whitespace-nowrap text-[#0b0d12] [.theme-nia_&]:text-white">
                      {item.name}
                    </span>
                    <span className="rounded-[6px] bg-[#eaf1ff] px-1.5 py-[3px] text-[11px] leading-[14px] font-medium tracking-[0.8px] whitespace-nowrap text-[#3979ff] [.theme-nia_&]:bg-[rgba(57,121,255,0.14)] [.theme-nia_&]:text-[#5b8cff]">
                      {item.tag}
                    </span>
                  </span>
                  <span className="flex h-[23px] w-[282px] flex-col items-start pt-[3px]">
                    <span className="text-[14px] leading-5 whitespace-nowrap text-[#6b7280] [.theme-nia_&]:text-white/55">
                      {item.description}
                    </span>
                  </span>
                </span>

                {/* Rest state uses the muted arrow; hover swaps in the dark one */}
                <span className="relative block size-[14px] shrink-0">
                  <Image
                    src="/nav-menu/arrow-muted.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="block transition-opacity group-hover/row:opacity-0"
                  />
                  <Image
                    src="/nav-menu/arrow-active.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="absolute inset-0 block opacity-0 transition-opacity group-hover/row:opacity-100 [.theme-nia_&]:invert"
                  />
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex min-h-px w-full flex-1 flex-col items-start justify-end">
          <Link
            href="/formats"
            className="flex h-[37px] w-full shrink-0 items-center justify-between border-t border-solid border-[#eef0f3] [.theme-nia_&]:border-white/8 px-[14px] pt-3 pb-1"
          >
            <span className="text-[14px] leading-5 font-medium whitespace-nowrap text-[#3979ff]">
              Explore formats
            </span>
            <Image
              src="/nav-menu/arrow-blue.svg"
              alt=""
              width={14}
              height={14}
              className="block shrink-0 transition-transform duration-200 hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Pointer notch — clipped by the card, matching the Figma render */}
      <div
        className="absolute top-[-9.9px] left-[184.1px] flex size-[19.799px] items-center justify-center"
        aria-hidden="true"
      >
        <div className="flex-none rotate-45">
          <div
            className="size-[14px] rounded-[3px] bg-white [.theme-nia_&]:bg-[#18181b]"
            style={{ boxShadow: "-1px -1px 0px 0px rgba(16,24,40,0.06)" }}
          />
        </div>
      </div>
    </div>
  )
}
