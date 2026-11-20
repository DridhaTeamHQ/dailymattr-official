import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/shared/section-heading"
import { BentoReveal, RevealTile } from "./reveal"
import formatListen from "@/public/home/bento/format-listen.svg"
import formatRead from "@/public/home/bento/format-read.svg"
import formatUnderstand from "@/public/home/bento/format-understand.svg"
import formatWatch from "@/public/home/bento/format-watch.svg"
import heroGlow from "@/public/home/bento/hero-glow.svg"
import heroPhone from "@/public/home/bento/hero-phone.png"
import iconBookmark from "@/public/home/bento/icon-bookmark.svg"
import iconFlame from "@/public/home/bento/icon-flame.svg"
import listenCover from "@/public/home/bento/listen-cover.jpg"
import listenHaze from "@/public/home/bento/listen-haze.svg"
import listenPlay from "@/public/home/bento/listen-play.svg"
import listenSkipBack from "@/public/home/bento/listen-skip-back.svg"
import listenSkipForward from "@/public/home/bento/listen-skip-forward.svg"
import niaArrowUp from "@/public/home/bento/nia-arrow-up.svg"
import niaClose from "@/public/home/bento/nia-close.svg"
import niaIcon from "@/public/home/bento/nia-icon.svg"
import niaSparkle from "@/public/home/bento/nia-sparkle.svg"
import voteCheck from "@/public/home/bento/vote-check.svg"
import voteCircle from "@/public/home/bento/vote-circle.svg"
import votePoll from "@/public/home/bento/vote-poll.svg"
import voteResultsRing from "@/public/home/bento/vote-results-ring.svg"
import voteResults from "@/public/home/bento/vote-results.svg"
import watchCricket from "@/public/home/bento/watch-cricket.png"
import watchPlay from "@/public/home/bento/watch-play.svg"
import xplaindCardCenter from "@/public/home/bento/xplaind-card-center.png"
import xplaindCardLeft from "@/public/home/bento/xplaind-card-left.jpg"
import xplaindCardRight from "@/public/home/bento/xplaind-card-right.jpg"
import xplaindHaze from "@/public/home/bento/xplaind-haze.svg"

// Figma 9157:429: black panel (radius 16), heading, then the 1837.5 × 1033.6 "Bento" frame
// (9212:9241) of 14 tiles, 15.3 apart. Its tiles sit 19.14 inside the frame, so the tile
// area is 1799.22 × 995.31, laid out as nested grids whose tracks are the Figma sizes:
//
//   Ask NIA     | A place to stop · Light/Dark · Make it yours | Listen
//   Add vote    | 100 (hero)                                   | Xplaind
//   Watch       |                                              | Save · Habit
//               | 4 ways in · 1 app · Less scrolling                     |
//
// On phones (below md) the grid wrappers turn into `display: contents`, so every tile drops
// into one two-column grid (wide tiles span both) and keeps its Figma aspect ratio.
//
// Inside each tile, Tailwind's spacing step is one Figma px of that tile (see Tile), so
// `left-30.5` is Figma x = 30.5 and the drawing scales with the tile at any width.
//
// From md, scrolling plays the reveal in reveal.tsx: the bento pins, the "100" tile starts
// full screen and zooms out into its slot, and the others slide in. Each tile's `at` is its
// Figma position and `revealAt` its turn, in the mixed order of the reference video.

/** Bento gap, 15.31 of the 1799.22 tile area, as cqw of the bento container. */
const gap = "md:gap-[0.851cqw]"
/** A nested grid from md, invisible (its children join the parent grid) on phones. */
const group = cn("contents min-h-0 min-w-0 md:grid", gap)

// Type, in Figma px of the tile.
const fs = {
  7: "text-[calc(var(--spacing)*7.248)]",
  8: "text-[calc(var(--spacing)*8.339)]",
  10: "text-[calc(var(--spacing)*10.424)]",
  11: "text-[calc(var(--spacing)*11.484)]",
  12: "text-[calc(var(--spacing)*12.441)]",
  12.5: "text-[calc(var(--spacing)*12.509)]",
  13: "text-[calc(var(--spacing)*13.398)]",
  15: "text-[calc(var(--spacing)*15.313)]",
  20: "text-[calc(var(--spacing)*20.098)]",
  21: "text-[calc(var(--spacing)*21.055)]",
  22: "text-[calc(var(--spacing)*22)]",
  24: "text-[calc(var(--spacing)*24)]",
  30: "text-[calc(var(--spacing)*30.625)]",
  32: "text-[calc(var(--spacing)*32)]",
  32.5: "text-[calc(var(--spacing)*32.539)]",
  38: "text-[calc(var(--spacing)*38.281)]",
  42: "text-[calc(var(--spacing)*42.109)]",
  69: "text-[calc(var(--spacing)*68.906)]",
  190: "text-[calc(var(--spacing)*190)]",
}

/** Tile headline: Inter Tight Semibold 38.28 / 42.11. */
const title38 = cn(fs[38], "leading-42 font-semibold text-white")
/** Grey-and-white subline under a headline, 22 / 26.8. */
const subline22 = cn(fs[22], "leading-26.75 text-[#ababab]")
/** Medium 21 caption in #f5f5f7, centred on the tile (Figma: 390.5 wide, 23 in). */
const caption21 = cn(fs[21], "absolute left-23 w-390.5 text-center font-medium text-[#f5f5f7]")
/** Grey-to-silver headline gradient, clipped to the text. */
const silverText = "bg-linear-to-b from-[#d2d2d7] to-[#8e8e93] bg-clip-text text-transparent"

/**
 * One bento tile, drawn in its own Figma pixels. The outer box is a size container and resets
 * Tailwind's spacing step to `width / w`, so every spacing utility inside (left-*, w-*, gap-*,
 * leading-*) is in Figma px of this tile. From md the grid sizes the tile; on phones it keeps
 * the Figma aspect ratio. The inner box carries the look, since lengths on the container itself
 * would resolve against the bento instead.
 */
function Tile({
  w,
  h,
  at,
  revealAt,
  wide,
  className,
  style,
  children,
}: {
  /** Figma width and height of the tile. */
  w: number
  h: number
  /** Figma position in the bento's tile area, and when the scroll reveal brings it in (0–1);
   *  leave both out for the hero, which the reveal zooms instead. See reveal.tsx. */
  at?: [number, number]
  revealAt?: number
  /** Spans both columns on phones. */
  wide?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const outer = cn("@container min-h-0 min-w-0 aspect-(--tile-ratio) md:aspect-auto", wide && "max-md:col-span-2")
  const vars = { "--tile-ratio": `${w} / ${h}`, "--spacing": `calc(100cqw / ${w})` } as React.CSSProperties
  const inner = (
    <div
      className={cn("relative size-full overflow-hidden rounded-[calc(var(--spacing)*26.797)] bg-[#0e0e0f]", className)}
      style={style}
    >
      {children}
    </div>
  )

  if (!at || revealAt === undefined) {
    return (
      <div className={outer} style={vars}>
        {inner}
      </div>
    )
  }
  return (
    <RevealTile at={at} w={w} h={h} revealAt={revealAt} className={outer} style={vars}>
      {inner}
    </RevealTile>
  )
}

/** A Figma image fill: `frame` places the image box in the tile, `crop` the photo in that box. */
function Photo({
  src,
  frame,
  crop = "inset-0",
  sizes,
}: {
  src: StaticImageData
  frame: string
  crop?: string
  sizes: string
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute overflow-hidden", frame)}>
      <div className={cn("absolute", crop)}>
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  )
}

/** An SVG at its Figma slot; the class sets the slot, the file keeps its own width / height. */
function Icon({ src, className }: { src: StaticImageData; className: string }) {
  return <Image src={src} alt="" aria-hidden className={cn("absolute max-w-none", className)} />
}

/** NIA suggestion chip. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        fs[10],
        "rounded-full border-[length:calc(var(--spacing)*0.695)] border-[#3979ff]/10 bg-[#3979ff]/5 px-8.25 py-5.5 leading-[1.26] font-medium whitespace-nowrap text-[#3979ff]"
      )}
    >
      {children}
    </span>
  )
}

/** "Ask NIA" (9212:9242): headline, subline and the NIA chat sheet rising from the bottom. */
function AskNiaTile() {
  return (
    <Tile w={436.406} h={405.781} at={[0, 0]} revealAt={0.52} wide>
      {/* Violet and blue shades rising behind the sheet */}
      <div aria-hidden className="absolute top-112 left-0 h-299.5 w-209.5 bg-linear-to-b from-transparent to-[#af75ff]/20" />
      <div aria-hidden className="absolute top-112 left-220 h-299.5 w-216.25 bg-linear-to-b from-transparent to-[#3979ff]/20" />

      <h3 className="absolute top-46 left-30.5 flex w-360 justify-center gap-7.75 whitespace-nowrap">
        <span className={title38}>Ask</span>
        <span className={cn(title38, "relative bg-[linear-gradient(246.16deg,#af75ff_3.11%,#4d90fd_93.93%)] bg-clip-text text-transparent")}>
          NIA
          <Icon src={niaSparkle} className="-top-6.75 -right-9.25 size-14.25" />
        </span>
        {/* Figma's empty icon slot, which keeps the words where the design centres them */}
        <span aria-hidden className="w-23" />
      </h3>
      <p className={cn(fs[22], "absolute top-99.5 left-30.5 w-360 text-center leading-26.75 font-medium text-white")}>
        <span className="text-[#888]">Your personal</span> news and
        <br />
        infotainment assistant.
      </p>

      {/* NIA chat sheet (9212:9253), cut off by the tile */}
      <div
        aria-hidden
        className="absolute top-203 left-82.25 flex h-667 w-271 flex-col items-center gap-22.25 rounded-t-[calc(var(--spacing)*11.12)] bg-[#15151a] p-11"
      >
        <div className="flex w-full flex-col items-center gap-11">
          <div className="h-2.75 w-44.5 rounded-full bg-[#d9d9d9] opacity-10" />
          <div className="flex w-full flex-col items-center gap-16.75">
            <div className="flex w-full flex-col items-start gap-16.75">
              <div className="flex items-center gap-8.25">
                <span className="relative size-16.75 shrink-0">
                  <Icon src={niaIcon} className="-top-8 -left-9.5 size-35.75" />
                </span>
                <p className={cn(fs[12.5], "font-semibold whitespace-nowrap text-white")}>Nia - Your AI Assistant</p>
              </div>
              <div className="flex w-full flex-col gap-5.5">
                <p className={cn(fs[10], "flex w-full gap-5.5 px-2.75 py-5.5 leading-[1.26] whitespace-nowrap")}>
                  <span className="text-[#a1a1aa]">Source:</span>
                  <span className="text-white underline">https://www.thehindu.com/news/national...</span>
                </p>
                <div className="flex w-full flex-col gap-7">
                  <div className="flex w-full gap-5.5">
                    <Chip>Tell me more about this</Chip>
                    <Chip>Explain like I&apos;m 5</Chip>
                  </div>
                  <div className="flex w-full gap-5.5">
                    <Chip>Give me the 5 W&apos;s</Chip>
                    <Chip>Show me opposite sides</Chip>
                  </div>
                </div>
              </div>
            </div>
            <p className={cn(fs[8], "w-full text-center text-[#a1a1aa]")}>
              dailymattr uses AI, check for mistakes, <span className="underline">Terms</span> |{" "}
              <span className="underline">Privacy</span>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-24.25">
          <div className="grid w-full place-items-start">
            <div className={cn(fs[10], "col-start-1 row-start-1 mt-40.25 flex w-full flex-col gap-8.25 leading-[1.26] text-[#e4e4e7]")}>
              <p>Right now, this is still an unverified claim, so here’s what we can expect next:</p>
              <ul className="list-disc">
                <li className="ms-15.75 mb-5.5">Official confirmations or denials from Iran, the U.S., or international agencies</li>
                <li className="ms-15.75 mb-5.5">Media verification from reliable global news sources</li>
                <li className="ms-15.75 mb-5.5">Diplomatic reactions from other countries</li>
                <li className="ms-15.75">Possible updates or clarifications from Trump or officials</li>
              </ul>
            </div>
            <p
              className={cn(
                fs[10],
                "col-start-1 row-start-1 ml-[50.93%] w-[44.41%] rounded-full bg-[#1e1e24] px-11 py-5.5 text-center whitespace-nowrap text-[#c7c7ce]"
              )}
            >
              Explain like I&apos;m 5
            </p>
          </div>
          <div className="flex w-full items-center justify-between rounded-full border-[length:calc(var(--spacing)*0.695)] border-[#2a2a32] py-5.5 pr-8.25 pl-11">
            <p className={cn(fs[10], "leading-[1.26] whitespace-nowrap text-[#c7c7ce] opacity-60")}>Ask about this article...</p>
            <span className="relative size-27.75 shrink-0">
              <Icon src={niaArrowUp} className="inset-0 size-27.75" />
            </span>
          </div>
        </div>

        <div className="absolute top-8.75 left-240 flex size-22.25 items-center justify-center rounded-full border-[length:calc(var(--spacing)*0.391)] border-[#1e1e24] backdrop-blur-[calc(var(--spacing)*4.276)]">
          <span className="relative size-13.25">
            <Icon src={niaClose} className="inset-0 size-13.25" />
          </span>
        </div>
      </div>
    </Tile>
  )
}

/** "Add your vote" (9212:9298): a mini poll — vote button, result bars, results button. */
function VoteTile() {
  return (
    <Tile w={436.406} h={153.125} at={[0, 421.09]} revealAt={0.44} wide className="bg-transparent bg-linear-to-r from-[#2b1f5c] to-[#1a2f6b]">
      <div aria-hidden className="absolute top-26.75 left-42 h-61.25 w-352.25">
        <Icon src={voteCircle} className="top-0 left-0 size-61.25" />
        <Icon src={voteCheck} className="top-16.25 left-16.25 size-28.75" />
        <div className="absolute top-0 left-76.5 h-61.25 w-199 overflow-hidden rounded-full bg-[#050b2b]">
          <div className="absolute top-17.25 left-26.75 h-9.5 w-122.5 rounded-full bg-[#3979ff]" />
          <div className="absolute top-34.5 left-26.75 h-9.5 w-72.75 rounded-full bg-[#3979ff]/50" />
        </div>
        <Icon src={voteResults} className="top-0 left-291 size-61.25" />
        <Icon src={voteResultsRing} className="top-11.5 left-302.5 size-38.25" />
        <Icon src={votePoll} className="top-21 left-312 size-19.25" />
      </div>
      <p className={cn(caption21, "top-103.25 leading-26.75")}>Add your vote</p>
    </Tile>
  )
}

/** "Watch" (9212:9313): faded episode still, play button and a player bar. */
function WatchTile() {
  return (
    <Tile w={436.406} h={405.781} at={[0, 589.53]} revealAt={0.74} wide className="bg-[#0f0f10]">
      <Photo
        src={watchCricket}
        frame="-left-0.5 top-0 h-406 w-437 opacity-10"
        crop="inset-x-0 top-[-8.65%] h-[191.35%]"
        sizes="(min-width: 768px) 24vw, (min-width: 640px) 32rem, 100vw"
      />

      <h3 className={cn(title38, "absolute top-28.75 left-30.5 w-360 text-center tracking-[-0.03em]")}>Watch</h3>
      <p className={cn(subline22, "absolute top-82.25 left-30.5 w-360 text-center")}>
        Two minutes. <span className="font-medium text-white">The whole story.</span>
      </p>

      <div
        aria-hidden
        className="absolute top-172.25 left-187.5 flex size-61.25 items-center justify-center rounded-full bg-white/20 backdrop-blur-[calc(var(--spacing)*7.656)]"
      >
        <span className="relative size-23">
          <Icon src={watchPlay} className="inset-0 size-23" />
        </span>
      </div>

      <div className="absolute top-292.75 left-40.25 flex w-366.5 flex-col">
        <p className={cn(fs[15], "leading-23 font-semibold whitespace-nowrap text-white")}>Cricket — The Game Built on a Bet</p>
        <p className={cn(fs[13], "pt-3.75 leading-19.25 whitespace-nowrap text-white/64")}>Episode 4 · The Origin of Sports</p>
        <div aria-hidden className={cn(fs[11], "flex h-30.5 items-center gap-11.5 pt-15.25 leading-15.25 font-medium text-white")}>
          <span>0:42</span>
          <span className="relative h-3.75 flex-1 rounded-full bg-white/28">
            <span className="absolute top-0 left-0 h-3.75 w-93.75 rounded-full bg-white" />
            <span className="absolute -top-3.75 left-88 size-11.5 rounded-full bg-white" />
          </span>
          <span>1:54</span>
        </div>
      </div>
    </Tile>
  )
}

/** "A place to stop" (9212:9338): silver two-line headline, centred. */
function PlaceToStopTile() {
  return (
    <Tile w={256.484} h={237.344} at={[451.72, 0]} revealAt={0.29} className="flex items-center justify-center">
      <p className={cn(fs[42], silverText, "w-210.5 text-center leading-46 font-semibold")}>
        A place
        <br />
        to stop
      </p>
    </Tile>
  )
}

/** "Light / Dark" (9212:9344): a light-to-dark wash with a light and a dark phone. */
function LightDarkTile() {
  return (
    <Tile
      w={352.188}
      h={237.344}
      at={[723.51, 0]}
      revealAt={0.26}
      wide
      className="bg-[linear-gradient(88.88deg,#f5f5f7_0.9%,rgba(245,245,247,0.5)_29.79%,rgba(245,245,247,0.13)_44.4%,rgba(245,245,247,0)_58.09%),linear-gradient(#0e0e0f,#0e0e0f)]"
    >
      <p className={cn(fs[42], "absolute top-88.75 left-24.75 leading-49.75 font-semibold text-[#1c1c1e]")}>Light</p>
      <p className={cn(fs[42], "absolute top-88.75 left-240.5 leading-49.75 font-semibold text-white")}>Dark</p>
      <div
        aria-hidden
        className="absolute top-57.75 left-135 h-131.25 w-63 rounded-[calc(var(--spacing)*12.241)] bg-linear-to-b from-[#f5f5f7] to-[#c7c7cc]"
      />
      <div
        aria-hidden
        className="absolute top-68 left-161.25 h-131.25 w-63 rounded-[calc(var(--spacing)*12.241)] border-[length:calc(var(--spacing)*1.749)] border-[#4a4a52] bg-linear-to-b from-[#2c2c30] to-[#111114]"
      />
    </Tile>
  )
}

/** "Make it yours" (9212:9340). */
function MakeItYoursTile() {
  return (
    <Tile w={256.484} h={237.344} at={[1091.01, 0]} revealAt={0.4} className="bg-linear-to-b from-[#19191c] to-[#111112]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-118.75 bg-linear-to-b from-[#0e0e0f] to-transparent" />
      <div className="absolute top-51.75 left-30 flex w-196 flex-col items-start gap-24 font-medium">
        <p className={cn(fs[32], "w-full text-center leading-29 text-[#f5f5f7]")}>Make it yours.</p>
        <p className={cn(fs[24], "leading-26.75 whitespace-nowrap text-white")}>
          <span className="text-white/50">Your</span> interests.
          <br />
          <span className="text-white/50">Your</span> feed.
          <br />
          <span className="text-white/50">Your</span> pace.
        </p>
      </div>
    </Tile>
  )
}

/** "100" hero (9212:9350): the big number, a blue glow and the phone in hand. */
function HundredTile() {
  return (
    <Tile w={895.781} h={490} wide>
      <Icon src={heroGlow} className="-top-68.25 left-11.75 h-918.75 w-1493" />
      <div className="absolute top-118.75 left-46 flex w-479.5 flex-col gap-30.5">
        <p className={cn(fs[190], "leading-190 font-bold tracking-[-0.06em] text-white")}>100</p>
        <p className={cn(fs[30], "px-34.5 leading-30.5 font-medium text-[#86868b]")}>
          Stories. <span className="text-white">One daily destination.</span>
        </p>
      </div>
      <Photo src={heroPhone} frame="-top-114 left-492 h-665.25 w-374.25" sizes="(min-width: 768px) 21vw, 42vw" />
    </Tile>
  )
}

/** "Listen" (9212:9392): a podcast player card. */
function ListenTile() {
  return (
    <Tile w={436.406} h={237.344} at={[1362.81, 0]} revealAt={0.82} wide>
      <Icon src={listenHaze} className="top-47.75 -left-126.25 h-363.75 w-689" />
      <h3 className={cn(title38, "absolute top-19.25 left-30.5 w-360 text-center tracking-[-0.03em]")}>Listen</h3>
      <p className={cn(subline22, "absolute top-69 left-30.5 w-360 text-center")}>
        The world, <span className="font-medium text-white">in your ears.</span>
      </p>

      <Photo
        src={listenCover}
        frame="top-121.5 left-20 h-100.5 w-80.5 rounded-[calc(var(--spacing)*10.049)]"
        crop="inset-x-0 top-[-10.49%] h-[142.22%]"
        sizes="(min-width: 768px) 5vw, 20vw"
      />
      <div aria-hidden className="absolute top-118.75 left-153 flex w-242 flex-col items-center whitespace-nowrap text-white">
        <p className={cn(fs[20], "leading-30.5 font-medium")}>Nilkamal</p>
        <p className={cn(fs[12], "leading-12.5")}>Episode 12</p>
      </div>
      <div aria-hidden className={cn(fs[7], "absolute top-166.5 left-133 flex h-19.25 w-281.25 items-center gap-7.25 leading-9.75 font-medium text-white")}>
        <span>1:25</span>
        <span className="relative h-2.5 flex-1 rounded-full bg-[#3979ff]/30">
          <span className="absolute top-0 left-0 h-2.5 w-69.25 rounded-full bg-[#3979ff]" />
          <span className="absolute -top-2.5 left-65.75 size-7.25 rounded-full bg-[#3979ff]" />
        </span>
        <span>3:15</span>
      </div>
      <div aria-hidden className="absolute top-189.5 left-226.75 flex items-center gap-19.25">
        <span className="relative h-11.5 w-11.75">
          <Icon src={listenSkipBack} className="inset-0 h-11.5 w-11.75" />
        </span>
        <span className="relative size-32.5">
          <Icon src={listenPlay} className="inset-0 size-32.5" />
        </span>
        <span className="relative h-11.5 w-11.75">
          <Icon src={listenSkipForward} className="inset-0 h-11.5 w-11.75" />
        </span>
      </div>
    </Tile>
  )
}

/** "Xplaind · Connect the dots" (9212:9419): three explainer covers fanned out. */
function XplaindTile() {
  const cardSizes = "(min-width: 768px) 6vw, 25vw"
  return (
    <Tile w={436.406} h={237.344} at={[1362.81, 252.66]} revealAt={0.48} wide>
      <Icon src={xplaindHaze} className="top-47.75 -left-126.25 h-363.75 w-689" />
      <p className={cn(caption21, "top-32.5 leading-26.75")}>Xplaind · Understand</p>
      <p className={cn(fs[42], "absolute top-69 left-23 w-390.5 text-center leading-49.75 font-bold text-[#f5f5f7]")}>
        Connect the dots
      </p>

      {/* Right card, tilted 6.9° */}
      <div aria-hidden className="absolute top-137.5 left-224.5 flex h-149 w-109.25 items-center justify-center">
        <div className="relative h-138.5 w-95.25 shrink-0 rotate-[6.91deg] skew-x-[0.8deg]">
          <Photo
            src={xplaindCardRight}
            frame="inset-0 rounded-[calc(var(--spacing)*8)] opacity-30"
            crop="left-[-0.04%] top-[-13.78%] h-[127.04%] w-full"
            sizes={cardSizes}
          />
        </div>
      </div>
      {/* Left card, tilted −9.75° */}
      <div aria-hidden className="absolute top-134 left-102.25 flex h-153 w-114.75 items-center justify-center">
        <div className="relative h-138.25 w-95.25 shrink-0 rotate-[-9.75deg] skew-x-[-1.12deg]">
          <Photo
            src={xplaindCardLeft}
            frame="inset-0 rounded-[calc(var(--spacing)*8)] opacity-30"
            crop="left-[-0.19%] top-[-9.01%] h-[127.24%] w-full"
            sizes={cardSizes}
          />
        </div>
      </div>
      <Photo
        src={xplaindCardCenter}
        frame="top-134 left-159.75 h-139 w-95 rounded-[calc(var(--spacing)*8)]"
        crop="inset-x-0 top-[-4.7%] h-[126.29%]"
        sizes={cardSizes}
      />
    </Tile>
  )
}

/** Small icon tile with a two-line caption (9212:9423 / 9212:9427). */
function IconTile({
  at,
  revealAt,
  glow,
  icon,
  iconClassName,
  children,
}: {
  at: [number, number]
  revealAt: number
  /** Figma's radial glow behind the icon, as a background image. */
  glow: string
  icon: StaticImageData
  iconClassName: string
  children: React.ReactNode
}) {
  return (
    <Tile w={210.547} h={237.344} at={at} revealAt={revealAt} style={{ backgroundImage: `${glow}, linear-gradient(#0e0e0f, #0e0e0f)` }}>
      <Icon src={icon} className={iconClassName} />
      <p className={cn(fs[22], "absolute top-157 left-23 w-164.5 text-center leading-26.75 font-medium text-[#f5f5f7]")}>
        {children}
      </p>
    </Tile>
  )
}

// Figma's radial fills for the two icon tiles, exported as SVG backgrounds at 10% opacity.
const blueGlow = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 210.55 237.34' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.10000000149011612'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-7.6 -8.3 7.3629 -6.7419 53.297 38.821)'><stop stop-color='rgba(57,121,255,1)' offset='0'/><stop stop-color='rgba(57,121,255,0)' offset='1'/></radialGradient></defs></svg>")`
const amberGlow = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 210.55 237.34' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.10000000149011612'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(12.95 -13.5 11.976 11.488 167.94 36.821)'><stop stop-color='rgba(255,165,21,1)' offset='0'/><stop stop-color='rgba(204,132,17,0.5)' offset='0.5'/><stop stop-color='rgba(153,99,13,0)' offset='1'/></radialGradient></defs></svg>")`

/** "4 ways in" (9212:9357): the four format icons in a pill. */
function WaysInTile() {
  return (
    <Tile w={436.406} h={237.344} at={[451.72, 757.97]} revealAt={0.56} wide>
      <div
        aria-hidden
        className="absolute top-34.5 left-[calc(50%+var(--spacing)*0.4)] flex -translate-x-1/2 items-center justify-center gap-34.5 overflow-hidden rounded-full border-[length:calc(var(--spacing)*1.436)] border-[#a9a9a9]/10 bg-linear-to-b from-[#1f1f24] to-[#0d0d0d] px-30.5 py-22 shadow-[0_0_calc(var(--spacing)*38.281)_0_#1b1b1c]"
      >
        <span className="relative size-38.25 shrink-0">
          <Icon src={formatRead} className="inset-0 size-38.25" />
        </span>
        <span className="relative size-38.25 shrink-0">
          <Icon src={formatWatch} className="top-6 left-6 size-26.25" />
        </span>
        <span className="relative h-30.5 w-34.25 shrink-0">
          <Icon src={formatListen} className="top-2 left-2.5 h-26.5 w-29.25" />
        </span>
        <span className="relative size-30.5 shrink-0">
          <Icon src={formatUnderstand} className="inset-0 size-30.5" />
        </span>
      </div>
      <p className={cn(caption21, "top-144.5 leading-28.75")}>
        4 ways in
        <br />
        Read, watch, listen and Understand.
      </p>
    </Tile>
  )
}

/** "1 space" (9212:9386): a blue chip and a silver three-line headline. */
function OneSpaceTile() {
  return (
    <Tile w={528.281} h={237.344} at={[903.44, 757.97]} revealAt={0.37} wide>
      <div
        aria-hidden
        className="absolute top-44 left-49.75 size-149.25 rounded-[calc(var(--spacing)*19.141)] bg-linear-to-b from-[#3979ff]/10 to-[rgba(10,28,86,0.25)] text-center text-white"
      >
        <p className={cn(fs[69], "absolute top-21 inset-x-0 leading-69 font-bold tracking-[-0.02em]")}>1</p>
        <p className={cn(fs[21], "absolute top-93.75 inset-x-0 leading-25 font-semibold")}>space</p>
      </div>
      <p className={cn(fs[32.5], silverText, "absolute top-42 left-228.75 w-270 leading-38.25 font-semibold")}>
        Updates and
        <br />
        deeper explainers,
        <br />
        <span className="text-white">all together.</span>
      </p>
    </Tile>
  )
}

/** "Less scrolling" (9212:9431): a fading phone outline with a short page of text lines. */
function LessScrollingTile() {
  // Opacity of the five lines in each of the three paragraphs (the last line is shorter).
  const paragraphs = [
    ["bg-white/60", "bg-white/50", "bg-white/50", "bg-white/50", "bg-white/30"],
    ["bg-white/60", "bg-white/50", "bg-white/50", "bg-white/50", "bg-white/30"],
    ["bg-white/60", "bg-white/50", "bg-white/50", "bg-white/20", "bg-white/5"],
  ]
  return (
    <Tile w={352.188} h={237.344} at={[1447.03, 757.97]} revealAt={0.33} wide className="bg-linear-to-b from-[#1a1a1d] to-[#202024]">
      <div
        aria-hidden
        className="absolute top-17.75 left-135.5 h-131 w-67 rounded-[calc(var(--spacing)*12.241)] border-[length:calc(var(--spacing)*1.749)] border-[#4a4a52] bg-linear-to-b from-[#2c2c30] to-[rgba(17,17,20,0)]"
      />
      <div aria-hidden className="absolute inset-x-0 top-107.25 h-130 bg-linear-to-b from-transparent to-[#0e0e0f]" />
      <p className={cn(fs[24], "absolute top-139.75 left-23 w-306.25 text-center leading-28 font-medium text-[#f5f5f7]")}>
        Less scrolling.
        <br />
        More understanding.
      </p>
      <div aria-hidden className="absolute top-54.75 left-195.5 h-34 w-2 rounded-full bg-[#4a4a52]" />
      <div aria-hidden className="absolute top-56.75 left-143.5 flex w-46 flex-col gap-4 opacity-20">
        <div className="h-5 w-full rounded-full bg-white" />
        <div className="flex w-full flex-col gap-4">
          {paragraphs.map((lines, p) => (
            <div key={p} className="flex w-full flex-col gap-3">
              {lines.map((tone, i) => (
                <div key={i} className={cn("h-2 rounded-full", tone, i === lines.length - 1 ? "w-35" : "w-full")} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Tile>
  )
}

export function BriefingBentoSection() {
  return (
    <section className="w-full py-8 lg:py-12">
      {/* Black panel, edge to edge with square corners. Figma: 104 above the heading, 88 below
          the bento frame, and the tiles 52.9 in from each side (frame inset + tile inset). */}
      <div className="w-full bg-black px-4 pt-16 pb-12 sm:px-6 lg:px-[3.3rem] lg:pt-26 lg:pb-[6.7rem]">
        <SectionHeading
          inverted
          className="mx-auto"
          eyebrow="Less to sift through. More to take away."
          lead="A daily briefing"
          title="with a clear purpose."
        />

        <div className="mt-10 lg:mt-[4.2rem]">
          <BentoReveal className={cn("grid grid-flow-dense grid-cols-2 gap-3 md:aspect-[1799.22/995.31] md:grid-cols-[436.406fr_1347.5fr]", gap)}>
            {/* Left column */}
            <div className={cn(group, "md:grid-rows-[405.781fr_153.125fr_405.781fr]")}>
              <AskNiaTile />
              <VoteTile />
              <WatchTile />
            </div>

            {/* Everything right of it: the upper block, then the bottom row */}
            <div className={cn(group, "md:grid-rows-[742.656fr_237.344fr]")}>
              <div className={cn(group, "md:grid-cols-[895.781fr_436.406fr]")}>
                <div className={cn(group, "md:grid-rows-[237.344fr_490fr]")}>
                  <div className={cn(group, "md:grid-cols-[256.484fr_352.188fr_256.484fr]")}>
                    <PlaceToStopTile />
                    <LightDarkTile />
                    <MakeItYoursTile />
                  </div>
                  <HundredTile />
                </div>
                <div className={cn(group, "md:grid-rows-3")}>
                  <ListenTile />
                  <XplaindTile />
                  <div className={cn(group, "md:grid-cols-2")}>
                    <IconTile at={[1362.81, 505.31]} revealAt={0.61} glow={blueGlow} icon={iconBookmark} iconClassName="top-46 left-70.75 size-69">
                      Save a story
                      <br />
                      for later
                    </IconTile>
                    <IconTile at={[1588.67, 505.31]} revealAt={0.67} glow={amberGlow} icon={iconFlame} iconClassName="top-54.5 left-65 size-80.5">
                      Keep your
                      <br />
                      habit going
                    </IconTile>
                  </div>
                </div>
              </div>
              <div className={cn(group, "md:grid-cols-[436.406fr_528.281fr_352.188fr]")}>
                <WaysInTile />
                <OneSpaceTile />
                <LessScrollingTile />
              </div>
            </div>
          </BentoReveal>
        </div>
      </div>
    </section>
  )
}
