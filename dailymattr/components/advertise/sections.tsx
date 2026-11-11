import Image from "next/image"

import { DarkArrowLink } from "@/components/shared/dark-arrow-link"
import { FadeIn } from "@/components/shared/fade-in"
import { softGlow } from "@/components/shared/soft-glow"
import { cn } from "@/lib/utils"
import { environment, enquiry, hero, partnerships, principles } from "./content"
import { EnquiryForm } from "./enquiry-form"

// Advertise page sections (Figma 8595:13231). 1200px content column, 160px section rhythm.

const column = "mx-auto w-full max-w-[75rem]"
const sectionPad = "px-4 sm:px-6 lg:px-8"
const h2 =
  "text-4xl leading-[1.1] font-medium tracking-[-0.09375rem] text-[#1c1c1e] lg:text-5xl lg:leading-[3.25rem]"
const h3 = "text-3xl leading-[1.1] font-medium tracking-[-0.09375rem] lg:text-display lg:leading-11"
const body = "text-base leading-7 tracking-[-0.0125rem] lg:text-lg"

/** White icon tile used on the cards (Figma 8595:13354). */
function IconTile({ src, dark }: { src: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-[0.75rem]",
        dark
          ? "bg-white/8"
          : "bg-white shadow-[0px_1px_1px_0px_rgba(16,24,40,0.06),0px_4px_6px_0px_rgba(16,24,40,0.04)]",
      )}
    >
      <Image src={src} alt="" width={24} height={24} className="size-6" />
    </span>
  )
}

/** Copy and CTA beside a glowing media panel (Figma 8595:13301). */
export function AdvertiseHero() {
  return (
    <section className={cn(sectionPad, "bg-white pt-12 pb-16 sm:pt-16 lg:pt-[7rem] lg:pb-[7.5rem]")}>
      <div
        className={cn(
          column,
          "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,33.75rem)_minmax(0,36.75rem)] lg:justify-between lg:gap-[4.5rem]",
        )}
      >
        <FadeIn className="flex flex-col items-start gap-5 lg:gap-6">
          <p className="font-helvetica text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="max-w-[33.75rem] text-[2.75rem] leading-[1.05] font-medium text-[#1c1c1e] sm:text-5xl lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.title}
          </h1>
          {hero.body.map((p) => (
            <p key={p} className={cn(body, "max-w-[31.25rem] text-[#696969]")}>
              {p}
            </p>
          ))}
          <DarkArrowLink href={hero.button.href}>{hero.button.label}</DarkArrowLink>
        </FadeIn>

        {/* Media slot: an empty placeholder in Figma, kept as one until the art exists. */}
        <FadeIn delay={0.1}>
          <div
            className="flex aspect-[588/560] w-full overflow-hidden rounded-[1.5rem] border border-[rgba(57,121,255,0.12)] p-4 sm:p-6"
            style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
          >
            <div className="size-full rounded-[1.125rem] bg-[rgba(230,231,234,0.75)]" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/** Grey band: heading beside the intro paragraph (Figma 8595:13330). */
export function AdvertiseEnvironment() {
  return (
    <section className={cn(sectionPad, "bg-[#f5f5f7] py-20 lg:py-40")}>
      <FadeIn className={cn(column, "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20")}>
        <h2 className={cn(h2, "max-w-[35rem]")}>{environment.title}</h2>
        <p className="max-w-[35rem] text-lg leading-[1.875rem] tracking-[-0.01875rem] text-[#696969] lg:text-xl">
          {environment.body}
        </p>
      </FadeIn>
    </section>
  )
}

/** Four format cards (Figma 8595:13340). */
export function AdvertisePartnerships() {
  return (
    <section className={cn(sectionPad, "bg-white py-20 lg:py-40")}>
      <div className={column}>
        <FadeIn>
          <h2 className={h2}>{partnerships.title}</h2>
        </FadeIn>
        <ul className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:pt-12">
          {partnerships.items.map((item, i) => (
            <li key={item.label}>
              <FadeIn delay={i * 0.06} className="flex h-full flex-col gap-5 rounded-[1rem] bg-[#f7f7f7] p-8">
                {/* Card art: an empty placeholder in Figma. */}
                <div className="h-[9.375rem] w-full rounded-[0.75rem] bg-[#e6e7ea]" />
                <IconTile src={item.icon} />
                <p className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">{item.label}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Light objectives card beside the dark independence card (Figma 8595:13407). */
export function AdvertisePrinciples() {
  const { objectives, independence } = principles
  return (
    <section className={cn(sectionPad, "bg-white pb-20 lg:pb-40")}>
      <div className={cn(column, "grid grid-cols-1 gap-6 lg:grid-cols-2")}>
        <FadeIn className="flex flex-col overflow-hidden rounded-[1.5rem]">
          <div
            className="flex flex-1 flex-col gap-5 p-8 sm:p-12 lg:min-h-[24.25rem] lg:p-16"
            // Glow geometry from Figma 8595:13408.
            style={{
              backgroundImage: softGlow("linear-gradient(#f7f7f7, #f7f7f7)", {
                blue: { at: "20% 20%", size: "45% 60%", alpha: 0.12 },
                violet: { at: "85% 80%", size: "40% 60%", alpha: 0.1 },
              }),
            }}
          >
            <IconTile src={objectives.icon} />
            <h3 className={cn(h3, "max-w-[28.75rem] text-[#1c1b17]")}>{objectives.title}</h3>
            <p className={cn(body, "max-w-[28.75rem] text-[#696969]")}>{objectives.body}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="flex flex-col overflow-hidden rounded-[1.5rem]">
          <div
            className="flex flex-1 flex-col gap-5 p-8 sm:p-12 lg:min-h-[24.25rem] lg:p-16"
            // Glow geometry from Figma 8595:13419: one blue glow, top right, over near-black.
            style={{
              backgroundImage: softGlow("linear-gradient(#0b0d12, #0b0d12)", {
                blue: { at: "85% 15%", size: "60% 70%", alpha: 0.28 },
                violet: { at: "0% 0%", size: "1% 1%", alpha: 0 },
              }),
            }}
          >
            <IconTile src={independence.icon} dark />
            <h3 className={cn(h3, "text-white")}>{independence.title}</h3>
            <p className={cn(body, "max-w-[28.75rem] text-white/70")}>{independence.body}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/** Grey band: heading beside the enquiry form (Figma 8595:13429). */
export function AdvertiseEnquiry() {
  return (
    <section id={enquiry.id} className={cn(sectionPad, "scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-40")}>
      <div className={cn(column, "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,26.25rem)_minmax(0,43.75rem)] lg:justify-between lg:gap-20")}>
        <FadeIn>
          <h2 className={cn(h2, "max-w-[26.25rem]")}>{enquiry.title}</h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <EnquiryForm />
        </FadeIn>
      </div>
    </section>
  )
}
