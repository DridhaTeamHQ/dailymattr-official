import Image from "next/image";

import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "cn";
import { howItWorksSteps, howItWorksThread } from "./content";
import { NiaMark } from "./nia-mark";

/** Ambient blue glow bleeding off the right of the section. Figma node 8856:9959. */
const glow =
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(57,121,255,0.12) 0%, rgba(57,121,255,0) 70%)";

/** The chat panel's two corner washes plus its flat base. Figma node 8856:10009. */
const panelBackground = [
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 741.5 754' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -41.47 -44.49 0 163.13 135.72)'><stop stop-color='rgba(57,121,255,0.18)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  `url("data:image/svg+xml;utf8,<svg viewBox='0 0 741.5 754' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -41.47 -40.782 0 608.03 640.9)'><stop stop-color='rgba(122,77,240,0.18)' offset='0'/><stop stop-color='rgba(122,77,240,0)' offset='0.7'/></radialGradient></defs></svg>")`,
  "linear-gradient(90deg, rgb(20, 20, 23) 0%, rgb(20, 20, 23) 100%)",
].join(", ");

function StepBadge({
  state,
  children,
}: {
  state: string;
  children: React.ReactNode;
}) {
  if (state === "sent") {
    return (
      <span className="flex h-9 shrink-0 items-center gap-2 rounded-[10px] border border-white/8 bg-white/4 px-3">
        <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#3979ff]">
          <Image
            src="/nia/check.svg"
            alt=""
            width={11}
            height={11}
            className="block"
          />
        </span>
        <span className="text-[14px] leading-4 font-medium text-white/55">
          Sent
        </span>
      </span>
    );
  }

  const active = state === "active";
  return (
    <span
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-[10px] border pr-3 pl-3.5",
        active
          ? "border-[rgba(120,150,255,0.6)] bg-gradient-to-r from-[#3979ff] to-[#5b6bff] drop-shadow-[0px_6px_9px_rgba(57,121,255,0.4)]"
          : "border-[rgba(57,121,255,0.35)] bg-[rgba(57,121,255,0.1)]",
      )}
    >
      <span
        className={cn(
          "text-[14px] leading-4 font-medium",
          active ? "text-white" : "text-[#d6e2ff]",
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "grid size-4 shrink-0 -rotate-90 place-items-center rounded-full",
          active
            ? "bg-white drop-shadow-[0px_0px_4px_rgba(57,121,255,0.5)]"
            : "bg-[rgba(57,121,255,0.1)]",
        )}
      >
        <Image
          src="/nia/send-small.svg"
          alt=""
          width={8}
          height={8}
          className="block"
        />
      </span>
    </span>
  );
}

export function NiaHowItWorks() {
  return (
    // Figma 8856:9958: 120 top, 160 bottom, and the 1401px block leaves ~260px
    // gutters on the 1920 frame, so on desktop it is sized as 73% of the width.
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-0 lg:pt-[120px] lg:pb-[160px]">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[300px] -right-[200px] h-[700px] w-[900px]"
        style={{ backgroundImage: glow }}
      />

      <div className="relative mx-auto flex max-w-[1401px] flex-col font-tight lg:w-[73%]">
        <FadeIn className="flex flex-col items-center gap-3 text-center lg:gap-4">
          <p className="text-sm leading-[18px] font-medium tracking-[-0.16px] text-[#5b8cff] uppercase lg:text-[18px]">
            How NIA works
          </p>
          <h2 className="text-3xl leading-tight font-medium text-white sm:text-[40px] lg:text-[48px] lg:leading-[48px]">
            One question can take you further.
          </h2>
        </FadeIn>

        <div className="mt-10 flex flex-col items-center gap-8 lg:mt-16 lg:flex-row lg:items-center lg:gap-0">
          {/* Question ladder */}
          {/* Figma: a 659.5px half-column holding 440px rows, so the gap is built in */}
          <FadeIn className="w-full lg:flex-[659.5_1_0%]">
            <div className="mx-auto flex w-full max-w-[440px] flex-col lg:mx-0">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-center gap-3 border-b border-white/8 py-3 sm:gap-5 lg:py-4"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-[10px] border text-[14px] font-medium lg:size-10 lg:text-[15px] tracking-[0.3px] text-white",
                      step.state === "sent"
                        ? "border-[#3979ff] bg-[#3979ff]"
                        : "border-white/10 bg-white/10",
                    )}
                  >
                    {step.number}
                  </span>
                  <p
                    className={cn(
                      "flex-1 text-base leading-6 font-medium tracking-[-0.2px] lg:text-[18px]",
                      step.state === "sent" ? "text-white/60" : "text-white",
                    )}
                  >
                    {step.question}
                  </p>
                  <StepBadge state={step.state}>Send</StepBadge>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Chat panel */}
          <FadeIn delay={0.15} className="w-full lg:flex-[741.5_1_0%]">
            <div
              className="flex min-h-[420px] flex-col gap-4 overflow-hidden rounded-[20px] border border-white/8 p-4 font-sans sm:p-10 lg:h-[754px] lg:rounded-[24px]"
              style={{ backgroundImage: panelBackground }}
            >
              <div className="flex flex-1 flex-col justify-end gap-4">
                {howItWorksThread.map((turn) => (
                  <div key={turn.id} className="flex flex-col gap-4">
                    <div className="flex justify-end">
                      <div className="rounded-[16px] rounded-br-[4px] bg-gradient-to-r from-[#3979ff] to-[#5b6bff] px-3.5 py-2.5 drop-shadow-[0px_6px_9px_rgba(57,121,255,0.35)]">
                        <p className="text-[14px] leading-5 font-medium text-white">
                          {turn.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <NiaMark size={26} iconSize={14} />
                      <div className="flex max-w-[486px] flex-1 flex-col gap-2 rounded-[16px] rounded-tl-[4px] border border-white/8 bg-[#1c1c20] p-3.5">
                        {turn.bars.map((w, i) => (
                          <span
                            key={i}
                            className="h-2.5 max-w-full rounded-[5px] bg-white/12"
                            style={{ width: w }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex h-12 items-center justify-between rounded-[12px] border border-white/8 bg-[#1c1c20] px-3.5">
                <p className="text-[14px] leading-5 text-white/40">
                  Ask a follow-up question
                </p>
                <span className="grid size-7 shrink-0 -rotate-90 place-items-center rounded-full bg-[#3979ff] drop-shadow-[0px_0px_7px_rgba(57,121,255,0.5)]">
                  <Image
                    src="/nia/send-14.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="block"
                  />
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
