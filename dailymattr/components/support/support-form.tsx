"use client"

import { Field, Select, field } from "@/components/advertise/enquiry-form"
import { DarkArrowButton } from "@/components/shared/dark-arrow-link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { form, supportEmail } from "./content"

/**
 * Support request card. Same fields and styling as the Advertise enquiry form. There is no
 * support backend yet, so submitting opens the visitor's email app with the request filled
 * in, addressed to the support inbox.
 */
export function SupportForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "").trim()
    const subject = `Support request – ${value("topic")}`
    const body = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Topic: ${value("topic")}`,
      "",
      value("message"),
    ].join("\n")
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-labelledby="support-form-title"
      className="flex flex-col gap-6 rounded-[1rem] bg-white p-6 shadow-[0px_1px_1px_0px_rgba(16,24,40,0.04),0px_12px_32px_0px_rgba(16,24,40,0.06)] sm:p-8 lg:p-10"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#ececf0] pb-6">
        <div>
          <p className="text-xs leading-[1.3125rem] font-bold tracking-[0.15625rem] text-[#3979ff] uppercase">
            {form.kicker}
          </p>
          <h2
            id="support-form-title"
            className="pt-1.5 text-2xl leading-8 font-medium tracking-[-0.05rem] text-[#1c1c1e] lg:text-[1.75rem] lg:leading-9"
          >
            {form.title}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-sm leading-5 font-medium text-[#1c1c1e]">
          <span aria-hidden className="size-2 rounded-full bg-[#22c55e] shadow-[0_0_0_3px_rgba(34,197,94,0.18)]" />
          {form.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="support-name" text="Your name">
          <Input
            id="support-name"
            name="name"
            autoComplete="name"
            required
            placeholder={form.placeholders.name}
            className={field}
          />
        </Field>
        <Field id="support-email" text="Email address">
          <Input
            id="support-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={form.placeholders.email}
            className={field}
          />
        </Field>
      </div>

      <Field id="support-topic" text="Support topic">
        <Select
          id="support-topic"
          name="topic"
          options={form.topics}
          placeholder={form.placeholders.topic}
          required
        />
      </Field>

      <Field id="support-message" text="Your message">
        <Textarea
          id="support-message"
          name="message"
          required
          placeholder={form.placeholders.message}
          className={cn(field, "field-sizing-fixed h-[8.75rem] resize-y py-3")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <DarkArrowButton type="submit">{form.submit}</DarkArrowButton>
        <p className="text-sm leading-5 text-[#696969]">{form.replyTime}</p>
      </div>
    </form>
  )
}
