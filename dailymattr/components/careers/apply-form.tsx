"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Field, Select, field } from "@/components/advertise/enquiry-form"
import { DarkArrowButton } from "@/components/shared/dark-arrow-link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { apply, roles } from "./content"

// A role's "Apply" link tells the form which role to preselect through this window event.
const APPLY_EVENT = "careers:apply"

/** Jumps to the application form with `role` preselected. */
export function ApplyLink({
  role,
  className,
  children,
}: {
  role: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={`#${apply.id}`}
      onClick={() => window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: role }))}
      className={className}
    >
      {children}
    </a>
  )
}

const roleOptions = [...roles.items.map((r) => r.title), apply.generalOption]

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

/**
 * Job application form. UI only for now: submitting validates the fields and shows a
 * confirmation, but nothing is sent or stored. Connect onSubmit to the hiring backend later.
 */
export function ApplyForm() {
  const [role, setRole] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [sent, setSent] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const onApply = (e: Event) => {
      setRole((e as CustomEvent<string>).detail)
      setSent(null)
    }
    window.addEventListener(APPLY_EVENT, onApply)
    return () => window.removeEventListener(APPLY_EVENT, onApply)
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const firstName = String(data.get("name") ?? "").trim().split(/\s+/)[0] ?? ""
    setSent({ name: firstName, role: String(data.get("role") ?? "") })
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0] ?? null
    const tooBig = !!chosen && chosen.size > apply.cv.maxBytes
    e.target.setCustomValidity(tooBig ? apply.cv.tooBig : "")
    setFile(chosen)
  }

  function reset() {
    setSent(null)
    setRole("")
    setFile(null)
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-5 rounded-[1rem] bg-white p-6 sm:p-8 lg:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-[#3979ff]/10">
          <Image src="/careers/check.svg" alt="" width={24} height={24} className="size-6" />
        </span>
        <h3 className="text-2xl leading-8 font-medium tracking-[-0.05rem] text-[#1c1c1e] lg:text-[1.75rem] lg:leading-9">
          {apply.success.title}
        </h3>
        <p className="max-w-[32rem] text-base leading-7 tracking-[-0.0125rem] text-[#696969]">
          Thanks{sent.name ? `, ${sent.name}` : ""}. We’ll review your{" "}
          {sent.role === apply.generalOption ? "application" : `application for ${sent.role}`} and get in touch
          if there’s a fit.
        </p>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer text-base leading-6 font-medium text-[#3979ff] underline-offset-2 hover:underline"
        >
          {apply.success.again}
        </button>
      </div>
    )
  }

  const { labels, placeholders } = apply
  const tooBig = !!file && file.size > apply.cv.maxBytes

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-[1rem] bg-white p-6 sm:p-8 lg:p-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field id="apply-name" text={labels.name}>
          <Input id="apply-name" name="name" autoComplete="name" required placeholder={placeholders.name} className={field} />
        </Field>
        <Field id="apply-email" text={labels.email}>
          <Input
            id="apply-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={placeholders.email}
            className={field}
          />
        </Field>
        <Field id="apply-phone" text={labels.phone}>
          <Input id="apply-phone" name="phone" type="tel" autoComplete="tel" placeholder={placeholders.phone} className={field} />
        </Field>
        <Field id="apply-city" text={labels.city}>
          <Input
            id="apply-city"
            name="city"
            autoComplete="address-level2"
            placeholder={placeholders.city}
            className={field}
          />
        </Field>
        <Field id="apply-role" text={labels.role}>
          <Select
            id="apply-role"
            name="role"
            options={roleOptions}
            placeholder={placeholders.role}
            required
            value={role}
            onChange={setRole}
          />
        </Field>
        <Field id="apply-experience" text={labels.experience}>
          <Select id="apply-experience" name="experience" options={apply.experience} placeholder={placeholders.experience} />
        </Field>
        <Field id="apply-portfolio" text={labels.portfolio}>
          <Input id="apply-portfolio" name="portfolio" type="url" placeholder={placeholders.portfolio} className={field} />
        </Field>
        <Field id="apply-notice" text={labels.notice}>
          <Select id="apply-notice" name="notice" options={apply.notice} placeholder={placeholders.notice} />
        </Field>
      </div>

      <Field id="apply-cv" text={labels.cv}>
        {/* Dropzone-style picker over a visually hidden (but still validated) file input. */}
        <div
          className={cn(
            "relative flex items-center gap-4 rounded-[0.75rem] border border-dashed bg-[#fafafb] px-4 py-4 transition-colors hover:border-[#3979ff] has-[:focus-visible]:border-[#3979ff] has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-[#3979ff]/20",
            tooBig ? "border-[#e5484d]" : "border-[#c9ccd3]",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-[0.625rem] bg-white shadow-[0px_1px_1px_0px_rgba(16,24,40,0.06),0px_4px_6px_0px_rgba(16,24,40,0.04)]">
            <Image src="/careers/upload.svg" alt="" width={20} height={20} className="size-5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm leading-5 font-medium text-[#1c1c1e]">{file ? file.name : apply.cv.empty}</span>
            <span className={cn("text-sm leading-5", tooBig ? "text-[#e5484d]" : "text-[#696969]")}>
              {tooBig ? apply.cv.tooBig : file ? formatSize(file.size) : apply.cv.hint}
            </span>
          </span>
          <span className="shrink-0 text-sm leading-5 font-medium text-[#3979ff]">
            {file ? apply.cv.change : apply.cv.browse}
          </span>
          <input
            id="apply-cv"
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={onFile}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
      </Field>

      <Field id="apply-message" text={labels.message}>
        <Textarea
          id="apply-message"
          name="message"
          placeholder={placeholders.message}
          className={cn(field, "field-sizing-fixed h-[8.75rem] resize-y py-3")}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-5 text-[#696969]">
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#3979ff]" />
        <span>
          {apply.consent}{" "}
          <Link href="/privacypolicy/" className="font-medium text-[#3979ff] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <DarkArrowButton type="submit">{apply.submit}</DarkArrowButton>
    </form>
  )
}
