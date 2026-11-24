import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { cn } from "@/lib/utils"
import { ApplyForm, ApplyLink } from "./apply-form"
import { apply, hero, roles, values } from "./content"

// Careers page sections: the Privacy Policy's dark hero, then the Advertise page's grey
// bands, 1200px column and form styling.

const column = "mx-auto w-full max-w-[75rem]"
const sectionPad = "px-4 sm:px-6 lg:px-8"
const h2 =
  "text-4xl leading-[1.1] font-medium tracking-[-0.09375rem] text-[#1c1c1e] lg:text-5xl lg:leading-[3.25rem]"

/** Dark band: eyebrow, then the two-line title on the left and the intro on the right. */
export function CareersHero() {
  return (
    <section className="bg-[#1c1c1e] px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:px-[6.5625vw] lg:pt-[15rem] lg:pb-[7.5rem]">
      <div className="mx-auto flex max-w-[104.25rem] flex-col gap-5 lg:gap-[1.6875rem]">
        <FadeIn
          as="p"
          className="text-md leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase"
        >
          {hero.eyebrow}
        </FadeIn>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <FadeIn
            as="h1"
            className="text-[2.5rem] leading-[1.15] font-medium text-white sm:text-5xl sm:leading-[1.2] lg:text-[3.5rem] lg:leading-[4.25rem] lg:whitespace-nowrap"
          >
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </FadeIn>

          <FadeIn
            delay={0.2}
            className="flex flex-col items-start gap-6 text-base leading-7 tracking-[-0.0125rem] text-white/60 lg:text-lg"
          >
            <p className="max-w-[37.875rem]">{hero.body[0]}</p>
            <p className="max-w-[33.75rem]">{hero.body[1]}</p>
            <a
              href={`#${roles.id}`}
              className="flex h-10 items-center gap-2.5 rounded-[0.8125rem] bg-white py-2 pr-2 pl-4 transition-[translate,background-color] hover:-translate-y-px hover:bg-white/90"
            >
              <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-[#1c1c1e]">
                See open roles
              </span>
              <span className="grid size-6 place-items-center rounded-lg bg-[#3979ff]/10">
                <Image src="/shared/arrow-up-right-blue.svg" alt="" width={12} height={12} className="size-3 rotate-90" />
              </span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/** Grey band: four numbered reasons to join. */
export function CareersValues() {
  return (
    <section className={cn(sectionPad, "bg-[#f5f5f7] py-20 lg:py-32")}>
      <div className={column}>
        <FadeIn>
          <h2 className={h2}>{values.title}</h2>
        </FadeIn>
        <ul className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:pt-12">
          {values.items.map((item, i) => (
            <li key={item.title}>
              <FadeIn delay={revealDelay(i, 4)} className="flex h-full flex-col gap-3 rounded-[1rem] bg-white p-8">
                <p className="text-xs leading-[1.3125rem] font-bold tracking-[0.1875rem] text-[#3979ff]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-xl leading-7 font-medium tracking-[-0.025rem] text-[#1c1c1e]">{item.title}</h3>
                <p className="text-base leading-7 tracking-[-0.0125rem] text-[#696969]">{item.body}</p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Heading and note beside the list of openings; "Apply" jumps to the form with the role picked. */
export function CareersRoles() {
  return (
    <section id={roles.id} className={cn(sectionPad, "scroll-mt-24 bg-white py-20 lg:py-32")}>
      <div
        className={cn(
          column,
          "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,46.5rem)] lg:justify-between lg:gap-20",
        )}
      >
        <div className="flex flex-col gap-5">
          <FadeIn as="h2" className={h2}>
            {roles.title}
          </FadeIn>
          <FadeIn as="p" delay={0.2} className="text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg">
            {roles.body}
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <ul className="border-t border-[#ececf0]">
            {roles.items.map((role) => (
              <li key={role.title} className="border-b border-[#ececf0]">
                <ApplyLink
                  role={role.title}
                  className="group flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="text-xl leading-7 font-medium tracking-[-0.025rem] text-[#1c1c1e] transition-colors group-hover:text-[#3979ff]">
                      {role.title}
                    </span>
                    <span className="text-sm leading-5 text-[#696969]">
                      {role.team} · {role.location} · {role.type}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-base leading-6 font-medium text-[#3979ff]">
                    {roles.apply}
                    <Image
                      src="/shared/arrow-up-right-blue.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </ApplyLink>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  )
}

/** Grey band: intro and hiring steps beside the application form (as the Advertise enquiry). */
export function CareersApply() {
  return (
    <section id={apply.id} className={cn(sectionPad, "scroll-mt-24 bg-[#f5f5f7] py-20 lg:py-32")}>
      <div
        className={cn(
          column,
          "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,46.5rem)] lg:justify-between lg:gap-20",
        )}
      >
        <div className="flex flex-col gap-5">
          <FadeIn as="h2" className={h2}>
            {apply.title}
          </FadeIn>
          <FadeIn as="p" delay={0.2} className="text-base leading-7 tracking-[-0.0125rem] text-[#696969] lg:text-lg">
            {apply.body}
          </FadeIn>

          <FadeIn delay={0.2} className="pt-4">
            <p className="text-xs font-semibold tracking-[0.09375rem] text-[#97979e] uppercase">{apply.stepsTitle}</p>
            <ol className="mt-5 flex flex-col">
              {apply.steps.map((step, i) => (
                <li
                  key={step.title}
                  // A thin line joins each numbered dot to the next.
                  className="relative flex gap-4 pb-6 before:absolute before:top-9 before:bottom-1 before:left-4 before:w-px before:bg-[#dddfe3] last:pb-0 last:before:hidden"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-[#3979ff] shadow-[0px_1px_1px_0px_rgba(16,24,40,0.06),0px_4px_6px_0px_rgba(16,24,40,0.04)]">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5 pt-1">
                    <span className="text-base leading-6 font-medium text-[#1c1c1e]">{step.title}</span>
                    <span className="text-sm leading-5 text-[#696969]">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <ApplyForm />
        </FadeIn>
      </div>
    </section>
  )
}
