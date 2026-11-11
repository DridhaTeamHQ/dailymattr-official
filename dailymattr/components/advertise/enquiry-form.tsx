"use client"

import Image from "next/image"

import { DarkArrowButton } from "@/components/shared/dark-arrow-link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"
import { enquiry } from "./content"

// Field styling from Figma 8595:13438: h48, radius 12, border #dddfe3, label 14/20 Medium, 8px gap.
const field =
  "h-12 rounded-[0.75rem] border-[#dddfe3] bg-white px-3.5 text-base text-[#1c1c1e] shadow-none md:text-base focus-visible:border-[#3979ff] focus-visible:ring-[#3979ff]/20"
const label = "text-sm leading-5 font-medium text-[#1c1c1e]"

function Field({ id, text, children }: { id: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={label}>
        {text}
      </Label>
      {children}
    </div>
  )
}

function Select({ id, name, options }: { id: string; name: string; options: string[] }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        defaultValue=""
        className={cn(
          field,
          "w-full appearance-none border pr-10 outline-none focus-visible:ring-3",
        )}
      >
        {/* Blank until chosen, as in Figma. */}
        <option value="" disabled />

        {options.map((o) => (
          <option key={o} value={o} className="text-[#1c1c1e]">
            {o}
          </option>
        ))}
      </select>
      <Image
        src="/advertise/chevron-down.svg"
        alt=""
        width={16}
        height={16}
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
      />
    </div>
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
    const subject = `Advertising enquiry${value("company") ? ` – ${value("company")}` : ""}`
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
        <Field id="advertise-budget" text="Budget range">
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
