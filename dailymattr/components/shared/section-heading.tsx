import { cn } from "@/lib/utils"
import { FadeIn } from "./fade-in"

type SectionHeadingProps = {
  eyebrow?: string
  title: React.ReactNode
  /**
   * Muted first line above the title (Figma 8859:12699): the title then takes the two-tone
   * style, Helvetica Neue Medium 48/48 −1.5px #1c1c1e with this line at 50% opacity.
   */
  lead?: React.ReactNode
  description?: React.ReactNode
  className?: string
  /** Extra classes for the <h2>, e.g. a heavier weight; merged after the defaults. */
  titleClassName?: string
  /** Extra classes for the description, merged after the defaults. */
  descriptionClassName?: string
  children?: React.ReactNode
  /** Light text for headings that sit on a dark panel. */
  inverted?: boolean
}

/**
 * Landing page section heading (Figma 8585:9489), Helvetica Neue except the title:
 * eyebrow Medium 18/18 −0.16px #3979ff · title Inter Tight Semibold 48/48 −1.5px #292929 ·
 * description Regular 18/26 #696969 · actions 40px below.
 * With a `lead`, the title is the two-tone style used from the app preview down.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  description,
  className,
  titleClassName,
  descriptionClassName,
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
          "text-3xl leading-none tracking-[-0.0625rem] sm:text-4xl lg:text-5xl lg:tracking-[-0.0938rem]",
          lead ? "font-medium" : "font-semibold",
          inverted ? "text-white" : lead ? "text-[#1c1c1e]" : "text-[#292929]",
          titleClassName
        )}
      >
        {lead && (
          <>
            <span className={inverted ? "text-white/50" : "text-[rgba(28,28,30,0.5)]"}>{lead}</span>
            <br />
          </>
        )}
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-base text-[#696969] lg:text-lg lg:leading-6.5", descriptionClassName)}>
          {description}
        </p>
      )}
      {children && <div className="mt-8 lg:mt-10">{children}</div>}
    </FadeIn>
  )
}
