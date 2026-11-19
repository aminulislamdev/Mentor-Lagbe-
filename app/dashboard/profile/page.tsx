"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  Camera,
  Crown,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Check,
  Upload,
  ImageOff,
  RotateCcw,
  Save,
  ChevronRight,
  NotebookPen,
  House,
  Hash,
  ScanLine,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Colophon } from "@/components/dashboard/shared"

// ─── Static persona (works for student / tutor / admin — this page renders the signed-in member) ──

const PERSONA = {
  name: "Dr. Nasrin Islam",
  initials: "NI",
  email: "nasrin@mentorlagbe.com",
  phone: "+880 1911-208 455",
  location: "Dhanmondi 27, Dhaka",
  role: "Tutor",
  roleDetail: "Mentor · Verified",
  plan: "Pro",
  planDetail: "Tutor Pro Guild",
  memberId: "ML-2042-NI",
  joined: "02 Nov ’26",
  joinedNote: "Founding cohort — 2026",
  bio: "HSC Physics mentor — BUET ’12, seven years at the board. Integration is my native language; first principles are my method; your seat is earned, never bought.",
  batches: 2,
  scholars: 84,
  responseRate: "98%",
  completion: 86,
}

const COMPLETION_ITEMS = [
  { label: "Identity verified", done: true },
  { label: "Portrait uploaded", done: true },
  { label: "Email confirmed", done: true },
  { label: "Phone confirmed", done: true },
  { label: "Bio written (68 / 220)", done: true },
  { label: "Social handles linked", done: false, hint: "+4%" },
  { label: "Payout details added", done: false, hint: "+6%" },
  { label: "Studio address pinned", done: false, hint: "+4%" },
]

const DEFAULT_FORM = {
  name: PERSONA.name,
  phone: PERSONA.phone,
  bio: PERSONA.bio,
}

// ─── Scoped identity-desk styles ─────────────────────────────────────────────

const identityStyles = `
  .identity-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .identity-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes identity-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .identity-rise { animation: identity-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes identity-sheen {
    0%   { transform: translateX(-120%) skewX(-18deg); }
    100% { transform: translateX(240%) skewX(-18deg); }
  }
  .identity-sheen { animation: identity-sheen 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite; animation-delay: 1.2s; }

  @keyframes identity-spin-slow {
    to { transform: rotate(360deg); }
  }
  .identity-spin-slow { animation: identity-spin-slow 22s linear infinite; }

  @media (prefers-reduced-motion: reduce) {
    .identity-rise, .identity-sheen, .identity-spin-slow { animation: none !important; }
  }
`

// ─── Completion seal ring (SVG) ──────────────────────────────────────────────

function CompletionRing({ percent }: { percent: number }) {
  const R = 54
  const C = 2 * Math.PI * R
  const filled = (percent / 100) * C

  return (
    <svg viewBox="0 0 140 140" className="size-28 sm:size-32" role="img" aria-label={`Profile completion ${percent} percent`}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="#10181A" strokeOpacity="0.12" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={R}
        fill="none"
        stroke="#B87959"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${C - filled}`}
        strokeDashoffset={C * 0.25}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" fontSize="22" fontWeight="800" fill="#344C43" className="font-mono">
        {percent}
      </text>
      <text x="70" y="84" textAnchor="middle" fontSize="8" fill="#344C43" fillOpacity="0.6" className="font-mono" letterSpacing="2">
        PERCENT
      </text>
    </svg>
  )
}

// ─── Embossed identity card ──────────────────────────────────────────────────

function IdentityCard() {
  return (
    <figure
      className="relative overflow-hidden rounded-2xl border border-[#C98B6D]/45 bg-[#16241F] p-5 text-[#F2EDDF] shadow-[10px_12px_0_rgba(0,0,0,0.32)] sm:p-6"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 120% 80% at 85% -10%, rgba(201,139,109,0.22) 0%, transparent 55%), repeating-linear-gradient(-45deg, transparent 0 6px, rgba(242,237,223,0.025) 6px 7px)",
      }}
      aria-label={`Identity card — ${PERSONA.name}, ${PERSONA.roleDetail}`}
    >
      {/* Sheen sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="identity-sheen absolute top-[-20%] h-[140%] w-1/3 bg-gradient-to-r from-transparent via-[#F2EDDF]/14 to-transparent" />
      </div>

      {/* Top strip */}
      <div className="relative flex items-center justify-between gap-3 border-b border-[#F2EDDF]/12 pb-3">
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.36em] text-[#C98B6D]">
          MentorLagbe · Identity
        </span>
        <ScanLine aria-hidden="true" className="size-4 text-[#C9A25E]/80" strokeWidth={1.75} />
      </div>

      {/* Portrait + name */}
      <div className="relative mt-4 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-[#C98B6D]/60 bg-[#243630] sm:size-24"
        >
          <span className="settings-serif text-2xl font-black text-[#C98B6D] sm:text-3xl">
            {PERSONA.initials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="identity-serif text-xl font-black leading-tight tracking-tight text-[#F2EDDF] sm:text-2xl">
            {PERSONA.name}
          </p>
          <p className="mt-0.5 font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.22em] text-[#9DBFA9]">
            {PERSONA.roleDetail} · {PERSONA.planDetail}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-sm border border-[#7AA890]/45 bg-[#668B78]/20 px-1.5 py-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-[#9DBFA9]">
              <BadgeCheck aria-hidden="true" className="size-3" strokeWidth={2.5} />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-sm border border-[#C9A25E]/50 bg-[#C9A25E]/15 px-1.5 py-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-[#D8C9A3]">
              <Crown aria-hidden="true" className="size-3" strokeWidth={2} />
              Pro · Guild
            </span>
          </div>
        </div>
      </div>

      {/* ID rows */}
      <dl className="relative mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-[#F2EDDF]/12 pt-4 font-mono text-[7px] uppercase leading-snug tracking-[0.18em]">
        {[
          ["Member ID", PERSONA.memberId],
          ["Joined", `${PERSONA.joined} · Founding`],
          ["Scholars Guided", String(PERSONA.scholars)],
          ["Response Rate", PERSONA.responseRate],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[#F2EDDF]/40">{k}</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 text-[8px] font-bold text-[#EDE8DA]">
              {k === "Member ID" && <Hash aria-hidden="true" className="size-3 text-[#C9A25E]" strokeWidth={2} />}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {/* Signature strip */}
      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-[#F2EDDF]/12 pt-3">
        <span className="font-mono text-[8px] uppercase leading-snug tracking-[0.26em] text-[#F2EDDF]/55">
          Signed<br />
          <span className="text-[11px] normal-case tracking-normal text-[#C98B6D]" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            Nasrin
          </span>
        </span>
        {/* Holographic seal */}
        <div aria-hidden="true" className="identity-spin-slow relative flex size-12 items-center justify-center rounded-full border border-[#C9A25E]/50">
          <div className="absolute inset-1 rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(216,201,163,0.6), rgba(184,121,89,0.15) 25%, rgba(102,139,120,0.35) 50%, rgba(216,201,163,0.6) 75%, rgba(184,121,89,0.15))" }} />
          <span className="relative font-mono text-[7px] font-bold text-[#10181A]">ML</span>
        </div>
      </div>
    </figure>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [form, setForm] = useState({ ...DEFAULT_FORM })
  const [portraitRemoved, setPortraitRemoved] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  const dirty =
    form.name !== DEFAULT_FORM.name ||
    form.phone !== DEFAULT_FORM.phone ||
    form.bio !== DEFAULT_FORM.bio ||
    portraitRemoved

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCancel = () => {
    setForm({ ...DEFAULT_FORM })
    setPortraitRemoved(false)
  }

  const handleSave = () => {
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2600)
  }

  const fieldLabel = "font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60"
  const wellField =
    "h-11 w-full rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] px-3 text-[13px] text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/35 hover:border-[#344C43]/45 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20"

  return (
    <div className="identity-root relative text-[#344C43]">
      <style>{identityStyles}</style>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">

        {/* ══ MASTHEAD ═══════════════════════════════════════════════════ */}
        <header className="border-b-2 border-[#344C43] pb-5 sm:pb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
            [ The Identity Desk — Shared Across Roles ]
          </p>
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1
              className="identity-rise identity-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.6vw, 4.25rem)" } as React.CSSProperties}
            >
              Your Digital
              <span className="block">
                <span className="italic text-[#668B78]">Identity.</span>
                <span aria-hidden="true" className="text-[#B87959]">.</span>
              </span>
            </h1>
            <div className="max-w-[42ch]">
              <p className="text-sm leading-relaxed text-[#344C43]/80">
                The one page every scholar, mentor and admin shares — your
                name, your face, your terms. Edit with care; the board reads
                this page too.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#7AA890]/45 bg-[#668B78]/10 px-2.5 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#4A695C]">
                  <BadgeCheck aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  Tutor · Verified
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#C9A25E]/50 bg-[#C9A25E]/15 px-2.5 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#7A6A35]">
                  <Crown aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  Pro · Guild Member
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ══ TWO-COLUMN GRID ══════════════════════════════════════════════ */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">

          {/* ── LEFT — the plate, completion seal, plan ── */}
          <div className="space-y-5 lg:col-span-5">
            <IdentityCard />

            {/* Profile completion */}
            <section aria-labelledby="completion-heading" className="border border-[#344C43]/25 bg-[#EFE7DC] p-5 shadow-[5px_6px_0_rgba(52,76,67,0.13)]">
              <h2 id="completion-heading" className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#344C43]/60">
                The Seal of Completeness
              </h2>
              <div className="mt-4 flex items-center gap-5">
                <CompletionRing percent={PERSONA.completion} />
                <ul className="min-w-0 flex-1 space-y-1.5">
                  {COMPLETION_ITEMS.map((item) => (
                    <li key={item.label} className="flex items-start gap-2 text-[10.5px] leading-snug">
                      {item.done ? (
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />
                      ) : (
                        <span aria-hidden="true" className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border border-[#B87959]/55 font-mono text-[6px] font-bold text-[#B87959]">
                          +
                        </span>
                      )}
                      <span className={cn("tracking-tight", item.done ? "text-[#344C43]/80" : "font-semibold text-[#344C43]")}>
                        {item.label}
                        {item.hint && <span className="ml-1 font-mono text-[7px] text-[#B87959]">{item.hint}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Subscription summary */}
            <section aria-labelledby="plan-heading" className="relative overflow-hidden border border-[#C98B6D]/50 bg-[#243630] p-5 text-[#F2EDDF]" style={{ backgroundImage: "linear-gradient(150deg, rgba(201,139,109,0.16) 0%, transparent 45%)" }}>
              <span aria-hidden="true" className="absolute right-4 top-4 select-none text-xl leading-none text-[#C98B6D]/75">✦</span>
              <h2 id="plan-heading" className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#C98B6D]">
                <Crown aria-hidden="true" className="size-4" strokeWidth={1.75} />
                Your Guild Seat
              </h2>
              <p className="settings-serif mt-2 text-3xl font-black leading-none tracking-tight text-[#F2EDDF]">
                Tutor Pro<span className="text-base font-bold text-[#F2EDDF]/55"> · $15 / mo</span>
              </p>
              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.22em] text-[#9DBFA9]">
                Active · Renews 01 Dec ’26 · Invoice ML-2042
              </p>
              <ul className="mt-3 space-y-1 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[7px] uppercase leading-snug tracking-[0.16em] text-[#F2EDDF]/70">
                <li className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2} />Unlimited batch listings</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2} />Verified seal + featured index</li>
              </ul>
              <Link
                href="/dashboard/tutor/settings"
                className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C98B6D] transition-colors hover:text-[#E0A57E]"
              >
                View Plan Details
                <ChevronRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
            </section>
          </div>

          {/* ── RIGHT — the intake desk ── */}
          <form
            className="space-y-5 lg:col-span-7"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            aria-label="Update profile"
          >
            {/* 01 — Personal details */}
            <section aria-labelledby="details-heading" className="border border-[#344C43]/25 bg-[#EFE7DC] p-5 shadow-[5px_6px_0_rgba(52,76,67,0.13)] sm:p-6">
              <h2 id="details-heading" className="flex items-baseline justify-between gap-3 border-b border-[#344C43]/20 pb-2">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#B87959]">01</span>
                  <span className="identity-serif text-2xl font-black tracking-tight text-[#344C43]">The Details</span>
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#344C43]/55">What the board reads</span>
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="f-name" className={cn(fieldLabel, "mb-1.5 block")}>Full Name</Label>
                  <div className="relative">
                    <UserRound aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]" strokeWidth={1.75} />
                    <Input
                      id="f-name"
                      value={form.name}
                      onChange={set("name")}
                      className={cn(wellField, "pl-9 font-semibold")}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="f-email" className={cn(fieldLabel, "mb-1.5 block")}>
                    Email Address <span className="normal-case tracking-normal text-[#344C43]/45">(locked)</span>
                  </Label>
                  <div className="relative">
                    <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]/70" strokeWidth={1.75} />
                    <input
                      id="f-email"
                      type="email"
                      value={PERSONA.email}
                      readOnly
                      aria-readonly="true"
                      tabIndex={0}
                      className="h-11 w-full cursor-not-allowed rounded-sm border border-[#344C43]/20 bg-[#344C43]/5 pl-9 pr-24 font-mono text-[12px] text-[#344C43]/65 outline-none"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-sm border border-[#668B78]/45 bg-[#668B78]/10 px-2 py-1 font-mono text-[6.5px] font-bold uppercase tracking-[0.2em] text-[#4A695C]">
                      <BadgeCheck aria-hidden="true" className="size-3" strokeWidth={2.5} />
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="f-phone" className={cn(fieldLabel, "mb-1.5 block")}>Phone Number</Label>
                  <div className="relative">
                    <Phone aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]" strokeWidth={1.75} />
                    <Input
                      id="f-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      className={cn(wellField, "pl-9 font-mono")}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="f-location" className={cn(fieldLabel, "mb-1.5 block")}>Studio Area</Label>
                  <div className="relative">
                    <MapPin aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#668B78]" strokeWidth={1.75} />
                    <Input
                      id="f-location"
                      type="text"
                      defaultValue={PERSONA.location}
                      readOnly
                      aria-readonly="true"
                      className="h-11 w-full cursor-not-allowed rounded-sm border border-[#344C43]/20 bg-[#344C43]/5 pl-9 text-[13px] text-[#344C43]/65 outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="f-bio" className={cn(fieldLabel, "mb-1.5 block")}>Bio — Your Board Note</Label>
                  <textarea
                    id="f-bio"
                    rows={3}
                    value={form.bio}
                    onChange={set("bio")}
                    maxLength={220}
                    className="w-full resize-none rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] px-3 py-2.5 text-[13px] leading-relaxed text-[#344C43] outline-none transition-all placeholder:text-[#344C43]/35 hover:border-[#344C43]/45 focus:border-[#668B78] focus:bg-[#EFE7DC] focus:ring-2 focus:ring-[#668B78]/20"
                  />
                  <p className="mt-1.5 flex items-center justify-between font-mono text-[6.5px] uppercase tracking-[0.2em] text-[#344C43]/45">
                    <span>Scholars read this before they apply</span>
                    <span className="tabular-nums">{form.bio.length} / 220</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 02 — The Portrait */}
            <section aria-labelledby="portrait-heading" className="border border-[#344C43]/25 bg-[#EFE7DC] p-5 shadow-[5px_6px_0_rgba(52,76,67,0.13)] sm:p-6">
              <h2 id="portrait-heading" className="flex items-baseline justify-between gap-3 border-b border-[#344C43]/20 pb-2">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#B87959]">02</span>
                  <span className="identity-serif text-2xl font-black tracking-tight text-[#344C43]">The Portrait</span>
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#344C43]/55">Your face, on record</span>
              </h2>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Preview */}
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  {portraitRemoved ? (
                    <div className="flex size-32 flex-col items-center justify-center gap-1.5 rounded-full border-2 border-dashed border-[#A34343]/45 bg-[#A34343]/5 text-[#A34343] sm:size-36">
                      <ImageOff aria-hidden="true" className="size-6" strokeWidth={1.5} />
                      <span className="font-mono text-[6px] font-bold uppercase tracking-[0.2em]">Portrait torn</span>
                    </div>
                  ) : (
                    <div className="flex size-32 items-center justify-center rounded-full border-4 border-[#C98B6D]/60 bg-[#243630] shadow-[0_10px_28px_rgba(0,0,0,0.3)] sm:size-36">
                      <span className="identity-serif text-4xl font-black text-[#C98B6D] sm:text-5xl">{PERSONA.initials}</span>
                    </div>
                  )}
                  <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-[#EFE7DC] bg-[#668B78] text-[#F2ECDF]">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                </div>

                {/* Dropzone + buttons */}
                <div className="min-w-0 flex-1">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload portrait image (decorative in this preview)"
                    className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#344C43]/30 bg-[#F2ECDF] px-4 py-5 text-center transition-colors hover:border-[#668B78]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                  >
                    <Upload aria-hidden="true" className="size-6 text-[#668B78]" strokeWidth={1.75} />
                    <p className="font-mono text-[8px] font-bold uppercase leading-relaxed tracking-[0.2em] text-[#344C43]">
                      Drag portrait here<br />
                      <span className="font-medium text-[#344C43]/55">or browse files</span>
                    </p>
                    <p className="font-mono text-[6px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/45">
                      PNG · JPG · ≤ 5 MB · even lighting, facing the lamp
                    </p>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPortraitRemoved(false)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-[#344C43]/35 px-3 font-mono text-[7.5px] font-bold uppercase tracking-[0.2em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                    >
                      <Camera aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPortraitRemoved(true)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-[#A34343]/35 px-3 font-mono text-[7.5px] font-bold uppercase tracking-[0.2em] text-[#A34343] transition-all hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                    >
                      <ImageOff aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 03 — How the board sees you */}
            <section aria-labelledby="preview-heading" className="border border-[#344C43]/25 bg-[#EFE7DC] p-5 shadow-[5px_6px_0_rgba(52,76,67,0.13)] sm:p-6">
              <h2 id="preview-heading" className="flex items-baseline justify-between gap-3 border-b border-[#344C43]/20 pb-2">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#B87959]">03</span>
                  <span className="identity-serif text-2xl font-black tracking-tight text-[#344C43]">How The Board Sees You</span>
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#344C43]/55">Live preview</span>
              </h2>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-sm border border-[#344C43]/20 bg-[#F2ECDF] p-3">
                  <span
                    aria-hidden="true"
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#C98B6D]/55 bg-[#243630] font-mono text-sm font-bold text-[#C98B6D]"
                  >
                    {portraitRemoved ? "—" : PERSONA.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-bold tracking-tight text-[#344C43]">{form.name || "Unnamed Mentor"}</span>
                      <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[6px] uppercase tracking-[0.18em] text-[#B87959]">
                      HSC Physics · Verified · Tutor Pro
                    </span>
                    <span className="mt-1 line-clamp-2 text-[10.5px] leading-snug text-[#344C43]/70">
                      {form.bio || "—"}
                    </span>
                  </span>
                </div>
                <div className="shrink-0 border-l border-[#344C43]/15 pl-4 text-right">
                  <p className="font-mono text-[6px] uppercase tracking-[0.24em] text-[#344C43]/50">Member since</p>
                  <p className="mt-0.5 flex items-center justify-end gap-1.5 font-mono text-[9px] font-bold text-[#344C43]">
                    <CalendarDays aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                    {PERSONA.joined}
                  </p>
                  <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.24em] text-[#344C43]/50">Scholars guided</p>
                  <p className="mt-0.5 flex items-center justify-end gap-1.5 font-mono text-[9px] font-bold text-[#344C43]">
                    <NotebookPen aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                    {PERSONA.scholars}
                  </p>
                </div>
              </div>
            </section>

            {/* ── Save bar ── */}
            <div className="flex flex-col-reverse gap-2.5 border border-[#344C43]/25 bg-[#F2ECDF]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-1.5">
                {dirty && !savedFlash ? (
                  <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#B87959]/50 bg-[#B87959]/10 px-2.5 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#B87959]">
                    <span aria-hidden="true" className="size-2 rounded-full bg-[#B87959]" />
                    Unsaved changes on the desk
                  </span>
                ) : savedFlash ? (
                  <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#668B78]/50 bg-[#668B78]/10 px-2.5 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.22em] text-[#4A695C]">
                    <CheckCircle2 aria-hidden="true" className="size-3.5" strokeWidth={2} />
                    Saved to your desk
                  </span>
                ) : (
                  <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#344C43]/45">
                    Everything as the board left it
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#344C43]/30 px-4 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#344C43]/65 transition-all hover:border-[#A34343] hover:text-[#A34343] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                >
                  <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Cancel Changes
                </button>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty && !savedFlash}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-sm border px-6 font-mono text-[9px] font-bold uppercase tracking-[0.26em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                  savedFlash
                    ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]"
                    : dirty
                      ? "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] hover:-translate-y-0.5 hover:bg-[#C98B6D]"
                      : "cursor-not-allowed border-[#344C43]/15 bg-[#344C43]/5 text-[#344C43]/35"
                )}
              >
                {savedFlash ? (
                  <>
                    <CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2} />
                    Saved to Your Desk
                  </>
                ) : (
                  <>
                    <Save aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/tutor" backLabel="Back to the Register">
          <span className="inline-flex items-center gap-1.5">
            <House aria-hidden="true" className="size-3.5 text-[#B87959]" strokeWidth={2} />
            One identity, three doors — student, tutor, board
          </span>
        </Colophon>
      </div>
    </div>
  )
}
