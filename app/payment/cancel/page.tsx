"use client"

import Link from "next/link"
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  House,
  ShieldCheck,
  BadgeCheck,
  Wallet,
  Sparkles,
  Coffee,
  MessagesSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Static cancellation ledger (UI only — nothing was charged) ───────────────

const CANCELLATION = {
  plan: "Tutor Pro — Mentor's Guild",
  planShort: "Tutor Pro",
  amount: "$15.00",
  currency: "USD / month",
  status: "Cancelled",
  reference: "ch_3Qk8sL2eZvKYlo2C0mNtP9wQa",
  note: "No charge was made — the Stripe session expired before authorization.",
}

// ─── Scoped pause styles ─────────────────────────────────────────────────────

const pauseStyles = `
  .pause-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .pause-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes pause-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .pause-rise { animation: pause-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes pause-breathe {
    0%, 100% { opacity: 0.55; transform: scale(1); }
    50%      { opacity: 0.85; transform: scale(1.04); }
  }
  .pause-breathe { animation: pause-breathe 5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .pause-rise, .pause-breathe { animation: none !important; }
  }
`

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PaymentCancelPage() {
  return (
    <div className="pause-root relative min-h-screen bg-[#F2ECDF] text-[#344C43]">
      <style>{pauseStyles}</style>

      <main className="relative mx-auto max-w-[1180px] overflow-hidden">
        {/* Soft ambient bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 30% 12%, rgba(102,139,120,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 82% 88%, rgba(184,121,89,0.12) 0%, transparent 55%), radial-gradient(rgba(52,76,67,0.05) 1px, transparent 1.3px)",
            backgroundSize: "auto, auto, 26px 26px",
          }}
        />

        {/* ══ MASTHEAD — the door stays open ═══════════════════════════════ */}
        <section className="relative grid gap-10 border-b border-[#344C43]/25 px-4 pb-12 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-12">
          {/* The composition (left) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="pause-breathe relative flex size-52 shrink-0 items-center justify-center rounded-full border border-[#344C43]/20 bg-[#EFE7DC] sm:size-64">
              <div className="absolute inset-5 rounded-full border border-dashed border-[#668B78]/55" />
              <div className="flex size-28 flex-col items-center justify-center rounded-full border-2 border-[#10181A] bg-[#344C43] text-[#EFE7DC] shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:size-32">
                <Mail className="size-7 text-[#C9A25E] sm:size-9" strokeWidth={1.4} />
                <span className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
                  Unsealed
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#EFE7DC]/50">
                  No charge was made
                </span>
              </div>
            </div>
          </div>

          {/* Copy + ledger (right) */}
          <div className="relative lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.36em] text-[#B87959]">
              [ Checkout Paused — By You, Not By Us ]
            </p>
            <h1
              className="pause-rise pause-serif mt-3 font-black leading-[0.95] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.6vw, 4.5rem)" } as React.CSSProperties}
            >
              Your Journey
              <span className="block">
                <span className="italic text-[#668B78]">Doesn&rsquo;t End</span> Here.
              </span>
            </h1>
            <p className="pause-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#344C43]/80 sm:text-[15px]" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              The checkout was closed before any payment went through —
              no card was charged, no seat was reserved, and your Free plan
              remains exactly as it was. Everything you were about to unlock
              is still on the shelf, waiting for when you&rsquo;re ready.
            </p>
            {/* Status strip */}
            <div className="pause-rise mt-5 inline-flex flex-wrap items-center gap-2 rounded-sm border border-[#B87959]/40 bg-[#B87959]/8 px-3 py-2" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
              <span aria-hidden="true" className="size-2 rounded-full bg-[#B87959]" />
              <span className="font-mono text-[9px] font-bold uppercase leading-snug tracking-[0.22em] text-[#B87959]">
                Payment status — Cancelled · Nothing activated
              </span>
            </div>
          </div>
        </section>

        {/* ══ LEDGER — what just happened ══════════════════════════════════ */}
        <section aria-labelledby="ledger-heading" className="relative border-b border-[#344C43]/25 px-4 py-8 sm:px-8">
          <h2 id="ledger-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#344C43]/55">
            The Ledger — What the Board Recorded
          </h2>
          <dl className="mt-3 overflow-hidden rounded-sm border border-[#344C43]/30 bg-[#EFE7DC] shadow-[6px_7px_0_rgba(52,76,67,0.15)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#344C43]/15 bg-[#344C43] px-4 py-2.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
                Checkout Record
              </span>
              <span className="rounded-sm border border-[#B87959]/60 bg-[#B87959]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#C98B6D]">
                Cancelled
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3 sm:p-5">
              {[
                ["Selected Plan", CANCELLATION.plan],
                ["Subscription", "Monthly · auto-renew"],
                ["Intended Amount", `${CANCELLATION.amount} ${CANCELLATION.currency}`],
                ["Payment Status", "Cancelled — no charge"],
                ["Transaction", CANCELLATION.reference],
                ["Activation", "Not activated"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/50">{k}</dt>
                  <dd className="mt-0.5 font-mono text-[10px] font-bold leading-snug tracking-tight text-[#344C43]">{v}</dd>
                </div>
              ))}
            </div>
            <p className="border-t border-[#344C43]/15 px-4 py-3 text-[11px] leading-snug text-[#344C43]/75 sm:px-5">
              {CANCELLATION.note}
            </p>
          </dl>
        </section>

        {/* ══ GOOD TO KNOW — the calm facts ═══════════════════════════════ */}
        <section aria-labelledby="facts-heading" className="relative border-b border-[#344C43]/25 bg-[#EFE7DC]/60 px-4 py-8 sm:px-8">
          <h2 id="facts-heading" className="pause-serif text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
            Three facts, <span className="italic text-[#668B78]">zero worry.</span>
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                Icon: ShieldCheck,
                title: "Your account stays Free",
                body: "MentorLagbe keeps your Free plan exactly as it was — browse, apply and track applications like always.",
              },
              {
                Icon: BadgeCheck,
                title: "No ghost subscription",
                body: "Nothing was activated, nothing renews, nothing appears on any invoice — your ledger reads zero.",
              },
              {
                Icon: Sparkles,
                title: "Ready when you are",
                body: "Restart checkout whenever it suits you — menus, prices and seats all stay exactly as you left them.",
              },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="flex flex-col gap-2 border border-[#344C43]/20 bg-[#EFE7DC] p-5 shadow-[4px_5px_0_rgba(52,76,67,0.12)]">
                <span className="flex size-10 items-center justify-center rounded-sm border border-[#668B78]/35 bg-[#668B78]/10">
                  <Icon aria-hidden="true" className="size-5 text-[#4A695C]" strokeWidth={1.75} />
                </span>
                <span className="pause-serif text-base font-black leading-snug tracking-tight text-[#344C43]">{title}</span>
                <span className="text-[11px] leading-relaxed text-[#344C43]/70">{body}</span>
              </li>
            ))}
          </ul>
          {/* Support strip */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-[#344C43]/20 bg-[#F2ECDF] px-4 py-3">
            <p className="flex items-center gap-2.5 text-[12px] font-semibold leading-snug text-[#344C43]/90">
              <MessagesSquare aria-hidden="true" className="size-5 shrink-0 text-[#B87959]" strokeWidth={1.75} />
              Hit a snag with the payment itself? The Trust Office answers within one working day.
            </p>
            <a
              href="mailto:support@mentorlagbe.com"
              className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#B87959] underline decoration-[#B87959]/40 underline-offset-4 transition-colors hover:text-[#96603F]"
            >
              <Mail aria-hidden="true" className="size-3.5" strokeWidth={2} />
              support@mentorlagbe.com
            </a>
          </div>
        </section>

        {/* ══ WAYS FORWARD — recovery actions ══════════════════════════════ */}
        <section aria-labelledby="forward-heading" className="relative px-4 py-9 sm:px-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959]">
            [ Doors Left Open — Pick One ]
          </p>
          <h2 id="forward-heading" className="pause-serif mt-1.5 text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
            Where would you like to <span className="italic text-[#668B78]">go next?</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Wallet, title: "Try Again", desc: "Reopen the checkout exactly where you left off — seats and pricing held for you", href: "/pricing", cta: "Resume Checkout", tone: "primary" as const },
              { Icon: Sparkles, title: "Explore Pricing", desc: "Read the full guild ledger — student memberships, mentor memberships, everything included", href: "/pricing", cta: "View Plans", tone: "outline" as const },
              { Icon: LayoutDashboard, title: "Return to Dashboard", desc: "Back to your studio — applications, listings and your Pro upgrade path", href: "/dashboard/tutor", cta: "Go to Dashboard", tone: "outline" as const },
              { Icon: House, title: "Back to Home", desc: "Return to the atelier front page — browse featured batches and the community", href: "/", cta: "Go Home", tone: "ghost" as const },
            ].map(({ Icon, title, desc, href, cta, tone }) => (
              <Link
                key={title}
                href={href}
                className={cn(
                  "group flex h-full flex-col border p-5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                  tone === "primary"
                    ? "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[5px_6px_0_#344C43] hover:-translate-y-1 hover:shadow-[7px_9px_0_#344C43]"
                    : tone === "outline"
                      ? "border-[#344C43]/30 bg-[#EFE7DC]/60 text-[#344C43] hover:-translate-y-1 hover:border-[#344C43] hover:bg-[#EFE7DC]"
                      : "border-[#344C43]/20 bg-transparent text-[#344C43]/80 hover:-translate-y-1 hover:border-[#344C43]/45 hover:text-[#344C43]"
                )}
              >
                <span className={cn(
                  "flex size-10 items-center justify-center rounded-sm border",
                  tone === "primary" ? "border-[#1E3A2F]/30 bg-[#1E3A2F]/10" : "border-[#668B78]/35 bg-[#668B78]/10"
                )}>
                  <Icon aria-hidden="true" className={cn("size-5", tone === "primary" ? "text-[#1E3A2F]" : "text-[#4A695C]")} strokeWidth={1.75} />
                </span>
                <span className="pause-serif mt-3 text-lg font-black leading-snug tracking-tight">{title}</span>
                <span className="mt-1 text-[11px] leading-snug opacity-80">{desc}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 border-t border-current/20 pt-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em]">
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ Colophon ═══════════════════════════════════════════════════ */}
        <footer className="relative flex flex-col items-start justify-between gap-3 border-t border-[#344C43]/25 px-4 py-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#344C43]/50 sm:flex-row sm:items-center sm:px-8 sm:text-[10px]">
          <Link href="/" className="group inline-flex items-center gap-1.5 font-bold text-[#344C43] transition-colors hover:text-[#B87959]">
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to the Atelier
          </Link>
          <span className="inline-flex items-center gap-1.5">
            <Coffee aria-hidden="true" className="size-4 text-[#B87959]" strokeWidth={2} />
            No hurry — the guild keeps
          </span>
        </footer>
      </main>
    </div>
  )
}
