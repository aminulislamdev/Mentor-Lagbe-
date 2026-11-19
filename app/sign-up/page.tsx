"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  GraduationCap,
  Presentation,
  ArrowRight,
  Globe,
  Asterisk,
  ShieldCheck,
  Feather,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "student" | "tutor"

// ─── Static charter copy ─────────────────────────────────────────────────────

const CONTENTS = [
  { numeral: "I.", title: "Declaration of Intent", note: "your oath", href: "#article-1" },
  { numeral: "II.", title: "The Inscription", note: "≈ 2 min", href: "#article-2" },
  { numeral: "III.", title: "The Seal", note: "confirmed", href: "#article-3" },
]

const OATHS: Record<
  Role,
  {
    kicker: string
    oath: string
    headline: string
    clauses: string[]
    footer: string
    cta: string
    namePlaceholder: string
  }
> = {
  student: {
    kicker: "Oath 01 — For those who seek",
    oath: "I",
    headline: "I seek a mentor.",
    clauses: [
      "Verified, credentialed mentors only.",
      "One tap to apply — zero middlemen.",
      "Your application, always within sight.",
    ],
    footer: "SSC · HSC · A-Level · IELTS · Admission",
    cta: "Inscribe me — I'm a Scholar",
    namePlaceholder: "Rafi Ahmed Chowdhury",
  },
  tutor: {
    kicker: "Oath 02 — For those who share",
    oath: "II",
    headline: "I share what I know.",
    clauses: [
      "Publish 2 batches free — unlimited with Pro.",
      "A clean applicant pipeline, not inbox noise.",
      "Your rate, your hours, your terms.",
    ],
    footer: "Educators · BUET & DU scholars · Alums",
    cta: "Inscribe me — I'm a Mentor",
    namePlaceholder: "Dr. Nasrin Islam",
  },
}

const METRICS = [
  { value: "2,400+", label: "Verified mentors" },
  { value: "12,000+", label: "Scholars inscribed" },
  { value: "99.2%", label: "Satisfaction" },
]

const ATTESTED_FEATS = ["Free to join", "No credit card", "Verified profiles"]

// ─── Scoped charter styles ───────────────────────────────────────────────────

const charterStyles = `
  .charter-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .charter-outline {
    -webkit-text-stroke: 1.5px #344C43;
    color: transparent;
  }
  .dark .charter-outline {
    -webkit-text-stroke: 1.5px #EFE7DC;
    color: transparent;
  }

  .charter-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes charter-rotate { to { transform: rotate(360deg); } }
  .charter-rotate { animation: charter-rotate 28s linear infinite; }

  @keyframes charter-stamp-pop {
    0%   { transform: rotate(-26deg) scale(1.7); }
    55%  { transform: rotate(-9deg)  scale(0.92); }
    100% { transform: rotate(-12deg) scale(1); }
  }
  .charter-stamp { animation: charter-stamp-pop 0.45s cubic-bezier(0.2, 1.4, 0.35, 1) both; }

  @keyframes charter-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .charter-rise { animation: charter-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes charter-seal-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(184, 121, 89, 0); }
    50%      { box-shadow: 0 0 44px 4px rgba(184, 121, 89, 0.35); }
  }
  .charter-seal-glow { animation: charter-seal-glow 4s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .charter-rotate, .charter-stamp, .charter-rise, .charter-seal-glow { animation: none !important; }
  }
`

// ─── Corner registration mark (letterpress trim ✛) ───────────────────────────

function RegistrationMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none font-mono text-xl leading-none text-[#344C43]/30 dark:text-[#EFE7DC]/20",
        className
      )}
    >
      +
    </span>
  )
}

// ─── Rubber stamp shown on the chosen oath ───────────────────────────────────

function ChosenStamp() {
  return (
    <div
      aria-hidden="true"
      className="charter-stamp absolute -right-3 -top-4 sm:-right-4 sm:-top-5 z-10"
    >
      <div className="flex size-20 sm:size-24 flex-col items-center justify-center rounded-full border-[3px] border-double border-[#B87959] bg-[#EFE7DC]/90 text-[#B87959] shadow-[0_4px_14px_rgba(184,121,89,0.35)] backdrop-blur-[2px] dark:bg-[#243630]/90">
        <span className="font-mono text-[10px] sm:text-[10px] font-bold uppercase leading-none tracking-[0.2em]">
          Sealed
        </span>
        <span className="charter-serif text-[13px] sm:text-sm font-black uppercase leading-tight tracking-wide">
          Chosen
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] uppercase leading-none tracking-[0.18em] opacity-80">
          2026
        </span>
      </div>
    </div>
  )
}

// ─── Oath slab (role selection) ──────────────────────────────────────────────

function OathSlab({
  role,
  selected,
  onSelect,
}: {
  role: Role
  selected: boolean
  onSelect: (r: Role) => void
}) {
  const data = OATHS[role]
  const Icon = role === "student" ? GraduationCap : Presentation

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(role)}
      className={cn(
        "group relative flex flex-col overflow-visible rounded-sm border p-5 sm:p-6 text-left transition-all duration-300 ease-out",
        "focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#344C43] dark:focus-visible:outline-[#EFE7DC]",
        selected
          ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[10px_10px_0_0_#B87959] -translate-y-1"
          : "border-[#344C43]/30 bg-[#EFE7DC]/70 text-[#344C43] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:-translate-y-1.5 hover:border-[#344C43]/60 hover:bg-[#EFE7DC] hover:shadow-[8px_8px_0_0_rgba(52,76,67,0.28)]"
      )}
    >
      {selected && <ChosenStamp />}

      {/* Ghost oath numeral */}
      <span
        aria-hidden="true"
        className={cn(
          "charter-serif pointer-events-none absolute right-4 top-2 select-none text-7xl sm:text-8xl font-black leading-none transition-colors duration-300",
          selected ? "text-[#EFE7DC]/10" : "text-[#344C43]/8"
        )}
      >
        {data.oath}
      </span>

      {/* Kicker */}
      <span
        className={cn(
          "font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em]",
          selected ? "text-[#B87959]" : "text-[#B87959]"
        )}
      >
        {data.kicker}
      </span>

      {/* Icon medallion + headline */}
      <span className="mt-4 flex items-end gap-4">
        <span
          className={cn(
            "flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            selected
              ? "border-[#668B78]/50 bg-[#668B78]/20 text-[#9DBFA9]"
              : "border-[#344C43]/25 bg-[#D9CBB5]/60 text-[#344C43] group-hover:border-[#668B78]/60 group-hover:text-[#4A695C]"
          )}
        >
          <Icon className="size-6 sm:size-7" strokeWidth={1.5} />
        </span>
        <span
          className={cn(
            "charter-serif text-[1.65rem] sm:text-3xl font-black leading-[1.05] tracking-tight",
            selected ? "text-[#EFE7DC]" : "text-[#344C43]"
          )}
        >
          {data.headline}
        </span>
      </span>

      {/* Clauses */}
      <ul className="mt-5 space-y-1.5">
        {data.clauses.map((clause) => (
          <li
            key={clause}
            className={cn(
              "flex items-baseline gap-2 font-mono text-[10px] sm:text-[11px] leading-snug",
              selected ? "text-[#EFE7DC]/75" : "text-[#344C43]/70"
            )}
          >
            <span className="text-[#B87959]">§</span>
            <span>{clause}</span>
          </li>
        ))}
      </ul>

      {/* Ledger footer */}
      <span
        className={cn(
          "mt-5 border-t pt-3 font-mono text-[10px] sm:text-[10px] uppercase tracking-[0.18em]",
          selected
            ? "border-[#EFE7DC]/15 text-[#EFE7DC]/50"
            : "border-[#344C43]/15 text-[#344C43]/50"
        )}
      >
        {data.footer}
      </span>
    </button>
  )
}

// ─── Ledger field row (numbered, ruled) ──────────────────────────────────────

function LedgerRow({
  index,
  children,
  className,
}: {
  index: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_1fr] gap-x-3 sm:gap-x-4 border-t border-[#344C43]/20 py-4 dark:border-[#EFE7DC]/12",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pt-6 font-mono text-[10px] sm:text-[11px] font-medium tracking-widest text-[#B87959]"
      >
        {index}
      </span>
      <div>{children}</div>
    </div>
  )
}

const underlineInput =
  "h-11 rounded-none border-0 border-b-2 border-[#344C43]/25 bg-transparent px-0 text-[15px] text-[#344C43] placeholder:text-[#344C43]/30 shadow-none transition-colors focus:border-[#B87959] focus:bg-[#EFE7DC]/70 focus:ring-0 dark:border-[#EFE7DC]/20 dark:text-[#EFE7DC] dark:placeholder:text-[#EFE7DC]/25 dark:focus:border-[#C98B6D] dark:focus:bg-[#EFE7DC]/5"

// ─── Password field with visibility toggle ───────────────────────────────────

function PasswordInput({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Eight characters or more"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        className={cn(underlineInput, "pr-10")}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#344C43]/45 transition-colors hover:text-[#344C43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] dark:text-[#EFE7DC]/40 dark:hover:text-[#EFE7DC] dark:focus-visible:outline-[#EFE7DC]"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

// ─── Password strength meter (letterpress ticks) ─────────────────────────────

function StrengthMeter({ password }: { password: string }) {
  const strength = (() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const labels = ["", "Fragile", "Fair", "Sound", "Sealed-grade"]
  const tones = ["", "#A34343", "#B87959", "#668B78", "#344C43"]

  if (!password) return null

  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i <= strength ? tones[strength] : "rgba(52,76,67,0.14)",
            }}
          />
        ))}
      </div>
      <span
        className="font-mono text-[9px] font-medium uppercase tracking-[0.2em]"
        style={{ color: tones[strength] }}
      >
        {labels[strength]}
      </span>
    </div>
  )
}

// ─── The Seal — rotating registry stamp + hologram ledger ────────────────────

function SealPanel() {
  return (
    <aside
      className="relative rotate-[-1.25deg] rounded-sm border border-[#243630] bg-[#344C43] p-6 sm:p-7 text-[#EFE7DC] shadow-[14px_14px_0_0_rgba(52,76,67,0.22)] dark:bg-[#243630]"
      aria-label="Registry seal and folio details"
    >
      {/* Print registration marks inside the plate */}
      <span aria-hidden="true" className="absolute left-2 top-1.5 font-mono text-[10px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute right-2 top-1.5 font-mono text-[10px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute bottom-1.5 left-2 font-mono text-[10px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute bottom-1.5 right-2 font-mono text-[10px] text-[#EFE7DC]/25">+</span>

      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#B87959]">
        Article III — The Seal
      </p>

      {/* Rotating wax-seal */}
      <div className="mt-5 flex items-center gap-5">
        <div className="charter-seal-glow relative flex size-28 sm:size-32 shrink-0 items-center justify-center rounded-full">
          <svg
            viewBox="0 0 100 100"
            className="charter-rotate absolute inset-0 size-full text-[#C98B6D]"
            aria-hidden="true"
          >
            <defs>
              <path
                id="charter-seal-circle"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <circle cx="50" cy="50" r="49" fill="#B87959" opacity="0.16" />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#B87959"
              strokeWidth="1.4"
              strokeDasharray="2.5 2.5"
            />
            <text className="fill-current" style={{ fontSize: "8.35px", letterSpacing: "1.6px", fontFamily: "var(--font-geist-mono), monospace", textTransform: "uppercase" }}>
              <textPath href="#charter-seal-circle">
                MentorLagbe · Seal of Enrollment · Est. 2026 ·
              </textPath>
            </text>
          </svg>
          <div className="relative flex size-14 sm:size-16 flex-col items-center justify-center rounded-full bg-[#B87959] text-[#EFE7DC] shadow-inner">
            <Feather className="size-5 sm:size-6" strokeWidth={1.5} />
            <span className="mt-0.5 font-mono text-[10px] sm:text-[10px] font-bold uppercase tracking-[0.2em]">
              Sealed
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="charter-serif text-lg sm:text-xl font-bold italic leading-snug text-[#EFE7DC]">
            “Four minutes, start to sealed.”
          </p>
          <p className="mt-1.5 font-mono text-[10px] sm:text-[10px] uppercase tracking-[0.2em] text-[#EFE7DC]/55">
            Anika R. — Scholar of Physics · Mirpur
          </p>
        </div>
      </div>

      {/* Hologram ledger */}
      <dl className="mt-6 divide-y divide-[#EFE7DC]/12 border-y border-[#EFE7DC]/12 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em]">
        {[
          ["Folio Nº", "ML-2026-04817"],
          ["Cohort", "2026 · E2"],
          ["Seats remaining", "312 / 500"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-[#EFE7DC]/50">{k}</dt>
            <dd className="text-[#EFE7DC]">{v}</dd>
          </div>
        ))}
      </dl>

      {/* Seat capacity bar */}
      <div className="mt-4" aria-hidden="true">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFE7DC]/12">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#668B78] via-[#C98B6D] to-[#B87959]"
            style={{ width: "38%" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#EFE7DC]/40">
          <span>Ledger open</span>
          <span>Sealing soon</span>
        </div>
      </div>

      <p className="mt-5 flex items-center gap-2 font-mono text-[10px] sm:text-[10px] uppercase tracking-[0.22em] text-[#EFE7DC]/45">
        <ShieldCheck className="size-3.5 text-[#668B78]" strokeWidth={2} />
        Seal authenticity verified · Trust Office
      </p>
    </aside>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [role, setRole] = useState<Role>("student")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    background: "",
    agreeCharter: false,
    agreeLetter: false,
  })

  const set = (field: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Static UI only — the charter is signed by the backend, elsewhere.
  }

  const oath = OATHS[role]

  return (
    <div className="charter-root relative overflow-hidden bg-[#D9CBB5] text-[#344C43] transition-colors duration-300 dark:bg-[#1A2823] dark:text-[#EFE7DC]">
      <style>{charterStyles}</style>

      {/* Giant watermark monogram */}
      <div
        aria-hidden="true"
        className="charter-serif pointer-events-none absolute right-1 top-14 hidden select-none text-[7.5rem] font-black leading-none text-[#344C43]/[0.08] dark:text-[#EFE7DC]/[0.05] xl:block"
      >
        №
      </div>

      {/* Print registration marks at the sheet corners */}
      <RegistrationMark className="left-2 top-11 hidden lg:block" />
      <RegistrationMark className="right-2 top-11 hidden lg:block" />
      <RegistrationMark className="bottom-2 left-2 hidden lg:block" />
      <RegistrationMark className="bottom-2 right-2 hidden lg:block" />

      {/* ══ Registry ribbon — the masthead strip ═══════════════════════════ */}
      <div className="relative border-b border-[#344C43]/30 dark:border-[#EFE7DC]/15">
        <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#344C43]/70 dark:text-[#EFE7DC]/55 sm:px-8 sm:text-[10px]">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Asterisk className="size-3 text-[#B87959]" strokeWidth={2.5} />
            MentorLagbe · The Enrollment Charter
          </span>
          <span className="hidden md:inline">Dhaka — Est. 2026</span>
          <span className="hidden whitespace-nowrap sm:inline">Folio Nº ML-REG-001</span>
        </div>
      </div>

      <main className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
        {/* ══ MASTHEAD — dear future master ═══════════════════════════════ */}
        <header className="grid gap-8 border-b border-[#344C43]/30 py-8 dark:border-[#EFE7DC]/15 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-14">
          <div className="relative lg:col-span-8">
            <p className="charter-rise font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]" style={{ "--rise-delay": "0s" } as React.CSSProperties}>
              [ Enrollment Charter · Vol. I · MMXXVI ]
            </p>

            <h1
              className="charter-rise charter-serif mt-4 font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#344C43] dark:text-[#EFE7DC]"
              style={{ "--rise-delay": "0.08s", fontSize: "clamp(3.4rem, 11vw, 8.25rem)" } as React.CSSProperties}
            >
              Dear Future
              <span className="charter-outline block">
                Master<span style={{ WebkitTextStroke: "0", color: "#B87959" }}>.</span>
              </span>
            </h1>

            {/* Hand-written aside */}
            <div className="charter-rise mt-5 flex items-center gap-3 sm:mt-6" style={{ "--rise-delay": "0.16s" } as React.CSSProperties}>
              <svg width="44" height="20" viewBox="0 0 44 20" fill="none" aria-hidden="true" className="shrink-0 text-[#B87959]">
                <path d="M2 14C12 6 22 4 34 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.5 4" />
                <path d="M30 3.5 35.5 8 29.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="max-w-[26ch] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/65 dark:text-[#EFE7DC]/55">
                yes, you — the quiet one in the back row
              </p>
            </div>

            <p className="charter-rise mt-5 max-w-md text-sm leading-relaxed text-[#344C43]/80 dark:text-[#EFE7DC]/70 sm:text-[15px]" style={{ "--rise-delay": "0.22s" } as React.CSSProperties}>
              The ledger is open. MentorLagbe is the enrollment charter for a
              deliberate community of scholars and the mentors who shape them —
              choose your oath, inscribe yourself, and seal your place in the
              2026 cohort.
            </p>
          </div>

          {/* Contents column — the document's table of articles */}
          <nav
            aria-label="Charter contents"
            className="charter-rise flex flex-col justify-center lg:col-span-4"
            style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/55 dark:text-[#EFE7DC]/45">
              Contents
            </p>
            <ol className="mt-3 border-t border-[#344C43]/25 dark:border-[#EFE7DC]/15">
              {CONTENTS.map((item) => (
                <li key={item.numeral}>
                  <a
                    href={item.href}
                    className="group flex items-baseline gap-2 whitespace-nowrap border-b border-[#344C43]/25 py-2.5 transition-colors dark:border-[#EFE7DC]/15 hover:bg-[#EFE7DC]/50 dark:hover:bg-[#EFE7DC]/5"
                  >
                    <span className="charter-serif w-6 shrink-0 text-base font-black italic text-[#B87959]">
                      {item.numeral}
                    </span>
                    <span className="text-[11px] font-semibold tracking-tight text-[#344C43] transition-transform duration-200 group-hover:translate-x-1 dark:text-[#EFE7DC] xl:text-[12px]">
                      {item.title}
                    </span>
                    <span aria-hidden="true" className="mx-0.5 min-w-2 flex-1 -translate-y-[3px] border-b border-dotted border-[#344C43]/40 dark:border-[#EFE7DC]/30" />
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#344C43]/50 transition-colors group-hover:text-[#B87959] dark:text-[#EFE7DC]/40">
                      {item.note}
                    </span>
                  </a>
                </li>
              ))}
            </ol>

            {/* Ledger metrics */}
            <dl className="mt-5 grid grid-cols-3 divide-x divide-[#344C43]/20 border-y border-[#344C43]/25 py-3 text-center dark:divide-[#EFE7DC]/15 dark:border-[#EFE7DC]/15">
              {METRICS.map((m) => (
                <div key={m.label} className="px-2">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="charter-serif text-lg font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-xl">
                    {m.value}
                  </dd>
                  <dd className="mt-0.5 font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>
          </nav>
        </header>

        {/* ══ ARTICLE I — Declaration of Intent ═══════════════════════════ */}
        <section id="article-1" aria-labelledby="article-1-heading" className="scroll-mt-24 py-8 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">
                Article I
              </p>
              <h2
                id="article-1-heading"
                className="charter-serif mt-1 text-3xl font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-4xl"
              >
                Declaration of <span className="italic text-[#668B78]">Intent</span>
              </h2>
            </div>
            <p className="max-w-[32ch] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
              Choose exactly one — the rest of the charter conforms
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 md:gap-6 lg:gap-8">
            <OathSlab role="student" selected={role === "student"} onSelect={setRole} />
            <OathSlab role="tutor" selected={role === "tutor"} onSelect={setRole} />
          </div>
        </section>

        {/* ══ ARTICLE II — The Inscription ════════════════════════════════ */}
        <section
          id="article-2"
          aria-labelledby="article-2-heading"
          className="scroll-mt-24 border-t border-[#344C43]/30 py-8 dark:border-[#EFE7DC]/15 sm:py-12"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">
                Article II
              </p>
              <h2
                id="article-2-heading"
                className="charter-serif mt-1 text-3xl font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-4xl"
              >
                The <span className="italic text-[#668B78]">Inscription</span>
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
              Now inscribing: <span className="text-[#B87959]">{role === "student" ? "The Scholar" : "The Mentor"}</span>
            </p>
          </div>

          <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-12 lg:gap-12">
            {/* ── Longhand form (the inscription itself) ── */}
            <div className="lg:col-span-7">
              {/* Express lane */}
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

              <form onSubmit={handleSubmit} noValidate>
                {/* 01 — Full name */}
                <LedgerRow index="01">
                  <Label htmlFor="fullName" required>
                    Full Name
                  </Label>
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

                {/* 02 — Email */}
                <LedgerRow index="02">
                  <Label htmlFor="email" required>
                    Email
                  </Label>
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

                {/* 03 — Password */}
                <LedgerRow index="03">
                  <Label htmlFor="password" required>
                      Password
                  </Label>
                  <PasswordInput
                    id="password"
                    value={form.password}
                    onChange={(v) => set("password")(v)}
                  />
                  <StrengthMeter password={form.password} />
                </LedgerRow>

                {/* 04 — Mentor-only clause */}
                {role === "tutor" && (
                  <LedgerRow index="04">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Label htmlFor="background" className="mb-0">
                        Academic Background{" "}
                        <span className="normal-case tracking-normal text-[#344C43]/40 dark:text-[#EFE7DC]/35">
                          (optional)
                        </span>
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

                {/* 05 — Attestations */}
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
                        <span className="font-semibold text-[#344C43] dark:text-[#EFE7DC]">§</span> I
                        attest to the{" "}
                        <Link href="#" className="font-medium text-[#668B78] underline underline-offset-2 transition-colors hover:text-[#4A695C]">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="font-medium text-[#668B78] underline underline-offset-2 transition-colors hover:text-[#4A695C]">
                          Privacy Policy
                        </Link>
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

                {/* 06 — The affix */}
                <LedgerRow index={role === "tutor" ? "06" : "05"}>
                  <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className={cn(
                        "group inline-flex h-13 w-full items-center justify-center gap-3 rounded-sm bg-[#344C43] px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC]",
                        "shadow-[7px_7px_0_0_#B87959] transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_#B87959] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_0_#B87959]",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344C43] dark:bg-[#668B78] dark:text-[#1A2823] dark:shadow-[7px_7px_0_0_#C98B6D] dark:focus-visible:outline-[#EFE7DC]",
                        "sm:w-auto"
                      )}
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

            {/* ── The wax seal panel (Article III, previewed beside II) ── */}
            <div id="article-3" className="scroll-mt-24 lg:col-span-5 lg:pl-2 xl:pl-6">
              <div className="lg:sticky lg:top-24">
                <SealPanel />
              </div>
            </div>
          </div>
        </section>

        {/* ══ Colophon — guarantees & sign-in ══════════════════════════════ */}
        <footer className="flex flex-col items-start justify-between gap-4 border-t border-[#344C43]/30 py-5 dark:border-[#EFE7DC]/15 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#344C43]/60 dark:text-[#EFE7DC]/50 sm:text-[10px]">
            {ATTESTED_FEATS.map((feat) => (
              <span key={feat} className="mr-4 inline-flex items-center gap-1.5">
                <Asterisk className="size-3 text-[#B87959]" strokeWidth={2.5} />
                {feat}
              </span>
            ))}
          </p>
          <p className="text-sm text-[#344C43]/70 dark:text-[#EFE7DC]/65">
            Already sealed your place?{" "}
            <Link
              href="/sign-in"
              className="group inline-flex items-center gap-1 font-semibold text-[#344C43] underline decoration-[#B87959] decoration-2 underline-offset-4 transition-colors hover:text-[#668B78] dark:text-[#EFE7DC] dark:hover:text-[#9DBFA9]"
            >
              Sign In
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </p>
        </footer>
      </main>
    </div>
  )
}
