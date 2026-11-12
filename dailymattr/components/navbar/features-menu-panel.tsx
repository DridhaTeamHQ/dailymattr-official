import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import { formatItems } from "./nav-config";

// Radial glows layered over the base gradient — exported straight from Figma
// node 8856:12357 so the NIA panel lighting matches the design pixel for pixel.
const niaPanelBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -16.28 -20.4 0 61.2 35.52)'><stop stop-color='rgba(108,140,255,0.55)' offset='0'/><stop stop-color='rgba(108,140,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -17.76 -18.7 0 312.8 281.2)'><stop stop-color='rgba(178,92,255,0.65)' offset='0'/><stop stop-color='rgba(178,92,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 340 296' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -11.84 -13.6 0 238 103.6)'><stop stop-color='rgba(57,121,255,0.35)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  "linear-gradient(162.41824684353088deg, rgb(18, 10, 58) 8.4861%, rgb(26, 11, 79) 45.849%, rgb(42, 15, 110) 91.514%)",
].join(", ");

/**
 * NIA copy and format rows slide in from the right and fade in one after another when the
 * menu opens (both columns run side by side, then "Explore formats" last).
 * On close the delay drops to 0 so they reset together under the panel's own fade.
 */
const ROW_BASE_DELAY = 220;
const ROW_STAGGER = 120;

function staggerIn(open: boolean, index: number) {
  return {
    className: cn(
      "transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-x-0 motion-reduce:transition-opacity",
      open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
    ),
    style: {
      transitionDelay: open
        ? `${ROW_BASE_DELAY + index * ROW_STAGGER}ms`
        : "0ms",
    },
  };
}

const panelShadow =
  "0px 0px 0px 1px rgba(16,24,40,0.06), 0px 24px 64px 0px rgba(16,24,40,0.14), 0px 6px 16px 0px rgba(16,24,40,0.06)";

/**
 * The Features mega-menu card. Figma: "Container" — node 8856:12356.
 * 780 × 320 overall: a 340px NIA promo panel beside a 404px format list.
 */
export function FeaturesMenuPanel({ open = true }: { open?: boolean }) {
  return (
    <div
      className="relative grid grid-cols-[21.25rem_25.25rem] grid-rows-[18.5rem] gap-3 overflow-clip rounded-[1.5rem] bg-white p-3 [.theme-nia_&]:bg-[#18181b] [.theme-nia_&]:outline [.theme-nia_&]:-outline-offset-1 [.theme-nia_&]:outline-white/10"
      style={{ boxShadow: panelShadow }}
      data-node-id="8856:12356"
    >
      {/* NIA promo panel — the whole card links to the NIA page */}
      <Link
        href="/nia"
        aria-label="NIA, your AI assistant"
        className="flex min-h-[18.5rem] flex-col items-start self-stretch overflow-clip rounded-[1rem] p-[1.375rem] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3979ff]"
        style={{ backgroundImage: niaPanelBackground }}
        data-node-id="8856:12357"
      >
        <div
          className={cn("flex shrink-0 items-center gap-2", staggerIn(open, 0).className)}
          style={staggerIn(open, 0).style}
        >
          <Image
            src="/nav-menu/nia-icon.svg"
            alt=""
            width={32}
            height={32}
            className="block shrink-0"
          />
          <p className="text-md leading-4 font-medium tracking-[0.05rem] text-white/75">
            AI ASSISTANT
          </p>
        </div>

        <div
          className={cn("flex h-10 w-[18.5rem] shrink-0 flex-col items-start pt-2", staggerIn(open, 1).className)}
          style={staggerIn(open, 1).style}
        >
          <p className="w-full text-3xl leading-8 font-medium tracking-[-0.05rem] text-white">
            NIA
          </p>
        </div>

        <div
          className={cn("flex h-7 w-[18.5rem] shrink-0 flex-col items-start pt-1.5", staggerIn(open, 2).className)}
          style={staggerIn(open, 2).style}
        >
          <p className="w-full text-md leading-5.5 text-white/72">
            Know more. Ask better.
          </p>
        </div>

        <div className="flex min-h-px flex-1 flex-col items-start justify-end">
          <div className="h-12 w-[18.5rem] shrink-0" />
        </div>
      </Link>

      {/* Format list */}
      <div
        className="flex flex-col items-start self-stretch"
        data-node-id="8856:12379"
      >
        <div className="flex w-full flex-col items-start px-1 py-1.5">
          {formatItems.map((item, i) => {
            const stagger = staggerIn(open, i + 1);
            return (
              <div
                key={item.href}
                className={cn("w-full", stagger.className)}
                style={stagger.style}
              >
                {i > 0 && (
                  <div className="flex w-full shrink-0 flex-col items-start px-[0.875rem]">
                    <div className="h-px w-full shrink-0 bg-[#eef0f3] [.theme-nia_&]:bg-white/8" />
                  </div>
                )}
                <Link
                  href={item.href}
                  className="group/row flex w-[24.75rem] shrink-0 items-center gap-[0.875rem] rounded-[0.875rem] p-[0.875rem] transition-colors hover:bg-[#f5f7fb] focus-visible:bg-[#f5f7fb] focus-visible:outline-none [.theme-nia_&]:hover:bg-white/5 [.theme-nia_&]:focus-visible:bg-white/5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[0.75rem] bg-[#eaf1ff] [.theme-nia_&]:bg-[rgba(57,121,255,0.14)]">
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
                      <span className="text-base leading-5 font-medium whitespace-nowrap text-[#0b0d12] [.theme-nia_&]:text-white">
                        {item.name}
                      </span>
                      <span className="rounded-[0.375rem] bg-[#eaf1ff] px-1.5 py-[0.1875rem] text-xs leading-3.5 font-medium tracking-[0.05rem] whitespace-nowrap text-[#3979ff] [.theme-nia_&]:bg-[rgba(57,121,255,0.14)] [.theme-nia_&]:text-[#5b8cff]">
                        {item.tag}
                      </span>
                    </span>
                    <span className="flex h-[1.4375rem] w-[17.625rem] flex-col items-start pt-[0.1875rem]">
                      <span className="text-sm leading-5 whitespace-nowrap text-[#6b7280] [.theme-nia_&]:text-white/55">
                        {item.description}
                      </span>
                    </span>
                  </span>

                  {/* Rest state uses the muted arrow; hover swaps in the dark one */}
                  <span className="relative block size-[0.875rem] shrink-0">
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
            );
          })}
        </div>

        {/* "Explore formats" follows the rows as the last step of the stagger */}
        <div
          className={cn(
            "flex min-h-px w-full flex-1 flex-col items-start justify-end",
            staggerIn(open, formatItems.length + 1).className,
          )}
          style={staggerIn(open, formatItems.length + 1).style}
        >
          <Link
            href="/formats"
            className="flex h-[2.3125rem] w-full shrink-0 items-center justify-between border-t border-solid border-[#eef0f3] [.theme-nia_&]:border-white/8 px-[0.875rem] pt-3 pb-1"
          >
            <span className="text-sm leading-5 font-medium whitespace-nowrap text-[#3979ff]">
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
        className="absolute top-[-0.6188rem] left-[11.5062rem] flex size-[1.2374rem] items-center justify-center"
        aria-hidden="true"
      >
        <div className="flex-none rotate-45">
          <div
            className="size-[0.875rem] rounded-[0.1875rem] bg-white [.theme-nia_&]:bg-[#18181b]"
            style={{ boxShadow: "-1px -1px 0px 0px rgba(16,24,40,0.06)" }}
          />
        </div>
      </div>
    </div>
  );
}
