"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react"

import { cn } from "cn"
import { heroChat } from "./content"
import { NiaMark } from "./nia-mark"
import { TypingDots } from "./typing-dots"

/** idle = the next question waits in the composer, typing = NIA is "thinking", streaming = its reply is appearing. */
type Stage = "idle" | "typing" | "streaming"

/** NIA's row shows up just after the question lands, then "types" for a moment. */
const REPLY_DELAY_S = 0.3
const TYPING_MS = 1100
/** Gap between each word of the streamed reply, and how long each word takes to fade in. */
const WORD_STAGGER_S = 0.035
const WORD_FADE_S = 0.3

const ease = [0.16, 1, 0.3, 1] as const

export type Word = { word: string; order: number; strong: boolean }

/** Each turn's reply split into words, numbered in reading order so each word knows when to appear. */
const script = heroChat.turns.map((turn) => {
  let order = 0
  const words = (text: string, strong = false): Word[] =>
    text.split(" ").map((word) => ({ word, order: order++, strong }))
  const intro = words(turn.reply.intro)
  const bullets = (turn.reply.bullets ?? []).map((b) => ({
    id: b.id,
    words: [...(b.label ? words(`${b.label}:`, true) : []), ...words(b.text)],
  }))
  return { ...turn, intro, bullets, streamS: (order - 1) * WORD_STAGGER_S + WORD_FADE_S }
})

type ScriptedTurn = (typeof script)[number]

/** A reply appearing word by word (also used by the How it works chat). */
export function StreamedWords({ words, play }: { words: Word[]; play: boolean }) {
  return words.map(({ word, order, strong }) => (
    <motion.span
      key={order}
      initial={play ? { opacity: 0, filter: "blur(3px)" } : false}
      animate={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: WORD_FADE_S, delay: order * WORD_STAGGER_S }}
      className={strong ? "font-semibold text-white" : undefined}
    >
      {word}{" "}
    </motion.span>
  ))
}

function Turn({
  turn,
  typing,
  play,
  className,
  ref,
}: {
  turn: ScriptedTurn
  typing: boolean
  play: boolean
  className?: string
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div ref={ref} className={cn("flex shrink-0 flex-col items-end gap-4", className)}>
      <motion.div
        initial={play ? { opacity: 0, y: 12, scale: 0.96 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease }}
        className="max-w-[185px] origin-bottom-right rounded-[20px] bg-white/8 px-4 py-2.5 lg:max-w-[201px] lg:rounded-[22px] lg:px-5 lg:py-3"
      >
        <p className="text-sm leading-5 text-white/90 lg:text-md lg:leading-5.5">{turn.question}</p>
      </motion.div>

      <motion.div
        initial={play ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease, delay: REPLY_DELAY_S }}
        className="flex w-full flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <NiaMark size={26} iconSize={14} />
          <p className="text-sm leading-4.5 font-semibold text-white/70">Nia</p>
        </div>

        {typing ? (
          <TypingDots className="h-6 lg:h-7" />
        ) : (
          <>
            <p className="max-w-[350px] text-sm leading-5.5 tracking-[-0.1px] text-white/95 lg:text-base lg:leading-6.5">
              <StreamedWords words={turn.intro} play={play} />
            </p>

            {turn.bullets.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {turn.bullets.map((b) => (
                  <li key={b.id} className="flex gap-2.5">
                    <motion.span
                      initial={play ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={{ duration: WORD_FADE_S, delay: b.words[0].order * WORD_STAGGER_S }}
                      className="font-sans text-sm leading-5.5 text-white/50 lg:text-base lg:leading-6.5"
                    >
                      •
                    </motion.span>
                    <span className="max-w-[330px] text-sm leading-5.5 tracking-[-0.1px] text-white/95 lg:text-base lg:leading-6.5">
                      <StreamedWords words={b.words} play={play} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

/**
 * The hero's chat card. It opens empty with the first question waiting in the composer.
 * Each Enter (or tap on send) asks it and plays NIA's reply, then the next follow-up
 * fills the composer, until every question in `heroChat.turns` has been asked.
 */
export function HeroChat() {
  const reduceMotion = useReducedMotion()
  /** How many questions have been asked so far. */
  const [sent, setSent] = useState(0)
  const [stage, setStage] = useState<Stage>("idle")
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastTurnRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const follow = useRef<AnimationPlaybackControls | null>(null)

  /** The question waiting in the composer, if any. */
  const next = stage === "idle" ? script[sent] : undefined
  /** Every question has been asked, so the composer locks. */
  const finished = sent >= script.length

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((id) => window.clearTimeout(id))
      follow.current?.stop()
    }
  }, [])

  // Each new question scrolls up to the top of the chat, like a real chat app.
  useEffect(() => {
    const scroller = scrollRef.current
    const turn = lastTurnRef.current
    if (sent < 2 || !scroller || !turn) return
    follow.current?.stop()
    scroller.scrollTo({ top: turn.offsetTop, behavior: reduceMotion ? "auto" : "smooth" })
  }, [sent, reduceMotion])

  // A reply taller than the chat glides down as it streams, so the newest words stay in view.
  useEffect(() => {
    const scroller = scrollRef.current
    if (stage !== "streaming" || reduceMotion || !scroller) return
    const end = scroller.scrollHeight - scroller.clientHeight
    if (end <= scroller.scrollTop + 1) return
    follow.current = animate(scroller.scrollTop, end, {
      duration: script[sent - 1].streamS,
      ease: "linear",
      onUpdate: (top) => {
        scroller.scrollTop = top
      },
    })
    return () => follow.current?.stop()
  }, [stage, sent, reduceMotion])

  function send() {
    if (!next) return
    const typingMs = REPLY_DELAY_S * 1000 + TYPING_MS
    const streamMs = reduceMotion ? 0 : next.streamS * 1000
    setSent((n) => n + 1)
    setStage("typing")
    timers.current.push(
      window.setTimeout(() => setStage("streaming"), typingMs),
      window.setTimeout(() => setStage("idle"), typingMs + streamMs),
    )
  }

  // Scrolling the chat yourself takes over from the auto-follow.
  const stopFollow = () => follow.current?.stop()

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_13.11%,rgba(255,255,255,0)_100%),linear-gradient(90deg,rgb(14,14,15)_0%,rgb(14,14,15)_100%)] shadow-[0px_7px_8px_-4px_rgba(0,0,0,0.2),0px_11px_28px_-4px_rgba(0,0,0,0.2),0px_0px_0px_0.5px_rgba(255,255,255,0.16),inset_0px_0px_11px_0px_rgba(255,255,255,0.1)]">
      {/* Card header */}
      <div className="flex h-[72px] shrink-0 items-center gap-3 pr-4 pl-5 font-roboto lg:h-[90px] lg:pl-7">
        <NiaMark size={34} iconSize={18} />
        <p className="text-lg leading-5.5 font-semibold tracking-[-0.3px] text-white lg:text-xl lg:leading-6.5">
          {heroChat.title}
        </p>
      </div>

      {/* Conversation. A fixed height keeps the card the same size from the empty start to the
          last reply; the chat scrolls inside it as more questions are asked. */}
      <div className="relative h-[358px] font-roboto lg:h-[410px]">
        {/* Welcome in the empty chat; fades away once the first question is sent */}
        <AnimatePresence>
          {sent === 0 && (
            <motion.div
              key="welcome"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
            >
              <NiaMark size={44} iconSize={22} />
              <p className="mt-1 text-xl leading-tight font-semibold tracking-[-0.3px] text-white lg:text-2xl">
                {heroChat.welcome.title}
              </p>
              <p className="max-w-[300px] text-sm leading-5 text-white/55 lg:text-base lg:leading-6">
                {heroChat.welcome.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <div
          ref={scrollRef}
          aria-live="polite"
          onWheel={stopFollow}
          onTouchStart={stopFollow}
          className="absolute inset-0 flex flex-col gap-8 overflow-y-auto px-5 pb-2 [scrollbar-width:none] lg:px-7 [&::-webkit-scrollbar]:hidden"
        >
          {script.slice(0, sent).map((turn, i) => {
            const last = i === sent - 1
            return (
              <Turn
                key={turn.id}
                ref={last ? lastTurnRef : undefined}
                turn={turn}
                typing={last && stage === "typing"}
                play={!reduceMotion}
                // The newest turn fills the chat, so it can always scroll to the top.
                className={last ? "min-h-full" : undefined}
              />
            )
          })}
        </div>
      </div>

      {/* Composer */}
      <div className="mt-auto flex flex-col bg-linear-to-b/srgb from-[rgba(39,39,42,0)] via-[rgba(26,26,28,0.98)] via-[76.9%] to-[#27272a] to-[124.6%] px-2 pt-3 pb-2">
        <div className="relative flex h-12 items-center rounded-[16px] bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_22.4%,rgba(0,0,0,0.067)_100%),linear-gradient(90deg,rgb(38,38,42)_0%,rgb(38,38,42)_100%)] pr-[50px] pl-4 shadow-[0px_0px_0px_0.75px_rgba(255,255,255,0.08),0px_2px_5px_0px_rgba(0,0,0,0.04)] transition-shadow duration-200 focus-within:shadow-[0px_0px_0px_1px_rgba(57,121,255,0.6),0px_2px_5px_0px_rgba(0,0,0,0.04)]">
          {/* Read-only: each reply is scripted for its question. Disabled once they're all asked. */}
          <textarea
            readOnly
            disabled={finished}
            rows={1}
            aria-label="Ask NIA"
            value={next?.question ?? ""}
            placeholder={heroChat.placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            className="h-5 w-full resize-none overflow-hidden bg-transparent text-sm leading-5 disabled:cursor-default tracking-[-0.065px] text-white/90 outline-none placeholder:text-[#606169]"
          />
          <button
            type="button"
            onClick={send}
            disabled={!next}
            aria-label="Send"
            className={cn(
              "absolute right-2.5 bottom-2.5 grid size-7 place-items-center rounded-[14px] transition-[translate,filter] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3979ff]",
              next
                ? "cursor-pointer bg-[#3979ff] drop-shadow-[0px_0px_7px_rgba(57,121,255,0.5)] hover:-translate-y-px active:scale-95"
                : "bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_13.11%,rgba(255,255,255,0)_100%),linear-gradient(90deg,rgb(45,45,49)_0%,rgb(45,45,49)_100%)] shadow-[inset_0px_0.5px_0px_0px_rgba(255,255,255,0.2)]",
            )}
          >
            <Image src="/nia/send.svg" alt="" width={16} height={16} className="block" />
          </button>
        </div>
      </div>
    </div>
  )
}
