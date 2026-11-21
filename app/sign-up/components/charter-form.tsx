// Article II-এর form — সব field + submit button
"use client"

import Link from "next/link"
import { ArrowRight, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { OATHS, type Role } from "./oaths"
import { LedgerRow, underlineInput } from "./ledger-row"
import { PasswordInput } from "./password-input"
import { StrengthMeter } from "./strength-meter"

export function CharterForm({
  role,
  form,
  set,
  onSubmit,
}: {
  role: Role
  form: {
    fullName: string
    email: string
    password: string
    background: string
    agreeCharter: boolean
    agreeLetter: boolean
  }
  set: (field: keyof typeof form) => (value: string | boolean) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const oath = OATHS[role]

  return (
    <div className="lg:col-span-7">
      {/* Google express lane */}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-sm border-2 border-dashed border-[#344C43]/35 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#344C43] transition-all duration-200 hover:border-solid hover:border-[#344C43] hover:bg-[#EFE7DC]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] dark:border-[#EFE7DC]/25 dark:text-[#EFE7DC] dark:hover:border-[#EFE7DC] dark:focus-visible:outline-[#EFE7DC]"
      >
        <Globe className="size-4 text-[#668B78]" strokeWidth={1.75} />
        Express lane — continue with Google
      </button>

      <div className="my-5 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[#344C43]/25 dark:bg-[#EFE7DC]/15" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/50 dark:text-[#EFE7DC]/40">
          or inscribe in longhand
        </span>
        <span className="h-px flex-1 bg-[#344C43]/25 dark:bg-[#EFE7DC]/15" />
      </div>

      <form onSubmit={onSubmit} noValidate>
        <LedgerRow index="01">
          <Label htmlFor="fullName" required>Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder={oath.namePlaceholder}
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            autoComplete="name"
            className={underlineInput}
          />
        </LedgerRow>

        <LedgerRow index="02">
          <Label htmlFor="email" required>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            autoComplete="email"
            className={underlineInput}
          />
        </LedgerRow>

        <LedgerRow index="03">
          <Label htmlFor="password" required>Password</Label>
          <PasswordInput id="password" value={form.password} onChange={(v) => set("password")(v)} />
          <StrengthMeter password={form.password} />
        </LedgerRow>

        {role === "tutor" && (
          <LedgerRow index="04">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Label htmlFor="background" className="mb-0">
                Academic Background{" "}
                <span className="normal-case tracking-normal text-[#344C43]/40 dark:text-[#EFE7DC]/35">(optional)</span>
              </Label>
              <span className="rounded-sm border border-[#B87959]/40 bg-[#B87959]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#B87959]">
                Clause IV — Mentor filing
              </span>
            </div>
            <textarea
              id="background"
              rows={3}
              placeholder="e.g. BSc in Physics, Dhaka University — five years guiding SSC batches..."
              value={form.background}
              onChange={(e) => set("background")(e.target.value)}
              className="flex w-full resize-none rounded-sm border border-[#344C43]/25 bg-transparent px-3 py-2.5 text-sm text-[#344C43] outline-none transition-colors placeholder:text-[#344C43]/35 focus:border-[#B87959] focus:bg-[#EFE7DC]/70 focus:ring-2 focus:ring-[#B87959]/15 dark:border-[#EFE7DC]/20 dark:text-[#EFE7DC] dark:placeholder:text-[#EFE7DC]/25 dark:focus:border-[#C98B6D] dark:focus:bg-[#EFE7DC]/5"
            />
          </LedgerRow>
        )}

        <LedgerRow index={role === "tutor" ? "05" : "04"} className="space-y-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/55 dark:text-[#EFE7DC]/45">
            Attestations
          </p>
          <Checkbox
            id="agree-charter"
            checked={form.agreeCharter}
            onCheckedChange={(v) => set("agreeCharter")(v === true)}
            label={
              <span>
                <span className="font-semibold text-[#344C43] dark:text-[#EFE7DC]">§</span> I attest to the{" "}
                <Link href="#" className="font-medium text-[#668B78] underline underline-offset-2 transition-colors hover:text-[#4A695C]">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="font-medium text-[#668B78] underline underline-offset-2 transition-colors hover:text-[#4A695C]">Privacy Policy</Link>
                <span className="text-[#A34343]"> *</span>
              </span>
            }
          />
          <Checkbox
            id="agree-letter"
            checked={form.agreeLetter}
            onCheckedChange={(v) => set("agreeLetter")(v === true)}
            label="Send me The Weekly Scholar — one letter of craft, every Sunday."
          />
        </LedgerRow>

        <LedgerRow index={role === "tutor" ? "06" : "05"}>
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-sm bg-[#344C43] px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC] shadow-[7px_7px_0_0_#B87959] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_#B87959] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#B87959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344C43] dark:bg-[#668B78] dark:text-[#1A2823] dark:shadow-[7px_7px_0_0_#C98B6D] dark:focus-visible:outline-[#EFE7DC] sm:w-auto"
            >
              {oath.cta}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={2} />
            </button>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:max-w-[16ch]">
              Free to join · No card · Cancel anytime
            </p>
          </div>
        </LedgerRow>
      </form>
    </div>
  )
}