"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "cn";
import { howItWorksGreeting, howItWorksSteps } from "./content";
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
  state: "sent" | "active" | "idle";
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
        <span className="text-sm leading-4 font-medium text-white/55">
          Sent
        </span>
      </span>
    );
  }

  // Same round send button as the chat panel's input, dimmed while NIA is typing.
  const active = state === "active";
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 -rotate-90 place-items-center rounded-full bg-[#3979ff] transition-opacity duration-200",
        active
          ? "drop-shadow-[0px_0px_7px_rgba(57,121,255,0.5)]"
          : "opacity-40",
      )}
    >
      <span className="sr-only">{children}</span>
      <Image
        src="/nia/send-14.svg"
        alt=""
        width={16}
        height={16}
        className="block"
      />
    </span>
  );
}

type Turn = { index: number; status: "typing" | "done" };

/** How long NIA "types" before its canned reply appears. */
const TYPING_MS = 1100;

function NiaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <NiaMark size={26} iconSize={14} />
      <div className="max-w-[486px] flex-1 rounded-[16px] rounded-tl-[4px] border border-white/8 bg-[#1c1c20] p-3.5">
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex h-5 items-center gap-1.5" aria-label="NIA is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-white/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function NiaHowItWorks() {
  const reduceMotion = useReducedMotion();
  const [turns, setTurns] = useState<Turn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const busy = turns.some((t) => t.status === "typing");
  const sent = new Set(turns.map((t) => t.index));
  const allSent = sent.size === howItWorksSteps.length && !busy;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [turns, reduceMotion]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  function send(index: number) {
    if (busy || sent.has(index)) return;
    setTurns((prev) => [...prev, { index, status: "typing" }]);
    const id = window.setTimeout(() => {
      setTurns((prev) =>
        prev.map((t) => (t.index === index ? { ...t, status: "done" } : t)),
      );
    }, TYPING_MS);
    timers.current.push(id);
  }

  function reset() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
    setTurns([]);
  }

  const enter = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    // Figma 8856:9958: 120 top, 160 bottom. Capped at the same 1200px as the sections
    // below so it lines up with the rest of the page on very wide screens.
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:pt-[120px] lg:pb-[160px]">
      <div className="relative isolate mx-auto flex max-w-[1200px] flex-col font-tight">
        {/* Glow is anchored to the content, not the screen edge, so it stays behind the panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 top-[180px] -right-[350px] h-[700px] w-[900px]"
          style={{ backgroundImage: glow }}
        />
        <FadeIn className="flex flex-col items-center gap-3 text-center lg:gap-4">
          <p className="text-sm leading-4.5 font-medium tracking-[-0.16px] text-[#5b8cff] uppercase lg:text-lg">
            How NIA works
          </p>
          <h2 className="text-3xl leading-tight font-medium text-white sm:text-display lg:text-5xl lg:leading-12">
            One question can take you further.
          </h2>
        </FadeIn>

        <div className="mt-10 flex flex-col items-center gap-8 lg:mt-16 lg:flex-row lg:items-center lg:gap-0">
          {/* Question ladder */}
          {/* Figma: a 659.5px half-column holding 440px rows, so the gap is built in */}
          <FadeIn className="w-full lg:flex-[659.5_1_0%]">
            <div className="mx-auto flex w-full max-w-[440px] flex-col lg:mx-0">
              {howItWorksSteps.map((step, index) => {
                const isSent = sent.has(index);
                const state = isSent ? "sent" : busy ? "idle" : "active";
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => send(index)}
                    disabled={isSent || busy}
                    aria-label={isSent ? `${step.question} (sent)` : `Send: ${step.question}`}
                    className={cn(
                      "group flex items-center gap-3 border-b border-white/8 py-3 text-left sm:gap-5 lg:py-4",
                      !isSent && !busy && "cursor-pointer",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-[10px] border text-sm font-medium tracking-[0.3px] text-white transition-colors duration-300 lg:size-10 lg:text-md",
                        isSent
                          ? "border-[#3979ff] bg-[#3979ff]"
                          : "border-white/10 bg-white/10",
                      )}
                    >
                      {step.number}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-base leading-6 font-medium tracking-[-0.2px] transition-colors duration-300 lg:text-lg",
                        isSent ? "text-white/60" : "text-white",
                      )}
                    >
                      {step.question}
                    </span>
                    <span className="transition-transform duration-200 group-enabled:group-hover:-translate-y-0.5 group-enabled:group-active:scale-95">
                      <StepBadge state={state}>Send</StepBadge>
                    </span>
                  </button>
                );
              })}

              <AnimatePresence>
                {allSent && (
                  <motion.button
                    type="button"
                    onClick={reset}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 cursor-pointer self-start text-sm font-medium text-[#5b8cff] hover:text-[#7fa6ff]"
                  >
                    Start over
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Chat panel. On desktop it is 754px tall (the Figma size) but never taller than
              the screen minus the header, so it still fits when the browser is zoomed in.
              The page is zoomed by --nia-scale, so viewport units are divided back out. */}
          <FadeIn delay={0.15} className="w-full lg:flex-[741.5_1_0%]">
            <div
              className="relative flex h-[480px] flex-col gap-4 overflow-hidden rounded-[20px] border border-white/8 px-4 pb-4 font-sans sm:h-[560px] sm:px-10 sm:pb-10 lg:h-[clamp(420px,calc((100svh-112px)/var(--nia-scale,1)),754px)] lg:rounded-[24px]"
              style={{ backgroundImage: panelBackground }}
            >
              {/* Colourless NIA mark sitting behind the conversation as a watermark */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[38%] flex -translate-y-1/2 justify-center"
              >
                <span className="grid size-[120px] place-items-center rounded-full border border-white/6 bg-white/[0.03] sm:size-[160px]">
                  <svg viewBox="0 0 18 18" className="size-14 text-white/10 sm:size-20" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M9 1.5L10.725 6.3C10.7977 6.52865 10.9242 6.73652 11.0938 6.90617C11.2635 7.07582 11.4714 7.2023 11.7 7.275L16.5 9L11.7 10.725C11.4714 10.7977 11.2635 10.9242 11.0938 11.0938C10.9242 11.2635 10.7977 11.4714 10.725 11.7L9 16.5L7.275 11.7C7.2023 11.4714 7.07582 11.2635 6.90617 11.0938C6.73652 10.9242 6.52865 10.7977 6.3 10.725L1.5 9L6.3 7.275C6.52865 7.2023 6.73652 7.07582 6.90617 6.90617C7.07582 6.73652 7.2023 6.52865 7.275 6.3L9 1.5Z"
                    />
                  </svg>
                </span>
              </div>

              <div
                ref={scrollRef}
                aria-live="polite"
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {/* Top padding lives inside the scroller so messages run up to the panel edge */}
                <div className="mt-auto flex flex-col gap-4 pt-4 sm:pt-10">
                  <NiaBubble>
                    <p className="text-sm leading-5 text-white/80">
                      {howItWorksGreeting}
                    </p>
                  </NiaBubble>

                  {turns.map((turn) => {
                    const step = howItWorksSteps[turn.index];
                    return (
                      <div key={step.number} className="flex flex-col gap-4">
                        <motion.div {...enter} className="flex justify-end">
                          <div className="rounded-[16px] rounded-br-[4px] bg-gradient-to-r from-[#3979ff] to-[#5b6bff] px-3.5 py-2.5 drop-shadow-[0px_6px_9px_rgba(57,121,255,0.35)]">
                            <p className="text-sm leading-5 font-medium text-white">
                              {step.question}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div {...enter}>
                          <NiaBubble>
                            {turn.status === "typing" ? (
                              <TypingDots />
                            ) : (
                              <motion.p
                                initial={reduceMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm leading-5 text-white/80"
                              >
                                {step.answer}
                              </motion.p>
                            )}
                          </NiaBubble>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex h-12 shrink-0 items-center justify-between rounded-[12px] border border-white/8 bg-[#1c1c20] px-3.5">
                <p className="text-sm leading-5 text-white/40">
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
