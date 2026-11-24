import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { softGlow } from "@/components/shared/soft-glow"
import { cn } from "@/lib/utils"
import { channels, hero, supportEmail } from "./content"
import { SupportForm } from "./support-form"

// Support page sections. Same 1200px column, type scale and panels as the Advertise page.

const column = "mx-auto w-full max-w-[75rem]"
const sectionPad = "px-4 sm:px-6 lg:px-8"

/** White icon tile, as on the Advertise cards. */
function IconTile({ src }: { src: string }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-[0.75rem] bg-white shadow-[0px_1px_1px_0px_rgba(16,24,40,0.06),0px_4px_6px_0px_rgba(16,24,40,0.04)]">
      <Image src={src} alt="" width={24} height={24} className="size-6" />
    </span>
  )
}

/** Intro copy and contact details beside the support form in a glowing panel. */
export function SupportHero() {
  return (
    <section className={cn(sectionPad, "bg-white pt-12 pb-16 sm:pt-16 lg:pt-[7rem] lg:pb-[7.5rem]")}>
      <div
        className={cn(
          column,
          "grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,31.25rem)_minmax(0,38.75rem)] lg:justify-between lg:gap-[4.5rem]",
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
            className="text-[2.75rem] leading-[1.05] font-medium text-[#1c1c1e] sm:text-5xl lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]"
          >
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </FadeIn>
          <FadeIn as="p" delay={0.2} className="max-w-[28rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg">
            {hero.body}
          </FadeIn>

          <FadeIn delay={0.2} className="mt-2">
            <a
              href={`mailto:${supportEmail}`}
              className="group flex items-center gap-4 rounded-[1rem] border border-[#ececf0] bg-[#f7f7f7] py-3 pr-5 pl-3 transition-colors hover:border-[rgba(57,121,255,0.3)]"
            >
              <IconTile src="/support/mail.svg" />
              <span className="flex flex-col">
                <span className="text-sm leading-5 text-[#696969]">{hero.emailLabel}</span>
                <span className="text-base leading-6 font-medium break-all text-[#1c1c1e] group-hover:text-[#3979ff]">
                  {supportEmail}
                </span>
              </span>
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div
            className="rounded-[1.5rem] border border-[rgba(57,121,255,0.12)] p-3 sm:p-6"
            style={{ backgroundImage: softGlow("linear-gradient(#f6f8fd, #f6f8fd)") }}
          >
            <SupportForm />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/** Grey band: three cards pointing to the other contact routes. */
export function SupportChannels() {
  return (
    <section className={cn(sectionPad, "bg-[#f5f5f7] py-20 lg:py-32")}>
      <div className={column}>
        <FadeIn>
          <h2 className="text-4xl leading-[1.1] font-medium tracking-[-0.09375rem] text-[#1c1c1e] lg:text-5xl lg:leading-[3.25rem]">
            {channels.title}
          </h2>
        </FadeIn>
        <ul className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-3 lg:pt-12">
          {channels.items.map((item, i) => {
            const external = item.link.href.startsWith("mailto:")
            const Anchor = external ? "a" : Link
            return (
              <li key={item.title}>
                <FadeIn delay={revealDelay(i, 3)} className="h-full">
                  <Anchor
                    href={item.link.href}
                    className="group flex h-full flex-col gap-5 rounded-[1rem] bg-white p-8 transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[0px_12px_32px_0px_rgba(16,24,40,0.08)]"
                  >
                    <IconTile src={item.icon} />
                    <div className="flex flex-1 flex-col gap-2">
                      <h3 className="text-xl leading-7 font-medium tracking-[-0.025rem] text-[#1c1c1e]">
                        {item.title}
                      </h3>
                      <p className="text-base leading-7 tracking-[-0.0125rem] text-[#696969]">{item.body}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-base leading-6 font-medium break-all text-[#3979ff]">
                      {item.link.label}
                      <Image
                        src="/shared/arrow-up-right-blue.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Anchor>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
