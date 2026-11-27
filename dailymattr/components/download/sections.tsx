import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, AudioLines, Newspaper, Play, Sparkles, Star, type LucideIcon } from "lucide-react"

import { appStoreLinks } from "@/components/footer/footer-links"
import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { softGlow } from "@/components/shared/soft-glow"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"
import appStoreBadge from "@/public/download_Logos/apple.png"
import playStoreBadge from "@/public/download_Logos/playstore.png"
import { band, formats, hero, qr, type DownloadFormat } from "./content"
import { QrCode } from "./qr-code"

// /download sections. Same 1200px column, type scale and glowing panel as the Newsletter and
// Support pages. Phones never see this page (proxy.ts sends them to their store), so it is laid
// out for laptops first; it still holds up narrow, for an iPad in desktop mode.

const column = "mx-auto w-full max-w-[75rem]"
const sectionPad = "px-4 sm:px-6 lg:px-8"
const h2 =
  "text-4xl leading-[1.1] font-bold tracking-[-0.09375rem] text-[#1c1c1e] lg:text-5xl lg:leading-[3.25rem]"

/** App Store and Google Play badges, opening the listings in a new tab. */
function StoreBadges({ className }: { className?: string }) {
  const badges = [
    { href: appStoreLinks.apple, src: appStoreBadge, label: "Download on the App Store" },
    { href: appStoreLinks.google, src: playStoreBadge, label: "Get it on Google Play" },
  ]
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {badges.map((b) => (
        <a
          key={b.href}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-[0.625rem] transition-[translate,opacity] hover:-translate-y-px hover:opacity-85"
        >
          <Image src={b.src} alt={b.label} className="block h-12 w-auto" priority />
        </a>
      ))}
    </div>
  )
}

/** The QR card: scan with a phone and /download sends it to the right store. */
function ScanCard() {
  return (
    <div className="flex flex-col items-center rounded-[1rem] bg-white px-6 py-8 text-center shadow-[0px_1px_1px_0px_rgba(16,24,40,0.04),0px_12px_32px_0px_rgba(16,24,40,0.06)] sm:px-10 sm:py-10">
      <div className="rounded-[1.25rem] border border-[#ececf0] p-3">
        <QrCode
          value={`${site.url}/download`}
          label={`QR code for ${site.url.replace(/^https?:\/\//, "")}/download`}
          className="block size-44 sm:size-52"
        />
      </div>
      <p className="mt-6 text-2xl leading-8 font-bold tracking-[-0.03rem] text-[#1c1c1e]">{qr.title}</p>
      <p className="mt-2 max-w-[22rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{qr.body}</p>
      <p className="mt-5 text-sm leading-5 text-[#9a9aa0]">{qr.hint}</p>
    </div>
  )
}

/** Title, copy and store badges beside the QR card in a glowing panel. */
export function DownloadHero() {
  return (
    <section className={cn(sectionPad, "bg-white pt-12 pb-16 sm:pt-16 lg:pt-[7rem] lg:pb-[7.5rem]")}>
      <div
        className={cn(
          column,
          "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,33rem)_minmax(0,34rem)] lg:justify-between lg:gap-[4.5rem]",
        )}
      >
        <div className="flex flex-col items-start gap-5 lg:gap-6">
          <FadeIn
            as="p"
            className="text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase"
          >
            {hero.eyebrow}
          </FadeIn>
          <FadeIn
            as="h1"
            className="text-[2.5rem] leading-[1.05] font-bold text-[#1c1c1e] sm:text-5xl lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]"
          >
            {hero.title} <span className="text-[#3979ff]">{hero.titleAccent}</span>
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.2}
            className="max-w-[30rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg"
          >
            {hero.body}
          </FadeIn>

          <FadeIn delay={0.2} className="mt-2 flex flex-col items-start gap-5">
            <StoreBadges />
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-6 tracking-[-0.0125rem] text-[#696969]">
              {hero.proof.map((p, i) => (
                <span key={p.label} className="flex items-center gap-x-3">
                  {i > 0 && (
                    <span aria-hidden className="text-[#c4c8d0]">
                      ·
                    </span>
                  )}
                  <span>
                    <strong className="inline-flex items-center gap-1 font-semibold text-[#1c1c1e]">
                      {p.star && <Star className="size-4 fill-[#ffb800] text-[#ffb800]" aria-hidden />}
                      {p.value}
                    </strong>{" "}
                    {p.label}
                  </span>
                </span>
              ))}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div
            className="rounded-[1.5rem] border border-[rgba(57,121,255,0.12)] p-3 sm:p-6 lg:p-10"
            style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
          >
            <ScanCard />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

const formatIcon: Record<DownloadFormat["key"], LucideIcon> = {
  pix: Newspaper,
  qix: Play,
  trax: AudioLines,
  nia: Sparkles,
}

/** One format: what you do with it, its name and a line, linking to its page. */
function FormatCard({ format, index }: { format: DownloadFormat; index: number }) {
  const Icon = formatIcon[format.key]
  return (
    <FadeIn as="li" delay={revealDelay(index, 4)} className="flex">
      <Link
        href={format.href}
        className="group flex w-full flex-col rounded-[1.25rem] bg-white p-6 transition-transform hover:-translate-y-1 lg:p-7"
      >
        <span className="grid size-11 place-items-center rounded-[0.75rem] bg-brand-blue-soft text-[#3979ff]">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="mt-8 text-sm leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
          {format.verb}
        </span>
        <span className="mt-2 text-[1.75rem] leading-8 font-bold tracking-[-0.05rem] text-[#1c1c1e]">
          {format.name}
        </span>
        <span className="mt-3 flex-1 text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{format.body}</span>
        <span className="mt-6 flex items-center gap-1.5 text-base leading-6 font-medium text-[#1c1c1e]">
          Explore {format.name}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </Link>
    </FadeIn>
  )
}

/** Grey band: the two-tone line and the store badges again, over the four formats. */
export function DownloadFormats() {
  return (
    <section className={cn(sectionPad, "bg-[#f5f5f7] py-20 lg:py-32")}>
      <div className={cn(column, "flex flex-col gap-10 lg:gap-14")}>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <FadeIn as="h2" className={h2}>
            <span className="block">{band.title}</span>
            <span className="block text-[rgba(28,28,30,0.5)]">{band.muted}</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <StoreBadges />
          </FadeIn>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {formats.map((f, i) => (
            <FormatCard key={f.key} format={f} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
