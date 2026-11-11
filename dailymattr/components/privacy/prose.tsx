import { cn } from "@/lib/utils"

/*
 * Rich-text building blocks for the policy article (Figma 8697:572). Inter Tight throughout:
 * body 15.5/27.125 #3a3a40, sub-headings Bold 16/28 #141417, blue dot bullets.
 * Vertical rhythm comes from each block's top padding, as in Figma.
 */

/** Body paragraph. The first one after a section heading sits 16px down, later ones 14px. */
export function P({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p className={cn("text-[0.96875rem] leading-[1.6953rem] text-[#3a3a40]", first ? "pt-4" : "pt-3.5")}>
      {children}
    </p>
  )
}

/** Numbered sub-heading ("3.1 From all users"). */
export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-[1.625rem] text-base leading-7 font-bold text-[#141417]">{children}</h3>
}

/** Blue-dot list. `tight` drops the 14px lead-in for a list right under a sub-heading. */
export function List({ children, tight }: { children: React.ReactNode; tight?: boolean }) {
  return (
    <ul className={cn("flex flex-col gap-2.5", tight ? "pt-2.5" : "pt-3.5")}>{children}</ul>
  )
}

export function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-[1.625rem] text-[0.96875rem] leading-[1.6953rem] text-[#3a3a40]">
      <span aria-hidden className="absolute top-[0.6rem] left-1 size-[0.4375rem] rounded-full bg-[#3979ff]" />
      {children}
    </li>
  )
}

/** Grey note box ("We do not sell or rent your personal data…"). */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[1.125rem] rounded-[1.125rem] border border-[#ececf0] bg-[#f6f6f8] px-[1.375rem] py-[1.125rem] text-[0.90625rem] leading-[1.5859rem] text-[#3a3a40]">
      {children}
    </div>
  )
}

/** Bold, near-black emphasis. */
export function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-[#141417]">{children}</strong>
}

/** Blue semibold highlight for key phrases. */
export function Hl({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#3979ff]">{children}</span>
}

/** Blue semibold cross-reference to another section of the policy. */
export function Ref({ to, children }: { to: number; children: React.ReactNode }) {
  return (
    <a href={`#section-${to}`} className="font-semibold text-[#3979ff] underline-offset-2 hover:underline">
      {children}
    </a>
  )
}
