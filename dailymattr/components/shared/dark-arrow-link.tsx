import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * Black pill link with the white arrow chip ("Contact the press team", "Manage your privacy
 * choices"). Figma 8595:12701 / 8697:1624: h40, radius 13, Helvetica Medium 16/16 −0.2px.
 */
export function DarkArrowLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-10 w-fit items-center gap-2.5 rounded-[0.8125rem] bg-black py-2 pr-2 pl-4 font-helvetica transition-[translate,background-color] hover:-translate-y-px hover:bg-[#1c1c1e]",
        className,
      )}
    >
      <span className="text-base leading-4 font-medium tracking-[-0.0125rem] whitespace-nowrap text-white">
        {children}
      </span>
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white/20">
        <Image src="/shared/arrow-up-right-white.svg" alt="" width={12} height={12} className="block size-3" />
      </span>
    </Link>
  )
}
