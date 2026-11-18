"use client"

import * as React from "react"
import Image from "next/image"
import { CheckIcon, PlusIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useDarkRoute } from "@/components/shared/route-theme"
import { cn } from "@/lib/utils"
import { languages, REGION_STORAGE_KEY } from "./nav-config"

const DEFAULT_REGION = languages[0].code
const REGION_EVENT = "dm-region-change"

function readRegion() {
  try {
    const code = localStorage.getItem(REGION_STORAGE_KEY)
    if (code && languages.some((l) => l.code === code)) return code
  } catch {}
  return DEFAULT_REGION
}

function saveRegion(code: string) {
  try {
    localStorage.setItem(REGION_STORAGE_KEY, code)
  } catch {}
  document.documentElement.dataset.region = code
  // Tell every switcher on the page (desktop bar and mobile sheet) to re-read it.
  window.dispatchEvent(new Event(REGION_EVENT))
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== REGION_STORAGE_KEY) return
    document.documentElement.dataset.region = readRegion()
    onChange()
  }
  window.addEventListener(REGION_EVENT, onChange)
  window.addEventListener("storage", onStorage) // another tab changed it
  return () => {
    window.removeEventListener(REGION_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

/**
 * Which trigger image shows is decided by CSS from <html data-region>, which an inline script in
 * app/layout.tsx sets from localStorage before first paint. The server can't know the saved
 * region, so this is what keeps a reload from flashing the default image first.
 */
const triggerImageClass: Record<string, string> = {
  in: "block [[data-region]:not([data-region=in])_&]:hidden",
  apac: "hidden [[data-region=apac]_&]:block",
  amer: "hidden [[data-region=amer]_&]:block",
  me: "hidden [[data-region=me]_&]:block",
}

/** Region picker: a shadcn navigation menu, so it opens on hover (and on click/tap or focus). */
export function LanguageSwitcher() {
  // Saved in localStorage; the server renders the default and the saved one takes over on hydration.
  const lang = React.useSyncExternalStore(subscribe, readRegion, () => DEFAULT_REGION)
  // Controlled so choosing a region closes the menu.
  const [open, setOpen] = React.useState<string | null>(null)
  const dark = useDarkRoute()

  const current = languages.find((l) => l.code === lang) ?? languages[0]

  return (
    // sideOffset matches the Features menu: the panel drops just below the navbar's bottom edge.
    // The popup is portalled outside RouteTheme, so it takes the dark tokens explicitly on dark routes.
    <NavigationMenu
      align="end"
      sideOffset={28}
      positionerClassName={cn(dark && "theme-nia")}
      value={open}
      onValueChange={(v) => setOpen(v as string | null)}
    >
      <NavigationMenuList>
        <NavigationMenuItem value="region">
          <NavigationMenuTrigger
            aria-label={`Region: ${current.label}. Change region`}
            icon={
              // "+" when closed; its vertical bar folds away into "−" while open.
              <PlusIcon
                aria-hidden="true"
                className="ml-1 size-3.5 [&>path:last-child]:origin-center [&>path:last-child]:transition-transform [&>path:last-child]:duration-300 group-data-open/navigation-menu-trigger:[&>path:last-child]:scale-y-0 group-data-popup-open/navigation-menu-trigger:[&>path:last-child]:scale-y-0"
              />
            }
            className="h-8 gap-0 bg-transparent px-1.5 text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent"
          >
            {languages.map((l) => (
              <Image
                key={l.code}
                src={l.image}
                alt=""
                width={18}
                height={18}
                loading="eager"
                className={`size-[1.125rem] ${triggerImageClass[l.code]}`}
              />
            ))}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-56 p-1.5 [html:has(.nia-layout)_&]:lg:[zoom:var(--site-scale-auto,1)]">
            <ul className="flex flex-col">
              {languages.map((l, i) => (
                <li key={l.code}>
                  {/* Hairline between rows, inset like the Features menu's dividers */}
                  {i > 0 && <div aria-hidden="true" className="mx-2.5 my-0.5 h-px bg-border" />}
                  <NavigationMenuLink
                    active={l.code === lang}
                    render={<button type="button" />}
                    onClick={() => {
                      setOpen(null)
                      if (l.code === lang) return
                      saveRegion(l.code)
                      // Reload so the whole page picks up the new region.
                      window.location.reload()
                    }}
                    className="w-full gap-3 px-2.5 py-2 text-left text-[0.9375rem]"
                  >
                    <Image src={l.image} alt="" width={22} height={22} className="size-[1.375rem] shrink-0" />
                    <span className="flex-1">{l.label}</span>
                    {l.code === lang && <CheckIcon className="size-[1.125rem]" />}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
