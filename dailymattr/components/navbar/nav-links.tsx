import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import type { NavItem } from "./nav-config"

// Matches Figma nav item: hug × 32, padding 12/8, gap 4, radius 13
const navLinkClass =
  "h-8 gap-1 whitespace-nowrap rounded-[13px] bg-background px-3 py-2 text-sm font-normal text-muted-foreground hover:bg-background hover:text-foreground focus:bg-background"

export function NavLinks({ links, className }: { links: NavItem[]; className?: string }) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="gap-0">
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink render={<Link href={l.href} />} className={navLinkClass}>
              {l.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
