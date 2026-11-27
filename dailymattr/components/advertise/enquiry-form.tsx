"use client"

import Image from "next/image"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check } from "lucide-react"

import { DarkArrowButton } from "@/components/shared/dark-arrow-link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"
import { enquiry } from "./content"

// Field styling from Figma 8595:13438: h48, radius 12, border #dddfe3, label 14/20 Medium, 8px gap.
// Shared with the Support form (components/support/support-form.tsx).
export const field =
  "h-12 rounded-[0.75rem] border-[#dddfe3] bg-white px-3.5 text-base text-[#1c1c1e] shadow-none placeholder:text-[#9a9aa0] md:text-base focus-visible:border-[#3979ff] focus-visible:ring-[#3979ff]/20"
const label = "text-sm leading-5 font-medium text-[#1c1c1e]"

export function Field({
  id,
  text,
  children,
  className,
}: {
  id: string
  text: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className={label}>
        {text}
      </Label>
      {children}
    </div>
  )
}

/**
 * Dropdown in the site's own style (Base UI Select): the trigger looks like the other fields,
 * and the open list uses the page font at the same 16px, in a white rounded panel, instead of
 * the browser's native menu. `placeholder` shows greyed until a choice is made (blank by
 * default, as in Figma). It posts its value under `name` like a native select. Pass `value`
 * and `onChange` to control it from outside.
 */
export function Select({
  id,
  name,
  options,
  placeholder,
  required,
  value,
  onChange,
}: {
  id: string
  name: string
  options: string[]
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <SelectPrimitive.Root
      name={name}
      required={required}
      modal={false}
      {...(value === undefined
        ? { defaultValue: null }
        : { value: value || null, onValueChange: (v: string | null) => onChange?.(v ?? "") })}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          field,
          "flex w-full cursor-pointer items-center justify-between gap-2 border pr-3.5 text-left outline-none focus-visible:ring-3 data-popup-open:border-[#3979ff]",
        )}
      >
        <SelectPrimitive.Value
          placeholder={<span className="text-[#9a9aa0]">{placeholder}</span>}
          className="min-w-0 truncate"
        />
        <SelectPrimitive.Icon className="shrink-0">
          <Image src="/advertise/chevron-down.svg" alt="" width={16} height={16} className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner sideOffset={6} alignItemWithTrigger={false} className="isolate z-50 outline-none">
          <SelectPrimitive.Popup className="max-h-(--available-height) w-(--anchor-width) overflow-y-auto rounded-[0.75rem] border border-[#dddfe3] bg-white p-1.5 text-base text-[#1c1c1e] shadow-[0_12px_32px_rgba(20,20,23,0.12)] outline-none">
            <SelectPrimitive.List>
              {options.map((o) => (
                <SelectPrimitive.Item
                  key={o}
                  value={o}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-[0.5rem] px-3 py-2.5 text-base leading-6 outline-none select-none data-highlighted:bg-[#f3f3f6] data-selected:font-medium"
                >
                  <SelectPrimitive.ItemText>{o}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4 text-[#3979ff]" aria-hidden />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

/**
 * Enquiry form (Figma 8595:13433). There is no enquiries backend yet, so submitting opens the
 * visitor's email app with the details filled in, addressed to the company inbox.
 */
export function EnquiryForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "").trim()
    const subject = `Advertising enquiry${value("company") ? ` - ${value("company")}` : ""}`
    const body = [
      `Name: ${value("name")}`,
      `Company: ${value("company")}`,
      `Business email: ${value("email")}`,
      `Campaign objective: ${value("objective")}`,
      `Budget range: ${value("budget")}`,
      "",
      value("message"),
    ].join("\n")
    window.location.href = `mailto:${site.publisher.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-[1rem] bg-white p-6 sm:p-8 lg:p-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="advertise-name" text="Name">
          <Input id="advertise-name" name="name" autoComplete="name" required className={field} />
        </Field>
        <Field id="advertise-company" text="Company">
          <Input id="advertise-company" name="company" autoComplete="organization" className={field} />
        </Field>
        <Field id="advertise-email" text="Business email">
          <Input id="advertise-email" name="email" type="email" autoComplete="email" required className={field} />
        </Field>
        <Field id="advertise-objective" text="Campaign objective">
          <Select id="advertise-objective" name="objective" options={enquiry.objectives} />
        </Field>
        <Field id="advertise-budget" text="Budget range" className="sm:col-span-2">
          <Select id="advertise-budget" name="budget" options={enquiry.budgets} />
        </Field>
      </div>

      <Field id="advertise-message" text="Message">
        <Textarea
          id="advertise-message"
          name="message"
          required
          className={cn(field, "field-sizing-fixed h-[8.75rem] resize-y py-3")}
        />
      </Field>

      <DarkArrowButton type="submit">{enquiry.submit}</DarkArrowButton>
    </form>
  )
}
