"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ArrowRight,
  Crown,
  ArrowLeft,
  BookOpenCheck,
  LayoutDashboard,
  GraduationCap,
  NotebookPen,
  House,
  Receipt,
  Printer,
  ShieldCheck,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CopyField } from "@/components/dashboard/shared"

// ─── Static confirmation data ─────────────────────────────────────────────────

const CONFIRMATION = {
  customer: "Dr. Nasrin Islam",
  email: "nasrin@mentorlagbe.com",
  plan: "Tutor Pro — Mentor's Guild",
  planShort: "Tutor Pro",
  amount: "$15.00",
  currency: "USD / month",
  status: "Paid",
  transactionId: "ch_3Qk8sL2eZvKYlo2C0mNtP9wQa",
  date: "19 Nov ’26 · 14:22 (GMT+6)",
  method: "Stripe",
  card: "Visa •••• 4242",
  invoice: "INV-ML-2042-0001",
}

const BENEFITS: Record<"tutor" | "student", { title: string; items: string[] }> = {
  tutor: {
    title: "Tutor Pro — Mentor's Guild",
    items: [
      "Unlimited tuition listings — publish as many batches as your calendar holds",
      "Gold Pro Tutor seal next to your name on every listing and dossier",
      "Featured placement on the Browse Tuitions index and home discovery",
      "Applicant CRM console with notes, schedules and one-tap status updates",
      "Stripe invoicing, payout reports and direct index ranking priority",
    ],
  },
  student: {
    title: "Student Pro — Scholar's Ledger",
    items: [
      "Priority #1 placement in tutor review queues — read first, always",
      "Verified Scholar badge on every application you submit",
      "Early-access desk for opening cohorts before they hit the public index",
      "Application ledger audit with full status history and tutor notes",
      "Priority advisory channel and expedited batch-seat confirmation",
    ],
  },
}

const NEXT_STEPS: Record<"tutor" | "student", Array<{ Icon: typeof LayoutDashboard; title: string; desc: string; href: string; cta: string }>> = {
  tutor: [
    { Icon: NotebookPen, title: "Post a Tuition", desc: "Your Studio is open — put your first Pro batch on the board", href: "/dashboard/tutor/post-tuition", cta: "Open the Desk" },
    { Icon: BookOpenCheck, title: "Featured Placement", desc: "Your listing jumps the index queue — scholars see it first", href: "/tuitions", cta: "See Your Reach" },
  ],
  student: [
    { Icon: BookOpenCheck, title: "Explore Tuitions", desc: "Pro members see cohorts 48 hours before the public index", href: "/tuitions", cta: "Browse Tuitions" },
    { Icon: GraduationCap, title: "Your Scholar Badge", desc: "Verified Scholar seal is live on every application you send", href: "/dashboard/student", cta: "See Your Badge" },
  ],
}

// ─── Scoped ceremony styles ──────────────────────────────────────────────────

const ceremonyStyles = `
  .ceremony-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .ceremony-root ::selection { background: #C9A25E; color: #10181A; }

  @keyframes ceremony-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .ceremony-rise { animation: ceremony-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes ceremony-seal-pop {
    0%   { opacity: 0; transform: scale(1.7) rotate(-14deg); }
    55%  { opacity: 1; transform: scale(0.92) rotate(-9deg); }
    100% { opacity: 1; transform: scale(1) rotate(-11deg); }
  }
  .ceremony-seal { animation: ceremony-seal-pop 0.6s cubic-bezier(0.2, 1.4, 0.35, 1) both; animation-delay: 0.45s; }

  @keyframes ceremony-orbit {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .ceremony-orbit { animation: ceremony-orbit 30s linear infinite; }

  @keyframes ceremony-glow {
    0%, 100% { box-shadow: 0 0 40px 6px rgba(201, 162, 94, 0.28), 0 24px 60px rgba(0,0,0,0.4); }
    50%      { box-shadow: 0 0 72px 14px rgba(201, 162, 94, 0.4), 0 24px 60px rgba(0,0,0,0.4); }
  }
  .ceremony-glow { animation: ceremony-glow 4.5s ease-in-out infinite; }

  @keyframes ceremony-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .ceremony-ticker { animation: ceremony-ticker 46s linear infinite; }

  @media (prefers-reduced-motion: reduce) {
    .ceremony-rise, .ceremony-seal, .ceremony-orbit, .ceremony-glow, .ceremony-ticker { animation: none !important; }
  }
`

const TICKER = [
  "MEMBERSHIP SEALED",
  "INVOICE ML-2042-0001",
  "PAYMENT VERIFIED — STRIPE",
  "PRO GUILD — WELCOME",
  "UNLIMITED LISTINGS",
  "VERIFIED SEAL ACTIVE",
]

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PaymentSuccessPage() {
  const [role, setRole] = useState<"tutor" | "student">("tutor")

  const benefits = BENEFITS[role]
  const nextSteps = NEXT_STEPS[role]

  return (
    <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
      <style>{ceremonyStyles}</style>

      {/* ══ TICKER TAPE ══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#C9A25E]/25 bg-[#10181A] py-1.5" aria-hidden="true">
        <div className="ceremony-ticker flex w-max whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#C9A25E]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <main className="relative mx-auto max-w-[1280px] overflow-hidden">
        {/* Ambient glow backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 55% at 28% 38%, rgba(216,201,163,0.16) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 78% 62%, rgba(184,121,89,0.12) 0%, transparent 55%), radial-gradient(rgba(242,237,223,0.04) 1px, transparent 1.4px)",
            backgroundSize: "auto, auto, 24px 24px",
          }}
        />

        {/* ══ HERO — seal + headline ════════════════════════════════════ */}
        <section className="relative grid gap-8 border-b border-[#F2EDDF]/10 px-4 pb-10 pt-12 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-14">
          {/* Seal composition (left) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="ceremony-glow relative flex size-56 shrink-0 items-center justify-center rounded-full border border-[#C9A25E]/45 bg-[#1E2A24] sm:size-72">
              {/* Orbiting ring text */}
              <svg viewBox="0 0 200 200" className="ceremony-orbit absolute inset-0 size-full text-[#C9A25E]/70" aria-hidden="true">
                <defs>
                  <path id="seal-circle" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                </defs>
                <text className="fill-current font-mono" style={{ fontSize: "10px", letterSpacing: "2.6px", textTransform: "uppercase" }}>
                  <textPath href="#seal-circle">
                    MentorLagbe · Pro Guild · Sealed · MMXXVI · MentorLagbe · Pro Guild ·
                  </textPath>
                </text>
              </svg>
              {/* Inner seal */}
              <div className="ceremony-seal relative flex size-32 flex-col items-center justify-center rounded-full border-2 border-[#C9A25E]/70 sm:size-40">
                <Crown className="size-7 text-[#C9A25E] sm:size-9" strokeWidth={1.5} />
                <span className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3] sm:text-[10px]">
                  MentorLagbe
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#C9A25E]/80 sm:text-[10px]">
                  Pro Guild
                </span>
              </div>
            </div>
          </div>

          {/* Copy + receipt (right) */}
          <div className="relative lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.36em] text-[#C9A25E]">
              [ Payment Confirmed — Stripe Dispatch ]
            </p>
            <h1
              className="ceremony-rise ceremony-serif mt-3 font-black leading-[0.95] tracking-[-0.035em] text-[#F2EDDF]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.4vw, 4rem)" } as React.CSSProperties}
            >
              You&rsquo;re Now
              <span className="block">
                Part of <span className="italic text-[#C9A25E]">MentorLagbe</span>
              </span>
              <span className="block text-[#F2EDDF]/95">Pro!<span aria-hidden="true" className="text-[#B87959]">.</span></span>
            </h1>
            <p className="ceremony-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/72 sm:text-[15px]" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              The seal is affixed and your guild seat is live. Every Pro
              benefit is active immediately — your invoice is on its way to
              <span className="font-semibold text-[#F2EDDF]"> {CONFIRMATION.email}</span>.
            </p>

            {/* Premium membership badge */}
            <div className="ceremony-rise mt-5 inline-flex items-center gap-3 rounded-sm border border-[#C9A25E]/45 bg-[#C9A25E]/10 py-2 pl-3 pr-4" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
              <Crown aria-hidden="true" className="size-6 text-[#C9A25E]" strokeWidth={1.6} />
              <span>
                <span className="block font-mono text-[10px] uppercase leading-snug tracking-[0.28em] text-[#C9A25E]">
                  Pro Membership
                </span>
                <span className="block font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-[#F2EDDF]">
                  {CONFIRMATION.plan}
                </span>
              </span>
            </div>

            {/* Receipt — the ledger */}
            <dl aria-label="Payment receipt" className="ceremony-rise mt-6 border border-[#F2EDDF]/18 bg-[#1E2A24]/70 p-4 backdrop-blur-sm sm:p-5" style={{ "--rise-delay": "0.26s" } as React.CSSProperties}>
              <div className="flex items-center justify-between gap-3 border-b border-[#F2EDDF]/12 pb-3">
                <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
                  <Receipt aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Payment Receipt
                </span>
                <span className="rounded-sm border border-[#7AA890]/55 bg-[#668B78]/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#9DBFA9]">
                  Paid
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
                {[
                  ["Customer", CONFIRMATION.customer],
                  ["Membership", CONFIRMATION.planShort],
                  ["Amount", `${CONFIRMATION.amount} ${CONFIRMATION.currency}`],
                  ["Payment Date", CONFIRMATION.date],
                  ["Method", `${CONFIRMATION.method} · ${CONFIRMATION.card}`],
                  ["Invoice", CONFIRMATION.invoice],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#F2EDDF]/45">{k}</dt>
                    <dd className="mt-0.5 font-mono text-[10px] font-bold leading-snug tracking-tight text-[#F2EDDF]">{v}</dd>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-[#F2EDDF]/12 pt-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#F2EDDF]/45">
                  Transaction Reference
                </p>
                <CopyField
                  value={CONFIRMATION.transactionId}
                  label="Transaction ID"
                  className="mt-1"
                />
              </div>
            </dl>
          </div>
        </section>

        {/* ══ YOUR GUILD BENEFITS (role toggle) ══════════════════════════ */}
        <section aria-labelledby="benefits-heading" className="relative border-b border-[#F2EDDF]/10 px-4 py-8 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="benefits-heading" className="ceremony-serif text-2xl font-black tracking-tight text-[#F2EDDF] sm:text-3xl">
              Your Guild <span className="italic text-[#C9A25E]">Benefits.</span>
            </h2>
            {/* Role toggle */}
            <div role="group" aria-label="View benefits as" className="flex rounded-sm border border-[#F2EDDF]/20">
              {(["tutor", "student"] as const).map((r) => {
                const active = role === r
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex h-10 items-center gap-1.5 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C9A25E]",
                      active ? "bg-[#C9A25E] text-[#10181A]" : "text-[#F2EDDF]/55 hover:text-[#F2EDDF]"
                    )}
                  >
                    {r === "tutor" ? <BookOpenCheck aria-hidden="true" className="size-4" strokeWidth={1.75} /> : <GraduationCap aria-hidden="true" className="size-4" strokeWidth={1.75} />}
                    {r === "tutor" ? "Tutor Pro" : "Student Pro"}
                  </button>
                )
              })}
            </div>
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-[#F2EDDF]/40">
            {benefits.title} — active now
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border border-[#F2EDDF]/14 bg-[#1E2A24]/60 p-3 text-[11px] leading-snug text-[#F2EDDF]/80 transition-colors hover:border-[#C9A25E]/35"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C9A25E]" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ NEXT STEPS — onboarding ═══════════════════════════════════ */}
        <section aria-labelledby="next-heading" className="relative px-4 py-8 sm:px-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#C9A25E]">
            [ Where to Next — The First Forty-Eight Hours ]
          </p>
          <h2 id="next-heading" className="ceremony-serif mt-1.5 text-2xl font-black tracking-tight text-[#F2EDDF] sm:text-3xl">
            Two doors, one <span className="italic text-[#C9A25E]">guild.</span>
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Role-specific tiles */}
            {nextSteps.map(({ Icon, title, desc, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 hover:shadow-[6px_8px_0_rgba(201,162,94,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
              >
                <span className="flex size-10 items-center justify-center rounded-sm border border-[#C9A25E]/40 bg-[#C9A25E]/10">
                  <Icon aria-hidden="true" className="size-5 text-[#C9A25E]" strokeWidth={1.75} />
                </span>
                <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF]">
                  {title}
                </span>
                <span className="mt-1 text-[10.5px] leading-snug text-[#F2EDDF]/60">{desc}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#C9A25E]">
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
              </Link>
            ))}

            {/* Shared tiles */}
            <Link
              href="/dashboard/tutor"
              className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
            >
              <span className="flex size-10 items-center justify-center rounded-sm border border-[#7AA890]/40 bg-[#668B78]/10">
                <LayoutDashboard aria-hidden="true" className="size-5 text-[#9DBFA9]" strokeWidth={1.75} />
              </span>
              <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF]">Visit Dashboard</span>
              <span className="mt-1 text-[10.5px] leading-snug text-[#F2EDDF]/60">Your register, your queue, your plan — one desk</span>
              <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#9DBFA9]">
                Go to Dashboard
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              href="/"
              className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
            >
              <span className="flex size-10 items-center justify-center rounded-sm border border-[#F2EDDF]/18 bg-[#F2EDDF]/5">
                <House aria-hidden="true" className="size-5 text-[#EDE8DA]/80" strokeWidth={1.75} />
              </span>
              <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF]">Return to Home</span>
              <span className="mt-1 text-[10.5px] leading-snug text-[#F2EDDF]/60">Back to the atelier — your Pro badge travels with you</span>
              <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#EDE8DA]/70">
                Back Home
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </section>

        {/* ══ Colophon ═══════════════════════════════════════════════════ */}
        <footer className="relative flex flex-col items-start justify-between gap-3 border-t border-[#F2EDDF]/12 px-4 py-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#F2EDDF]/45 sm:flex-row sm:items-center sm:px-8 sm:text-[10px]">
          <Link href="/" className="group inline-flex items-center gap-1.5 font-bold text-[#F2EDDF] transition-colors hover:text-[#C9A25E]">
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to the Atelier
          </Link>
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-[#C9A25E]" strokeWidth={2} />
              256-bit Stripe · PCI-DSS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star aria-hidden="true" className="size-3.5 fill-[#C9A25E] text-[#C9A25E]" strokeWidth={1.5} />
              4.9 · 1,240 member reviews
            </span>
          </span>
          <a
            href="/dashboard/tutor/settings"
            aria-label="Manage your subscription (opens settings)"
            className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-[#F2EDDF]/20 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F2EDDF]/60 transition-colors hover:bg-[#F2EDDF]/8 hover:text-[#F2EDDF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
          >
            <Printer aria-hidden="true" className="size-3.5" strokeWidth={2} />
            Print Receipt
          </a>
        </footer>
      </main>
    </div>
  )
}
