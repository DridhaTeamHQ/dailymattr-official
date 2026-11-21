import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"
import { formats } from "./content"
import { FitRow } from "./fit-row"

/*
 * "Product formats" on the About page. Figma 9112:6236: four 440×560 cards in a row (Figma also
 * draws a fifth, Explore, which was dropped). Each card is a fixed Figma canvas
 * (title on top, a product preview pinned below it), written in rem so laptops scale it.
 */

const A = "/about/formats"

function Card({
  href,
  label,
  className,
  children,
}: {
  href?: string
  label: string
  className?: string
  children: React.ReactNode
}) {
  const classes = cn(
    "relative flex h-[35rem] w-[27.5rem] shrink-0 snap-start flex-col items-center overflow-hidden rounded-3xl bg-[#f4f5f7] px-8 pt-12",
    href && "transition-transform hover:-translate-y-1",
    className,
  )
  return href ? (
    <Link href={href} aria-label={label} className={classes}>
      {children}
    </Link>
  ) : (
    <div aria-label={label} className={classes}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="relative flex w-full justify-center gap-2 text-center text-[2.5rem] leading-11 font-semibold tracking-[-0.075rem] whitespace-nowrap text-[#1c1c1e]">
      {children}
    </h3>
  )
}

/** Grey lead-in, dark payoff ("Two minutes. The whole story."). */
function CardLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="h-[4.25rem] w-[23.5rem] pt-3 text-center text-2xl leading-7 tracking-[-0.0125rem] whitespace-nowrap text-[#ababab]">
      {children}
    </p>
  )
}

const dark = "font-medium text-[#1c1c1e]"

/** Ask NIA: the NIA chat sheet, cut off by the card. Figma 9112:6254. */
function NiaCard() {
  const chips = [
    ["Tell me more about this", "Explain like I'm 5"],
    ["Give me the 5 W's", "Show me opposite sides"],
  ]
  return (
    <Card href="/nia" label="Ask NIA">
      <CardTitle>
        <span>Ask</span>
        <span className="bg-[linear-gradient(246.64deg,#af75ff_3.11%,#4d90fd_93.93%)] bg-clip-text text-transparent">
          NIA
        </span>
        <span className="w-6" />
        <Image
          src={`${A}/nia-sparkle.svg`}
          alt=""
          width={15}
          height={15}
          className="absolute -top-[0.4375rem] left-[14.875rem] size-[0.9375rem]"
        />
      </CardTitle>
      <CardLine>
        Your personal <span className={dark}>news and</span>
        <br />
        <span className={dark}>infotainment assistant.</span>
      </CardLine>

      <div
        aria-hidden
        className="absolute top-[12.5rem] left-[1.5625rem] flex h-[60rem] w-[24.375rem] flex-col items-center gap-8 rounded-t-2xl bg-[#15151a] p-4 text-[0.9375rem] leading-[1.26]"
      >
        <div className="flex w-full flex-col items-center gap-4">
          <span className="h-1 w-16 rounded-2xl bg-[#d9d9d9] opacity-10" />
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="relative size-6 shrink-0">
                  {/* The avatar art carries a glow that overhangs its 24px slot. */}
                  <Image
                    src={`${A}/nia-avatar.svg`}
                    alt=""
                    width={52}
                    height={52}
                    className="absolute top-[-47.5%] left-[-57.5%] block size-[3.225rem] max-w-none"
                  />
                </span>
                <span className="text-lg font-semibold text-white">Nia - Your AI Assistant</span>
              </div>
              <div className="flex w-full flex-col gap-2">
                <p className="flex gap-2 px-1 py-2">
                  <span className="text-[#a1a1aa]">Source:</span>
                  <span className="truncate text-white underline">
                    https://www.thehindu.com/news/national...
                  </span>
                </p>
                <div className="flex flex-col gap-2.5">
                  {chips.map((row) => (
                    <div key={row[0]} className="flex gap-2">
                      {row.map((c) => (
                        <span
                          key={c}
                          className="rounded-[2.625rem] border border-[rgba(57,121,255,0.1)] bg-[rgba(57,121,255,0.05)] px-3 py-2 font-medium whitespace-nowrap text-[#3979ff]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="w-full text-center text-xs leading-normal text-[#a1a1aa]">
              dailymattr uses AI, check for mistakes, <span className="underline">Terms</span> |{" "}
              <span className="underline">Privacy</span>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[2.1875rem]">
          <div className="relative w-full pt-[3.625rem]">
            <span className="absolute top-0 left-[50.93%] flex w-[44.41%] justify-center rounded-[3.125rem] bg-[#1e1e24] px-4 py-2 leading-normal whitespace-nowrap text-[#c7c7ce]">
              Explain like I&apos;m 5
            </span>
            <div className="flex flex-col gap-3 text-[#e4e4e7]">
              <p>Right now, this is still an unverified claim, so here’s what we can expect next:</p>
              <ul className="list-disc space-y-2 ps-[1.40625rem]">
                <li>Official confirmations or denials from Iran, the U.S., or international agencies</li>
                <li>Media verification from reliable global news sources</li>
                <li>Diplomatic reactions from other countries</li>
                <li>Possible updates or clarifications from Trump or officials</li>
              </ul>
            </div>
          </div>
          <div className="flex w-full items-center justify-between rounded-[3.75rem] border border-[#2a2a32] py-2 pr-3 pl-4">
            <span className="text-[#c7c7ce] opacity-60">Ask about this article...</span>
            <Image src={`${A}/nia-send.svg`} alt="" width={40} height={40} className="size-10" />
          </div>
        </div>

        <span className="absolute top-[0.78125rem] left-[21.59375rem] grid size-8 place-items-center rounded-[1.846rem] border-[0.035rem] border-[#1e1e24] backdrop-blur-[6px]">
          <Image src={`${A}/nia-close.svg`} alt="" width={19} height={19} className="size-[1.2rem]" />
        </span>
      </div>
    </Card>
  )
}

/** Read: Pix phones photo. Figma 9112:6288. */
function ReadCard() {
  return (
    <Card href="/formats/pix" label="Read">
      <CardTitle>Read</CardTitle>
      <CardLine>
        Understand the world
        <br />
        <span className={dark}>within seconds.</span>
      </CardLine>
      <Image
        src={`${A}/read-pix.png`}
        alt=""
        width={740}
        height={683}
        sizes="28rem"
        className="absolute top-[13.1875rem] -left-[0.1875rem] h-[25.5625rem] w-[27.6875rem] max-w-none object-cover"
      />
    </Card>
  )
}

/** Watch: dark video tile with a scrubber. Figma 9112:6312. */
function WatchCard() {
  return (
    <Card label="Watch">
      <CardTitle>Watch</CardTitle>
      <CardLine>
        Two minutes. <span className={dark}>The whole story.</span>
      </CardLine>
      <div
        aria-hidden
        className="absolute top-48 left-8 h-[21rem] w-[23.5rem] overflow-hidden rounded-[1.25rem] bg-[#2a2b30]"
      >
        <div className="absolute inset-0 bg-[#3a3b41]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(14,14,16,0)] from-40% to-[rgba(14,14,16,0.88)]" />
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Image
            src={`${A}/watch-thumb.jpg`}
            alt=""
            width={1080}
            height={1700}
            sizes="24rem"
            className="absolute top-[-42.09%] left-0 h-[176.15%] w-full max-w-none"
          />
        </div>
        <span className="absolute top-[6.5rem] left-[9.75rem] grid size-16 place-items-center rounded-full bg-white/20 backdrop-blur-[8px]">
          <Image src={`${A}/watch-play.svg`} alt="" width={24} height={24} className="size-6" />
        </span>
        <div className="absolute top-[14.5rem] left-6 flex w-[20.5rem] flex-col">
          <p className="text-base leading-6 font-semibold tracking-[-0.0125rem] text-white">
            Cricket — The Game Built on a Bet
          </p>
          <p className="pt-1 text-sm leading-5 text-white/64">Episode 4 · The Origin of Sports</p>
          <Scrubber elapsed="0:42" total="1:54" played="38%" tone="light" />
        </div>
      </div>
    </Card>
  )
}

/** Progress row: time, bar with a knob at the play head, time. */
function Scrubber({
  elapsed,
  total,
  played,
  tone,
}: {
  elapsed: string
  total: string
  played: string
  tone: "light" | "dark"
}) {
  const light = tone === "light"
  return (
    <div className="flex h-8 w-full items-center gap-3 pt-4 text-xs leading-4 font-medium">
      <span className={light ? "text-white" : "text-[#1c1c1e]"}>{elapsed}</span>
      <span className={cn("relative h-1 flex-1 rounded-[2px]", light ? "bg-white/28" : "bg-[#e3e5ea]")}>
        <span
          className={cn("absolute inset-y-0 left-0 rounded-[2px]", light ? "bg-white" : "bg-[#3979ff]")}
          style={{ width: played }}
        >
          <span
            className={cn("absolute -top-1 -right-1.5 size-3 rounded-full", light ? "bg-white" : "bg-[#3979ff]")}
          />
        </span>
      </span>
      <span className={light ? "text-white" : "text-[#1c1c1e]"}>{total}</span>
    </div>
  )
}

/** Listen: white Trax player. Figma 9112:6342. */
function ListenCard() {
  return (
    <Card href="/formats/trax" label="Listen">
      <CardTitle>Listen</CardTitle>
      <CardLine>
        The world, <span className={dark}>in your ears.</span>
      </CardLine>
      <div
        aria-hidden
        className="absolute top-48 left-8 flex h-[21rem] w-[23.5rem] flex-col justify-center rounded-[1.25rem] bg-white p-6 drop-shadow-[0px_4px_6px_rgba(16,24,40,0.04)]"
      >
        <div className="flex items-center gap-8">
          <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={`${A}/listen-cover.jpg`}
              alt=""
              width={1080}
              height={1920}
              sizes="8rem"
              className="absolute top-[-10.49%] left-0 h-[142.22%] w-full max-w-none"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-[2rem] leading-8 font-semibold tracking-[-0.025rem] text-[#1c1c1e]">Nilkamal</p>
            <p className="pt-1 text-xl leading-6 text-[#696969]">Episode 12</p>
          </div>
        </div>
        <Scrubber elapsed="1:25" total="3:15" played="44%" tone="dark" />
        <div className="flex h-20 w-[20.5rem] items-center justify-center gap-10 pt-6">
          <Image src={`${A}/skip-back.svg`} alt="" width={25} height={24} className="h-6 w-[1.5368rem]" />
          <Image src={`${A}/play.svg`} alt="" width={68} height={68} className="size-[4.25rem]" />
          <Image src={`${A}/skip-forward.svg`} alt="" width={25} height={24} className="h-6 w-[1.5368rem]" />
        </div>
      </div>
    </Card>
  )
}

export function AboutFormats() {
  return (
    <section className="bg-white py-24 lg:py-[10rem]">
      <div className="flex justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <FadeIn
            as="h2"
            className="text-3xl leading-none font-semibold tracking-[-0.0938rem] text-[#1c1c1e] sm:text-5xl sm:leading-12"
          >
            {formats.title}
          </FadeIn>
          <FadeIn as="p" delay={0.2} className="text-lg leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-xl">
            {formats.subtitle}
          </FadeIn>
        </div>
      </div>

      {/* Desktop: zoomed so the four cards exactly fill the width. Phones see the cards at 3/4 size so most of one fits on screen. */}
      <FadeIn delay={0.4} className="mt-12 lg:mt-16">
        <FitRow
          fit={4}
          cardRem={27.5}
          gapRem={1.5}
          className="snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:scroll-px-12 lg:px-12 [&::-webkit-scrollbar]:hidden"
          trackClassName="flex w-max gap-6 max-sm:[zoom:0.75]"
        >
          <NiaCard />
          <ReadCard />
          <WatchCard />
          <ListenCard />
        </FitRow>
      </FadeIn>
    </section>
  )
}
