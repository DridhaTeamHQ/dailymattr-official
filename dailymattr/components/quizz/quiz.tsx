"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { RotateCcw } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { QUIZ_HOME, editionDate, getEdition, lenses } from "./content"
import {
  ActionBar,
  BackButton,
  CARD,
  Eyebrow,
  OptionGroup,
  PrimaryButton,
  PrimaryLink,
  Progress,
  ReviewItem,
  ScoreCard,
  SecondaryButton,
  SeriesBar,
  StoryBody,
  StoryImage,
  StyleCard,
  TakeawayCard,
  TextLink,
  TITLE,
} from "./parts"
import { scoreQuiz } from "./scoring"

type Step = "start" | "question" | "result"

/** How a quiz works, shown on the start screen. */
const STEPS: React.ReactNode[] = [
  "Read the 30-second brief on this story.",
  "Answer 3 questions. Go with your gut.",
  <>
    Get your <strong className="font-semibold">Awareness score</strong>, your{" "}
    <strong className="font-semibold">thinking style</strong>, and the right answer to every question.
  </>,
]

/**
 * One story's quiz at /quizz/<slug>: a start screen with the story's photo and headline, three
 * questions, then the score. The story brief is a sheet away ("Read the brief"). UI only:
 * answers live in component state and nothing is sent anywhere.
 */
export function Quiz({ slug }: { slug: string }) {
  // The page only renders Quiz for a known slug (it calls notFound() otherwise).
  const edition = getEdition(slug)!

  const [step, setStep] = useState<Step>("start")
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | undefined)[]>([])
  const [briefOpen, setBriefOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  // The sheet opens on the headline, not on its first link (which sits at the bottom).
  const briefHeadingRef = useRef<HTMLParagraphElement>(null)
  const firstRender = useRef(true)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const lenis = useLenis()
  const reduce = useReducedMotion()

  const total = edition.questions.length
  const question = edition.questions[idx]
  const answer = answers[idx]
  const isLast = idx === total - 1

  const result = useMemo(
    () => (step === "result" ? scoreQuiz(edition, answers as number[]) : null),
    [step, edition, answers]
  )

  // On every screen change: back to the top of the page, and focus the new heading so
  // screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (window.scrollY > 0) {
      if (lenis) lenis.scrollTo(0, { duration: 0.6 })
      else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step, idx, lenis, reduce])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const showToast = (message: string) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }

  const choose = (i: number) =>
    setAnswers((prev) => {
      const nextAnswers = [...prev]
      nextAnswers[idx] = i
      return nextAnswers
    })

  const goNext = () => {
    if (answer === undefined) return
    if (isLast) setStep("result")
    else setIdx(idx + 1)
  }

  // Back from question 1 returns to the start screen; answers are kept.
  // Same story again: clear the answers and go straight to question 1.
  const retake = () => {
    setAnswers([])
    setIdx(0)
    setStep("question")
  }

  const goBack = () => {
    if (idx > 0) setIdx(idx - 1)
    else setStep("start")
  }

  const copyResult = async () => {
    if (!result) return
    const text = `My dailymattr News IQ on "${edition.shareHeadline}": ${result.pct}% Awareness, ${result.band.name}. Thinking style: ${lenses[result.lens].name}. Can you beat it?`
    try {
      await navigator.clipboard.writeText(text)
      showToast("Copied. Paste it anywhere.")
    } catch {
      showToast("Couldn't copy here. Try again from your browser.")
    }
  }

  const screenKey = step === "question" ? `question-${idx}` : step

  return (
    <div className={cn("mx-auto w-full max-w-[37.5rem]", step === "question" ? "lg:max-w-[42rem]" : "lg:max-w-[66rem]")}>
      <SeriesBar date={editionDate} homeHref={QUIZ_HOME} />

      <motion.div
        key={screenKey}
        // The start screen is what a direct visit paints first, so it doesn't fade in.
        initial={reduce || step === "start" ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.2, 0.7, 0.2, 1] }}
        className="mt-6 sm:mt-8"
      >
        {step === "start" && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <StoryImage edition={edition} />
            <div className="flex flex-col gap-6 lg:pt-2">
              <div className="flex flex-col gap-3">
                <Eyebrow>
                  {edition.category} · {edition.date}
                </Eyebrow>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-3xl leading-9 font-extrabold tracking-[-0.025em] text-balance text-ink outline-none sm:text-4xl sm:leading-[2.75rem]"
                >
                  {edition.headline}
                </h1>
                <p className="text-base leading-6 text-ink-muted lg:text-lg lg:leading-7">
                  Three questions on this story. Find out how well you know it, and pick up the facts you missed.
                </p>
              </div>
              <ol className="grid gap-3">
                {STEPS.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-md leading-[1.375rem] text-ink lg:text-base lg:leading-6">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-blue-deep text-[0.8125rem] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-[0.1875rem]">
                      {s}
                      {i === 0 && (
                        <>
                          {" "}
                          <TextLink onClick={() => setBriefOpen(true)} className="inline">
                            Read the brief
                          </TextLink>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              <ActionBar className="mt-2">
                <PrimaryButton
                  onClick={() => {
                    setIdx(0)
                    setStep("question")
                  }}
                >
                  Start · takes 2 minutes
                </PrimaryButton>
              </ActionBar>
            </div>
          </div>
        )}

        {step === "question" && (
          <>
            <div className="flex flex-col gap-6">
              <Progress current={idx + 1} total={total} label={question.lensLabel} onReread={() => setBriefOpen(true)} />
              <h1
                id="quiz-question"
                ref={headingRef}
                tabIndex={-1}
                className="text-xl leading-7 font-bold tracking-[-0.015em] text-pretty text-ink outline-none sm:text-2xl sm:leading-8"
              >
                {question.text}
              </h1>
              <div className="grid gap-3">
                <OptionGroup
                  question={question}
                  value={answer}
                  onChange={choose}
                  onSubmit={goNext}
                  labelledBy="quiz-question"
                />
                {answer === undefined && (
                  <p className="text-sm leading-5 font-medium text-ink-muted">Pick an answer to continue.</p>
                )}
              </div>
            </div>
            <ActionBar>
              <BackButton onClick={goBack} aria-label={idx === 0 ? "Back to the story" : "Previous question"} />
              <PrimaryButton onClick={goNext} disabled={answer === undefined}>
                {isLast ? "See my score" : "Next"}
              </PrimaryButton>
            </ActionBar>
          </>
        )}

        {step === "result" && result && (
          <>
            {/* Desktop: score and thinking style side by side, the answers and takeaway full
                width below. Phones and tablets stack everything. */}
            <div className="grid gap-4 lg:gap-6">
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                <ScoreCard
                  pct={result.pct}
                  band={result.band.name}
                  bandDesc={result.band.desc}
                  tag={edition.category}
                  headingRef={headingRef}
                  onCopy={copyResult}
                />
                <StyleCard lens={result.lens} tally={result.tally} total={total} />
              </div>
              <section className={cn(CARD, "lg:gap-5 lg:p-7")}>
                <Eyebrow>Your answers</Eyebrow>
                <div className="grid gap-4 lg:gap-6">
                  {edition.questions.map((q, i) => (
                    <ReviewItem key={q.text} n={i + 1} question={q} pick={result.picks[i]} />
                  ))}
                </div>
              </section>
              <TakeawayCard edition={edition} />
            </div>
            <ActionBar className="lg:mx-auto lg:max-w-[42rem]">
              <SecondaryButton onClick={retake} className="w-auto shrink-0 gap-2">
                <RotateCcw aria-hidden className="size-4" strokeWidth={2.2} />
                Retake
              </SecondaryButton>
              <PrimaryLink href={QUIZ_HOME}>Another story</PrimaryLink>
            </ActionBar>
          </>
        )}
      </motion.div>

      <Sheet open={briefOpen} onOpenChange={setBriefOpen}>
        <SheetContent
          side="bottom"
          initialFocus={briefHeadingRef}
          className="mx-auto max-h-[85svh] max-w-[42rem] gap-0 rounded-t-[1.5rem] bg-paper p-0"
        >
          <div data-lenis-prevent className="overflow-y-auto overscroll-contain px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <SheetTitle className="sr-only">The story brief</SheetTitle>
            <SheetDescription className="sr-only">The story the questions are about. Your answers are kept.</SheetDescription>
            <StoryBody
              edition={edition}
              heading={
                <p ref={briefHeadingRef} tabIndex={-1} className={cn(TITLE, "pr-8")}>
                  {edition.headline}
                </p>
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 sm:bottom-28 lg:bottom-8"
      >
        <span
          className={cn(
            "rounded-[0.75rem] bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-[opacity,translate] duration-200",
            toast ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
          )}
        >
          {toast}
        </span>
      </div>
    </div>
  )
}
