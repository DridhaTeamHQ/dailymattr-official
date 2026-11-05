"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { languages } from "./nav-config"
import { UKFlag } from "./uk-flag"

export function LanguageSwitcher() {
  const [lang, setLang] = React.useState("en")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-1.5 hover:bg-transparent"
            aria-label="Change language"
          />
        }
      >
        {lang === "en" ? (
          <UKFlag />
        ) : (
          <span className="text-xs font-medium uppercase">{lang}</span>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
          {languages.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
