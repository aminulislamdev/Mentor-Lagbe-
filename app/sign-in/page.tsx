"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  MoonStar,
  Asterisk,
  ShieldCheck,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// ─── Static night-study copy ─────────────────────────────────────────────────

const DOSSIER_ROWS = [
  { label: "Batch", value: "HSC Physics · Fri & Sat, 6:00 PM" },
  { label: "Seat", value: "07 of 12 — held for you" },
  { label: "Pages sealed", value: "118 of 214" },
]

const MOTES: Array<{ left: string; top: string; size: number; delay: string; duration: string }> = [
  { left: "18%", top: "62%", size: 3, delay: "0s", duration: "9s" },
  { left: "28%", top: "78%", size: 2, delay: "2.2s", duration: "11s" },
  { left: "38%", top: "55%", size: 4, delay: "1.1s", duration: "10s" },
  { left: "48%", top: "84%", size: 2, delay: "3.4s", duration: "12s" },
  { left: "56%", top: "66%", size: 3, delay: "0.6s", duration: "9.5s" },
  { left: "65%", top: "80%", size: 2, delay: "4.1s", duration: "13s" },
]

// ─── Scoped night-study styles ───────────────────────────────────────────────

const studyStyles = `
  .study-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .study-outline {
    -webkit-text-stroke: 1.4px #EFE7DC;
    color: transparent;
  }

  .study-root ::selection { background: #C98B6D; color: #1A2823; }

  @keyframes study-lamp-breathe {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 0.9; }
  }
  .study-lamp { animation: study-lamp-breathe 6.5s ease-in-out infinite; }

  @keyframes study-mote-rise {
    0%   { opacity: 0; transform: translate3d(0, 0, 0); }
    15%  { opacity: 0.75; }
    70%  { opacity: 0.4; }
    100% { opacity: 0; transform: translate3d(1.5rem, -9rem, 0); }
  }
  .study-mote { animation: study-mote-rise linear infinite; }

  @keyframes study-bookmark-sway {
    from { transform: rotate(0.8deg); }
    to   { transform: rotate(-0.8deg); }
  }
  .study-bookmark {
    transform-origin: top center;
    animation: study-bookmark-sway 7s ease-in-out infinite alternate;
  }

  @keyframes study-glow-pulse {
    0%, 100% { box-shadow: 0 0 26px 2px rgba(184, 121, 89, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4); }
    50%      { box-shadow: 0 0 40px 6px rgba(184, 121, 89, 0.5), 0 6px 18px rgba(0, 0, 0, 0.4); }
  }
  .study-cta-glow { animation: study-glow-pulse 4.5s ease-in-out infinite; }

  @keyframes study-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .study-rise { animation: study-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @media (prefers-reduced-motion: reduce) {
    .study-lamp, .study-mote, .study-bookmark, .study-cta-glow, .study-rise { animation: none !important; }
  }
`

// ─── Deep-inset well input (night desk control) ──────────────────────────────

const wellInput =
  "h-12 rounded-md border border-[#D9CBB5]/12 bg-[#1E2E29]/80 pl-11 pr-11 text-[15px] text-[#EFE7DC] placeholder:text-[#EFE7DC]/30 shadow-[inset_0_2px_7px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-[#D9CBB5]/20 focus:border-[#C98B6D]/60 focus:bg-[#22332C] focus:shadow-[inset_0_2px_7px_rgba(0,0,0,0.45),0_0_24px_rgba(184,121,89,0.16)] focus:ring-2 focus:ring-[#C98B6D]/15 dark:border-[#D9CBB5]/12 dark:bg-[#1E2E29]/80 dark:text-[#EFE7DC]"

// ─── Password field with visibility toggle ───────────────────────────────────

function PasswordWell({
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
      <Lock
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#C98B6D]/70"
        strokeWidth={1.75}
      />
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Your passphrase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        className={wellInput}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#EFE7DC]/40 transition-colors hover:text-[#EFE7DC]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

// ─── The Bookmark — "your place is held" ─────────────────────────────────────

function HangingBookmark() {
  return (
    <div
      aria-hidden="true"
      className="study-bookmark pointer-events-none absolute right-2 top-0 z-0 hidden select-none sm:block lg:right-6"
    >
      <div
        className="relative flex h-56 w-14 flex-col items-center justify-between pb-9 pt-6 lg:h-72 lg:w-[4.5rem]"
        style={{
          background: "linear-gradient(175deg, #CE9163 0%, #B87959 42%, #96603F 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          boxShadow: "0 24px 44px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(239,231,220,0.25)",
        }}
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.34em] text-[#1A2823]/70">
          ML
        </span>
        <span
          className="study-serif text-lg font-black italic leading-none text-[#EFE7DC]/90 lg:text-2xl"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          keep your place
        </span>
        <span className="flex size-5 items-center justify-center rounded-full border border-[#EFE7DC]/50 lg:size-6">
          <Asterisk className="size-3 text-[#EFE7DC]/85" strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}

// ─── Photo-corner bracket for the form (your place, held) ────────────────────

function CornerTick({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-6 border-[#C98B6D] transition-transform duration-500",
        className
      )}
    />
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SignInPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  })

  const set = (field: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Static UI only — the lamp accepts no credentials yet.
  }

  return (
    <div
      className="study-root relative overflow-hidden bg-[#16241F] text-[#EFE7DC]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 55% at 72% -10%, rgba(201,139,109,0.22) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 12% 112%, rgba(102,139,120,0.16) 0%, transparent 55%), radial-gradient(rgba(217,203,181,0.05) 1px, transparent 1.4px)",
        backgroundSize: "auto, auto, 26px 26px",
      }}
    >
      <style>{studyStyles}</style>

      {/* Lamp glow — the one warm source in the room */}
      <div
        aria-hidden="true"
        className="study-lamp pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,164,110,0.22) 0%, rgba(201,139,109,0.07) 38%, transparent 70%)",
        }}
      />

      {/* Drifting dust motes in the light */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="study-mote pointer-events-none absolute rounded-full bg-[#E8DFD0]"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            opacity: 0,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}

      {/* ══ Night ribbon — sibling strip to the charter ═══════════════════ */}
      <div className="relative border-b border-[#D9CBB5]/12">
        <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between gap-4 px-4 font-mono text-[8px] uppercase tracking-[0.28em] text-[#EFE7DC]/55 sm:px-8 sm:text-[9px]">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <MoonStar className="size-3 text-[#C98B6D]" strokeWidth={2} />
            MentorLagbe · The Night Study
          </span>
          <span className="hidden md:inline">Dhaka — Est. 2026</span>
          <span className="whitespace-nowrap">Folio Nº ML-REG-002</span>
        </div>
      </div>

      <main className="relative mx-auto max-w-[1500px]">
        <div className="relative grid lg:grid-cols-12">
          {/* ══ LEFT — The room (masthead & memory) ═══════════════════════ */}
          <section
            aria-labelledby="night-study-heading"
            className="relative overflow-hidden border-b border-[#D9CBB5]/12 px-4 pb-10 pt-10 sm:px-8 sm:pt-14 lg:col-span-7 lg:border-b-0 lg:border-r lg:px-12 lg:pb-16 lg:pt-16 xl:px-16"
          >
            {/* Vertical rail text */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 select-none font-mono text-[8px] uppercase tracking-[0.5em] text-[#EFE7DC]/22 xl:block"
              style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
            >
              Est. MMXXVI — The Reading Room for Returning Minds
            </span>

            <HangingBookmark />

            <div className="relative max-w-xl">
              {/* Eyebrow */}
              <p className="study-rise font-mono text-[9px] uppercase tracking-[0.32em] text-[#C98B6D] sm:text-[10px]" style={{ "--rise-delay": "0s" } as React.CSSProperties}>
                [ The Night Study — Returning Dossier ]
              </p>

              {/* Headline */}
              <h1
                id="night-study-heading"
                className="study-rise study-serif mt-5 font-black italic leading-[0.98] tracking-[-0.03em]"
                style={{ "--rise-delay": "0.08s", fontSize: "clamp(3rem, 9.5vw, 6.75rem)" } as React.CSSProperties}
              >
                <span className="block text-[#EFE7DC]">The lamp</span>
                <span className="study-outline block">
                  is still on<span className="text-[#C98B6D]" style={{ WebkitTextStroke: "0" }}>.</span>
                </span>
              </h1>

              {/* Aside */}
              <div className="study-rise mt-4 flex items-center gap-3" style={{ "--rise-delay": "0.16s" } as React.CSSProperties}>
                <svg width="40" height="16" viewBox="0 0 40 16" fill="none" aria-hidden="true" className="shrink-0 text-[#C98B6D]">
                  <path d="M2 10C10 4 20 2 31 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 3.5" />
                  <path d="M27 1.5 32.5 5 27 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-[#EFE7DC]/50 sm:text-[9px]">
                  and so are you, scholar
                </p>
              </div>

              {/* Manifesto */}
              <p className="study-rise mt-6 max-w-[46ch] text-sm leading-relaxed text-[#EFE7DC]/75 sm:text-[15px]" style={{ "--rise-delay": "0.22s" } as React.CSSProperties}>
                Every scholar keeps a place here. Your batch, your seat, and your
                hard-won margin notes are exactly where you left them — the
                question is only whether you picked up the pen.
              </p>

              {/* Dossier status ledger — "your place is held" */}
              <dl className="study-rise mt-8 max-w-md border border-[#D9CBB5]/12 bg-[#1E2E29]/45 backdrop-blur-[2px]" style={{ "--rise-delay": "0.3s" } as React.CSSProperties}>
                <div className="flex items-center justify-between gap-4 border-b border-[#D9CBB5]/12 px-4 py-2.5">
                  <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#C98B6D]">
                    Dossier — Standing
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.24em] text-[#EFE7DC]/40">
                    <span className="inline-block size-1.5 rounded-full bg-[#668B78]" />
                    Saved
                  </span>
                </div>
                {DOSSIER_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 border-b border-[#D9CBB5]/10 px-4 py-2 last:border-b-0"
                  >
                    <dt className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#EFE7DC]/42">
                      {row.label}
                    </dt>
                    <dd className="text-[12px] font-medium tracking-tight text-[#EFE7DC]/90">
                      {row.value}
                    </dd>
                  </div>
                ))}
                <div className="px-4 py-3" aria-hidden="true">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[#EFE7DC]/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#668B78] via-[#C98B6D] to-[#B87959]"
                      style={{ width: "55%" }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono text-[7px] uppercase tracking-[0.22em] text-[#EFE7DC]/35">
                    <span>Chapter — Integration by Parts</span>
                    <span>55%</span>
                  </div>
                </div>
              </dl>

              {/* House maxim */}
              <blockquote className="study-rise mt-8 hidden max-w-sm border-l-2 border-[#C98B6D]/45 pl-4 sm:block" style={{ "--rise-delay": "0.38s" } as React.CSSProperties}>
                <p className="study-serif text-[15px] italic leading-snug text-[#EFE7DC]/70">
                  “The pen remembers. The page keeps. The study waits.”
                </p>
                <cite className="mt-1.5 block font-mono text-[8px] uppercase not-italic tracking-[0.24em] text-[#EFE7DC]/38">
                  — The House Maxim, Night Study
                </cite>
              </blockquote>
            </div>
          </section>

          {/* ══ RIGHT — The check-in desk (form) ══════════════════════════ */}
          <section
            aria-labelledby="checkin-heading"
            className="relative flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:col-span-5 lg:px-10 lg:py-20 xl:px-14"
          >
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
              {/* Desk marker */}
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#C98B6D] sm:text-[10px]">
                [ The Check-In Desk ]
              </p>
              <h2
                id="checkin-heading"
                className="study-serif mt-3 text-4xl font-black tracking-tight text-[#EFE7DC] sm:text-5xl"
              >
                Welcome <span className="italic text-[#C98B6D]">back.</span>
              </h2>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.28em] text-[#EFE7DC]/45 sm:text-[9px]">
                Enter your credentials to resume your seat
              </p>

              {/* The desk plate — held by photo corners */}
              <div className="relative mt-6 border border-[#D9CBB5]/12 bg-[#1C2B25]/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(0,0,0,0.55),0_0_40px_rgba(201,139,109,0.08)] sm:p-7">
                <CornerTick className="left-2 top-2 border-l-2 border-t-2" />
                <CornerTick className="right-2 top-2 border-r-2 border-t-2" />
                <CornerTick className="bottom-2 left-2 border-b-2 border-l-2" />
                <CornerTick className="bottom-2 right-2 border-b-2 border-r-2" />

                {/* Express lane */}
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-[#D9CBB5]/16 bg-[#EFE7DC]/[0.04] font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#EFE7DC] transition-all duration-200 hover:border-[#C98B6D]/45 hover:bg-[#EFE7DC]/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
                >
                  <Globe className="size-4 text-[#7AA890]" strokeWidth={1.75} />
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-4" aria-hidden="true">
                  <span className="h-px flex-1 bg-[#D9CBB5]/12" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#EFE7DC]/38">
                    or resume by hand
                  </span>
                  <span className="h-px flex-1 bg-[#D9CBB5]/12" />
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Email well */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#EFE7DC]/60"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#C98B6D]/70"
                        strokeWidth={1.75}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set("email")(e.target.value)}
                        autoComplete="email"
                        className={wellInput}
                      />
                    </div>
                  </div>

                  {/* Password well + forgot */}
                  <div>
                    <div className="flex items-end justify-between gap-3">
                      <Label
                        htmlFor="password"
                        className="text-[#EFE7DC]/60"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C98B6D]/80 underline decoration-[#C98B6D]/35 underline-offset-4 transition-colors hover:text-[#E0A57E] hover:decoration-[#E0A57E]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <PasswordWell
                      id="password"
                      value={form.password}
                      onChange={(v) => set("password")(v)}
                    />
                  </div>

                  {/* Keep the lamp lit */}
                  <div className="flex items-center justify-between gap-4 border-t border-[#D9CBB5]/10 pt-4">
                    <Checkbox
                      id="remember-me"
                      checked={form.remember}
                      onCheckedChange={(v) => set("remember")(v === true)}
                      label={
                        <span className="text-[#EFE7DC]/70">
                          Keep the lamp lit on this device
                        </span>
                      }
                    />
                    <span className="hidden font-mono text-[7px] uppercase tracking-[0.24em] text-[#EFE7DC]/30 sm:inline">
                      30 days
                    </span>
                  </div>

                  {/* Resume CTA */}
                  <button
                    type="submit"
                    className={cn(
                      "study-cta-glow group flex h-13 w-full items-center justify-center gap-3 rounded-md bg-[#B87959] py-4",
                      "font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-[#1A2823]",
                      "transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C98B6D] active:translate-y-0 active:bg-[#A6683F]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C98B6D]"
                    )}
                  >
                    Return to the Study
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={2.25} />
                  </button>
                </form>

                {/* Trust line */}
                <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[7px] uppercase tracking-[0.24em] text-[#EFE7DC]/35 sm:text-[8px]">
                  <ShieldCheck className="size-3.5 text-[#7AA890]" strokeWidth={2} />
                  Private &amp; encrypted — MentorLagbe Trust Office
                </p>
              </div>

              {/* Re-enrollment path */}
              <p className="mt-6 text-center text-sm text-[#EFE7DC]/60 lg:text-left">
                New to the atelier?{" "}
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-1.5 font-semibold text-[#EFE7DC] underline decoration-[#B87959] decoration-2 underline-offset-4 transition-colors hover:text-[#E0A57E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
                >
                  Request enrollment
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </p>
            </div>
          </section>
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <footer className="flex flex-col items-start justify-between gap-3 border-t border-[#D9CBB5]/12 px-4 py-5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.26em] text-[#EFE7DC]/45 sm:flex-row sm:items-center sm:px-8 sm:text-[9px]">
          <p>
            {["Your notes, synced", "Your seat, saved", "Your batch, waiting"].map((feat) => (
              <span key={feat} className="mr-4 inline-flex items-center gap-1.5">
                <Asterisk className="size-3 text-[#C98B6D]" strokeWidth={2.5} />
                {feat}
              </span>
            ))}
          </p>
          <p className="text-[#EFE7DC]/32">© MMXXVI MentorLagbe · The Night Study</p>
        </footer>
      </main>
    </div>
  )
}
