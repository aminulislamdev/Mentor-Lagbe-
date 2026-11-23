"use client"

import { Suspense, useState } from "react"
import { useSearchParams} from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Lock,
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { createCheckoutSession } from "@/lib/api"

// ─── Scoped checkout styles (DESIGN.md compliant) ─────────────────────────────
const checkoutStyles = `
  .checkout-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
  .checkout-root ::selection { background: #B87959; color: #EFE7DC; }
  
  @keyframes checkout-fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .checkout-fade-up { animation: checkout-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

  .ledger-dashed-line {
    border-bottom: 1px dashed rgba(52, 76, 67, 0.25);
  }
`

function CheckoutContent() {
  const searchParams = useSearchParams()
  
  const planType = (searchParams.get("plan") || "student") as "student" | "tutor"

  const [loading, setLoading] = useState(false)

  // প্ল্যান অনুযায়ী ডাটা (Pricing page থেকে আসা ডাটা)
  const planDetails = {
    student: {
      title: "Student Pro",
      subtitle: "Scholar's Ledger",
      price: "$10.00",
      interval: "USD / month",
      features: [
        "Priority #1 placement in tutor review queues",
        "Verified Scholar profile badge",
        "Early batch notification desk",
        "Application ledger audit & history",
      ],
    },
    tutor: {
      title: "Tutor Pro",
      subtitle: "Mentor's Guild",
      price: "$15.00",
      interval: "USD / month",
      features: [
        "Unlimited tuition listings & batches",
        "Gold Pro Tutor seal on all listings",
        "Featured index placement priority",
        "Applicant CRM management console",
      ],
    },
  }

  const currentPlan = planDetails[planType]

  const handleProceedToStripe = async () => {
    setLoading(true)
    try {
      const url = await createCheckoutSession(planType)
      if (url) {
        window.location.href = url
      } else {
        toast.error("Could not create checkout session.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect to Stripe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-root min-h-screen bg-[#D9CBB5] text-[#344C43] pb-20 selection:bg-[#B87959] selection:text-[#EFE7DC]">
      <style>{checkoutStyles}</style>

      {/* ══ MASTHEAD ═══════════════════════════════════════════════════ */}
      <header className="border-b border-[#344C43]/15 bg-[#D9CBB5]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/pricing" className="group flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#344C43]/70 transition-colors hover:text-[#344C43]">
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={2.5} />
            <span className="hidden sm:inline">Return to Pricing</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-[#668B78]" strokeWidth={2.5} />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] text-[#344C43]/70">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">

        {/* ══ HEADER TEXT ══════════════════════════════════════════════════ */}
        <div className="mb-10 text-center sm:text-left">
          <p className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B87959]">
            [ Final Review ]
          </p>
          <h1 className="checkout-serif mt-3 text-4xl font-black tracking-tight text-[#344C43] sm:text-5xl lg:text-6xl leading-tight">
            Confirm your <span className="italic text-[#668B78]">enrollment.</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto sm:mx-0 text-sm sm:text-base leading-relaxed text-[#344C43]/75">
            Review your selected guild seat below. You will be redirected to Stripe to complete the secure transaction.
          </p>
        </div>

        {/* ══ ASYMMETRIC GRID (60/40) ══════════════════════════════════════ */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">

          {/* LEFT: The Dossier (60%) */}
          <div className="checkout-fade-up space-y-6 lg:col-span-7" style={{ animationDelay: "0.1s" }}>
            <div className="rounded-2xl border border-[#344C43]/20 bg-[#EFE7DC] p-5 sm:p-8 shadow-[4px_6px_0_rgba(52,76,67,0.08)]">

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 border-b border-[#344C43]/15 pb-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#B87959]/15 text-[#B87959]">
                  <FileText className="size-6" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="checkout-serif text-2xl sm:text-3xl font-bold text-[#344C43]">
                    {currentPlan.title}
                  </h2>
                  <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#B87959] mt-1">
                    {currentPlan.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#344C43]/60">
                  What is included:
                </h3>
                <ul className="grid gap-4 sm:gap-3 sm:grid-cols-2">
                  {currentPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-[15px] leading-snug text-[#344C43]/85">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#668B78]" strokeWidth={2.5} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-xl border border-[#668B78]/30 bg-[#668B78]/5 p-4 sm:p-5 flex gap-3 items-start">
                <ShieldCheck className="size-5 shrink-0 text-[#668B78] mt-0.5" strokeWidth={2} />
                <p className="text-sm leading-relaxed text-[#344C43]/80">
                  <strong className="font-semibold text-[#344C43]">Instant Activation:</strong> Your Pro features will be unlocked the moment your payment is confirmed by Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: The Ledger / Receipt (40%) */}
          <div className="checkout-fade-up lg:col-span-5" style={{ animationDelay: "0.2s" }}>
            <div className="sticky top-24 rounded-2xl border border-[#344C43]/25 bg-[#EFE7DC] shadow-[6px_8px_0_rgba(52,76,67,0.12)]">

              {/* Receipt Header */}
              <div className="border-b border-[#344C43]/15 bg-[#344C43]/5 px-6 py-4 sm:px-8">
                <h3 className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#344C43]">
                  Order Summary
                </h3>
              </div>

              {/* Receipt Body */}
              <div className="px-6 py-6 sm:px-8">
                <div className="space-y-4 font-mono text-xs sm:text-sm uppercase tracking-[0.08em] text-[#344C43]">

                  <div className="flex justify-between items-center ledger-dashed-line pb-3">
                    <span className="text-[#344C43]/60">Membership</span>
                    <span className="font-bold">{currentPlan.title}</span>
                  </div>

                  <div className="flex justify-between items-center ledger-dashed-line pb-3">
                    <span className="text-[#344C43]/60">Billing Cycle</span>
                    <span>Monthly</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[#344C43]/60">Total Due Today</span>
                    <span className="text-xl sm:text-2xl font-black text-[#B87959]">
                      {currentPlan.price}
                    </span>
                  </div>

                  <div className="flex justify-end text-[10px] sm:text-[11px] text-[#344C43]/50 tracking-widest">
                    {currentPlan.interval}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-[#344C43]/15">
                  <button
                    onClick={handleProceedToStripe}
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#668B78] py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#537363] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Connecting to Stripe...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowLeft className="size-4 rotate-180 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#344C43]/50">
                    <Lock className="size-3.5" />
                    Secured by Stripe · 256-bit Encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// ✅ Next.js App Router-এ useSearchParams ব্যবহারের জন্য Suspense বাউন্ডারি
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#D9CBB5]">
          <Loader2 className="size-10 animate-spin text-[#344C43]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}