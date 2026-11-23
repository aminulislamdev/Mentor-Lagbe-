"use client"

import { Suspense, useEffect, useState } from "react"
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
  Loader2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CopyField } from "@/components/dashboard/shared"
import { useSearchParams } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api"

// ─── Benefits + next steps ───────────────────────────────────────────────────

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
  "PAYMENT VERIFIED — STRIPE",
  "PRO GUILD — WELCOME",
  "UNLIMITED LISTINGS",
  "VERIFIED SEAL ACTIVE",
]

// ─── Main Content Component ──────────────────────────────────────────────────

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id") || ""

  const [payment, setPayment] = useState<{
    stripeSessionId: string
    status: string
    payment_status: string
    amount_total: number
    currency: string
    customer_email: string | null
    plan: string | null
    role: string | null
    payment_intent: string | null
  } | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    apiFetch<{
      stripeSessionId: string
      status: string
      payment_status: string
      amount_total: number
      currency: string
      customer_email: string | null
      plan: string | null
      role: string | null
      payment_intent: string | null
    }>(`/api/payments/session/${sessionId}`, { method: "GET", auth: true })
      .then((data) => {
        setPayment(data.data)
        setPaymentError(null)
      })
      .catch((cause) => {
        if (cause instanceof ApiError) {
          setPaymentError(cause.message)
        } else {
          setPaymentError("Could not verify the payment session.")
        }
      })
  }, [sessionId])

  const paymentLoading = sessionId && !payment && !paymentError
  const isPaid = payment?.payment_status === "paid"

  const role = (payment?.role === "tutor" ? "tutor" : "student") as "tutor" | "student"
  const benefits = BENEFITS[role]
  const nextSteps = NEXT_STEPS[role]

  if (!sessionId) {
    return (
      <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
        <style>{ceremonyStyles}</style>

        <main className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-20">
          <Loader2 className="mb-4 size-10 animate-spin text-[#C9A25E]" />
          <h1 className="ceremony-serif mt-4 text-center text-3xl font-black leading-[0.95] tracking-tight text-[#F2EDDF] sm:text-4xl">
            Payment session not found
          </h1>
          <p className="mt-3 max-w-[42ch] text-center text-sm leading-relaxed text-[#F2EDDF]/70 sm:text-base">
            No session ID was provided in the URL. Please return to pricing and try again.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-sm border border-[#C9A25E]/60 bg-[#C9A25E] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A2F] transition-colors hover:bg-[#E0A57E]"
          >
            Return to Pricing
            <ArrowRight className="size-4" strokeWidth={2.5} />
          </Link>
        </main>
      </div>
    )
  }

  if (paymentLoading) {
    return (
      <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
        <style>{ceremonyStyles}</style>

        <main className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-20">
          <Loader2 className="mb-4 size-10 animate-spin text-[#C9A25E]" />
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A25E] sm:text-xs">
            Verifying your payment with Stripe…
          </p>
        </main>
      </div>
    )
  }

  if (paymentError) {
    return (
      <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
        <style>{ceremonyStyles}</style>

        <main className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-20">
          <ShieldCheck className="mb-4 size-12 text-[#E0A57E]" />
          <h1 className="ceremony-serif mt-4 text-center text-3xl font-black leading-[0.95] tracking-tight text-[#F2EDDF] sm:text-4xl">
            Payment verification failed
          </h1>
          <p className="mt-3 max-w-[42ch] text-center text-sm leading-relaxed text-[#F2EDDF]/70 sm:text-base">
            {paymentError}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-sm border border-[#C9A25E]/60 bg-[#C9A25E] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A2F] transition-colors hover:bg-[#E0A57E]"
            >
              Try Again
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-sm border border-[#F2EDDF]/20 bg-transparent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F2EDDF] transition-colors hover:bg-[#F2EDDF]/10"
            >
              Go to Dashboard
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (!isPaid) {
    return (
      <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
        <style>{ceremonyStyles}</style>

        <main className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-20">
          <RefreshCw className="mb-4 size-12 text-[#E0A57E]" />
          <h1 className="ceremony-serif mt-4 text-center text-3xl font-black leading-[0.95] tracking-tight text-[#F2EDDF] sm:text-4xl">
            Payment not completed
          </h1>
          <p className="mt-3 max-w-[42ch] text-center text-sm leading-relaxed text-[#F2EDDF]/70 sm:text-base">
            Your checkout session exists but the payment was not completed. No
            subscription was activated.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-sm border border-[#C9A25E]/60 bg-[#C9A25E] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A2F] transition-colors hover:bg-[#E0A57E]"
            >
              Try Again
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-sm border border-[#F2EDDF]/20 bg-transparent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F2EDDF] transition-colors hover:bg-[#F2EDDF]/10"
            >
              Go to Dashboard
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const amount = (payment.amount_total / 100).toFixed(2)
  const formattedDate = payment.payment_intent
    ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

  return (
    <div className="ceremony-root relative min-h-screen bg-[#1A1F1B] text-[#F2EDDF]">
      <style>{ceremonyStyles}</style>

      {/* ══ TICKER TAPE ═══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#C9A25E]/25 bg-[#10181A] py-2" aria-hidden="true">
        <div className="ceremony-ticker flex w-max whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#D8C9A3] sm:text-[11px]">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#C9A25E]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <main className="relative mx-auto max-w-7xl overflow-hidden">
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

        {/* ══ HERO — seal + headline ═════════════════════════════════════ */}
        <section className="relative grid gap-10 border-b border-[#F2EDDF]/10 px-5 pb-12 pt-12 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-16">
          {/* Seal composition */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="ceremony-glow relative flex size-52 shrink-0 items-center justify-center rounded-full border border-[#C9A25E]/45 bg-[#1E2A24] sm:size-64 lg:size-72">
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
              <div className="ceremony-seal relative flex size-32 flex-col items-center justify-center rounded-full border-2 border-[#C9A25E]/70 sm:size-36 lg:size-40">
                <Crown className="size-7 text-[#C9A25E] sm:size-8 lg:size-9" strokeWidth={1.5} />
                <span className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#D8C9A3] sm:text-[11px]">
                  MentorLagbe
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A25E]/80 sm:text-[11px]">
                  Pro Guild
                </span>
              </div>
            </div>
          </div>

          {/* Copy + receipt */}
          <div className="relative lg:col-span-7">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-[#C9A25E] sm:text-left sm:text-[11px]">
              [ Payment Verified — Stripe Dispatch ]
            </p>
            <h1
              className="ceremony-rise ceremony-serif mt-3 text-center font-black leading-[0.95] tracking-[-0.035em] text-[#F2EDDF] sm:text-left"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.4rem, 5.4vw, 4rem)" } as React.CSSProperties}
            >
              You&rsquo;re Now
              <span className="block">
                Part of <span className="italic text-[#C9A25E]">MentorLagbe</span>
              </span>
              <span className="block text-[#F2EDDF]/95">Pro!<span aria-hidden="true" className="text-[#B87959]">.</span></span>
            </h1>
            <p className="ceremony-rise mt-4 max-w-[52ch] text-center text-sm leading-relaxed text-[#F2EDDF]/72 sm:text-left sm:text-base" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              The seal is affixed and your guild seat is live. Every Pro
              benefit is active immediately — your invoice is on its way to{" "}
              <span className="font-semibold text-[#F2EDDF]">{payment.customer_email}</span>.
            </p>

            {/* Premium membership badge */}
            <div className="ceremony-rise mx-auto mt-5 inline-flex items-center gap-3 rounded-sm border border-[#C9A25E]/45 bg-[#C9A25E]/10 py-2 pl-3 pr-4 sm:mx-0" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
              <Crown aria-hidden="true" className="size-5 text-[#C9A25E] sm:size-6" strokeWidth={1.6} />
              <span>
                <span className="block font-mono text-[10px] uppercase leading-snug tracking-[0.22em] text-[#C9A25E] sm:text-[11px]">
                  Pro Membership
                </span>
                <span className="block font-mono text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-[#F2EDDF] sm:text-xs">
                  {payment.plan}
                </span>
              </span>
            </div>

            {/* Receipt */}
            <dl aria-label="Payment receipt" className="ceremony-rise mt-6 border border-[#F2EDDF]/18 bg-[#1E2A24]/70 p-4 backdrop-blur-sm sm:p-5" style={{ "--rise-delay": "0.26s" } as React.CSSProperties}>
              <div className="flex items-center justify-between gap-3 border-b border-[#F2EDDF]/12 pb-3">
                <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#D8C9A3] sm:text-xs">
                  <Receipt aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Payment Receipt
                </span>
                <span className="rounded-sm border border-[#7AA890]/55 bg-[#668B78]/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DBFA9] sm:text-[11px]">
                  Paid
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {[
                  ["Customer", payment.customer_email],
                  ["Membership", payment.plan],
                  ["Amount", `$${amount} ${payment.currency?.toUpperCase()}`],
                  ["Payment Date", formattedDate],
                  ["Method", "Stripe"],
                  ["Transaction", payment.payment_intent || payment.stripeSessionId],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#F2EDDF]/45 sm:text-[11px]">{k}</dt>
                    <dd className="mt-0.5 wrap-break-word font-mono text-[11px] font-bold leading-snug tracking-tight text-[#F2EDDF] sm:text-xs">{v}</dd>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-[#F2EDDF]/12 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#F2EDDF]/45 sm:text-[11px]">
                  Transaction Reference
                </p>
                <CopyField
                  value={payment.payment_intent || payment.stripeSessionId}
                  label="Transaction ID"
                  className="mt-1"
                />
              </div>
            </dl>
          </div>
        </section>

        {/* ══ YOUR GUILD BENEFITS ═════════════════════════════════════════ */}
        <section aria-labelledby="benefits-heading" className="relative border-b border-[#F2EDDF]/10 px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="benefits-heading" className="ceremony-serif text-2xl font-black tracking-tight text-[#F2EDDF] sm:text-3xl">
              Your Guild <span className="italic text-[#C9A25E]">Benefits.</span>
            </h2>
            <div role="group" aria-label="View benefits as" className="flex rounded-sm border border-[#F2EDDF]/20">
              {(["tutor", "student"] as const).map((r) => {
                const active = role === r
                return (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={active}
                    onClick={() => { }}
                    className={cn(
                      "flex h-10 items-center gap-1.5 px-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E] sm:px-4 sm:text-xs",
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
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F2EDDF]/40 sm:text-[11px]">
            {benefits.title} — active now
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 border border-[#F2EDDF]/14 bg-[#1E2A24]/60 p-3.5 text-[12px] leading-relaxed text-[#F2EDDF]/80 transition-colors hover:border-[#C9A25E]/35 sm:text-[13px]"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C9A25E]" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ NEXT STEPS ═════════════════════════════════════════════════ */}
        <section aria-labelledby="next-heading" className="relative px-5 py-8 sm:px-8 sm:py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A25E] sm:text-[11px]">
            [ Where to Next — The First Forty-Eight Hours ]
          </p>
          <h2 id="next-heading" className="ceremony-serif mt-2 text-2xl font-black tracking-tight text-[#F2EDDF] sm:text-3xl">
            Two doors, one <span className="italic text-[#C9A25E]">guild.</span>
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map(({ Icon, title, desc, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 hover:shadow-[6px_8px_0_rgba(201,162,94,0.25)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
              >
                <span className="flex size-11 items-center justify-center rounded-sm border border-[#C9A25E]/40 bg-[#C9A25E]/10">
                  <Icon aria-hidden="true" className="size-5 text-[#C9A25E]" strokeWidth={1.75} />
                </span>
                <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF] sm:text-lg">
                  {title}
                </span>
                <span className="mt-1.5 text-[12px] leading-snug text-[#F2EDDF]/60 sm:text-[13px]">{desc}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A25E] sm:text-[11px]">
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                </span>
              </Link>
            ))}

            <Link
              href="/dashboard"
              className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
            >
              <span className="flex size-11 items-center justify-center rounded-sm border border-[#7AA890]/40 bg-[#668B78]/10">
                <LayoutDashboard aria-hidden="true" className="size-5 text-[#9DBFA9]" strokeWidth={1.75} />
              </span>
              <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF] sm:text-lg">Visit Dashboard</span>
              <span className="mt-1.5 text-[12px] leading-snug text-[#F2EDDF]/60 sm:text-[13px]">Your register, your queue, your plan — one desk</span>
              <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DBFA9] sm:text-[11px]">
                Go to Dashboard
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              href="/"
              className="group flex h-full flex-col border border-[#F2EDDF]/16 bg-[#1E2A24]/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A25E]/45 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
            >
              <span className="flex size-11 items-center justify-center rounded-sm border border-[#F2EDDF]/18 bg-[#F2EDDF]/5">
                <House aria-hidden="true" className="size-5 text-[#EDE8DA]/80" strokeWidth={1.75} />
              </span>
              <span className="ceremony-serif mt-3 text-base font-black leading-snug tracking-tight text-[#F2EDDF] sm:text-lg">Return to Home</span>
              <span className="mt-1.5 text-[12px] leading-snug text-[#F2EDDF]/60 sm:text-[13px]">Back to the atelier — your Pro badge travels with you</span>
              <span className="mt-3 inline-flex items-center gap-1.5 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#EDE8DA]/70 sm:text-[11px]">
                Back Home
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </section>

        {/* ══ Colophon ═════════════════════════════════════════════════════ */}
        <footer className="relative flex flex-col items-start justify-between gap-3 border-t border-[#F2EDDF]/12 px-5 py-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-[#F2EDDF]/45 sm:flex-row sm:items-center sm:px-8 sm:text-xs">
          <Link href="/" className="group inline-flex items-center gap-1.5 font-bold text-[#F2EDDF] transition-colors hover:text-[#C9A25E]">
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to the Atelier
          </Link>
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-[#C9A25E]" strokeWidth={2} />
              256-bit Stripe · PCI-DSS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star aria-hidden="true" className="size-3.5 fill-[#C9A25E] text-[#C9A25E]" strokeWidth={1.5} />
              4.9 · 1,240 member reviews
            </span>
          </span>
          <button
            type="button"
            aria-label="Manage your subscription (opens settings)"
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#F2EDDF]/20 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#F2EDDF]/60 transition-colors hover:bg-[#F2EDDF]/8 hover:text-[#F2EDDF] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E] sm:text-[11px]"
          >
            <Printer aria-hidden="true" className="size-3.5" strokeWidth={2} />
            Print Receipt
          </button>
        </footer>
      </main>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#1A1F1B]">
          <Loader2 className="size-10 animate-spin text-[#C9A25E]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}