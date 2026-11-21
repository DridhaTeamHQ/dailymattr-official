"use client"

import Image from "next/image"
import { Mail, PartyPopper } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { Field, field } from "@/components/advertise/enquiry-form"
import { DarkArrowButton } from "@/components/shared/dark-arrow-link"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import primaryLogo from "@/public/Figma_logos/Primary logo.png"
import { form } from "./content"

const card =
  "col-start-1 row-start-1 flex flex-col rounded-[1rem] bg-white p-6 shadow-[0px_1px_1px_0px_rgba(16,24,40,0.04),0px_12px_32px_0px_rgba(16,24,40,0.06)] sm:p-8 lg:p-10"

/**
 * Newsletter sign-up card. UI only for now, like the Careers form: submitting validates the
 * email and shows the "on the list" confirmation, but nothing is sent or stored. Connect
 * onSubmit to the mailing-list provider later.
 *
 * The confirmation is laid over the (hidden) form in the same grid cell, so the card keeps
 * its height and the hero beside it doesn't jump.
 *
 * The home page's newsletter card submits here as a GET form (?firstName=…&email=…), so the
 * fields start filled with what the visitor typed there; the query is then dropped from the
 * address bar so the email doesn't linger in history.
 */
export function SubscribeForm() {
  const [subscribed, setSubscribed] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const firstName = params.get("firstName")
    const email = params.get("email")
    if (!firstName && !email) return
    if (firstNameRef.current && firstName) firstNameRef.current.value = firstName
    if (emailRef.current && email) emailRef.current.value = email
    history.replaceState(history.state, "", window.location.pathname + window.location.hash)
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setSubscribed(String(data.get("email") ?? "").trim())
  }

  function addAnother() {
    formRef.current?.reset()
    // The form stays inert until this render commits, so commit it before moving focus.
    flushSync(() => setSubscribed(null))
    emailRef.current?.focus()
  }

  return (
    <div className="grid">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        aria-label="Newsletter sign-up"
        inert={!!subscribed}
        className={cn(card, "gap-6", subscribed && "invisible")}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#ececf0] pb-6">
          <Image src={primaryLogo} alt="dailymattr" className="h-6 w-auto lg:h-7" />
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-sm leading-5 font-medium text-[#1c1c1e]">
            <span aria-hidden className="size-2 rounded-full bg-[#3979ff] shadow-[0_0_0_3px_rgba(57,121,255,0.18)]" />
            {form.badge}
          </span>
        </div>

        <Field id="newsletter-first-name" text={form.labels.firstName}>
          <Input
            ref={firstNameRef}
            id="newsletter-first-name"
            name="firstName"
            autoComplete="given-name"
            placeholder={form.placeholders.firstName}
            className={field}
          />
        </Field>
        <Field id="newsletter-email" text={form.labels.email}>
          <Input
            ref={emailRef}
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={form.placeholders.email}
            className={field}
          />
        </Field>

        <div className="flex flex-col gap-4 pt-1">
          <DarkArrowButton type="submit" className="h-12 w-full justify-between rounded-[0.75rem] pl-5">
            {form.submit}
          </DarkArrowButton>
          <p className="text-center text-sm leading-5 text-balance text-[#696969]">{form.finePrint}</p>
        </div>
      </form>

      {/* Always mounted, so screen readers announce the confirmation when it appears */}
      <div role="status" className="contents">
        {subscribed && (
          <div
            className={cn(
              card,
              "items-start justify-center gap-5",
              "animate-in duration-500 fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
            )}
          >
            <span className="grid size-12 place-items-center rounded-full bg-[#3979ff]/10 text-[#3979ff]">
              <PartyPopper className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="text-2xl leading-8 font-medium tracking-[-0.05rem] text-[#1c1c1e] lg:text-[1.75rem] lg:leading-9">
              {form.success.title}
            </h2>
            <p className="max-w-[26rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969]">
              {form.success.body}
            </p>
            <span className="flex max-w-full items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-sm leading-5 font-medium text-[#1c1c1e]">
              <Mail className="size-4 shrink-0 text-[#3979ff]" aria-hidden />
              <span className="truncate">{subscribed}</span>
            </span>
            <button
              type="button"
              onClick={addAnother}
              className="cursor-pointer text-base leading-6 font-medium text-[#3979ff] underline-offset-2 hover:underline"
            >
              {form.success.again}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
