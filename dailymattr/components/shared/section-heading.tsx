import { cn } from "@/lib/utils"
import { FadeIn } from "./fade-in"

type SectionHeadingProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  /** Extra classes for the <h2>, e.g. a heavier weight; merged after the defaults. */
  titleClassName?: string
  children?: React.ReactNode
  /** Light text for headings that sit on a dark panel. */
  inverted?: boolean
}

/**
 * Landing page section heading (Figma 8585:9489), Helvetica Neue except the title:
 * eyebrow Medium 18/18 −0.16px #3979ff · title Inter Tight Semibold 48/48 −1.5px #292929 ·
 * description Regular 18/26 #696969 · actions 40px below.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  children,
  inverted,
}: SectionHeadingProps) {
  return (
    <FadeIn className={cn("flex max-w-3xl flex-col items-center text-center", className)}>
      {eyebrow && (
        <p className="mb-4 text-sm leading-none font-medium tracking-[-0.01rem] text-[#3979ff] uppercase lg:text-lg">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-tight text-3xl leading-none font-semibold tracking-[-0.0625rem] sm:text-4xl lg:text-5xl lg:tracking-[-0.0938rem]",
          inverted ? "text-white" : "text-[#292929]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base text-[#696969] lg:text-lg lg:leading-6.5">
          {description}
        </p>
      )}
      {children && <div className="mt-8 lg:mt-10">{children}</div>}
    </FadeIn>
  )
}
