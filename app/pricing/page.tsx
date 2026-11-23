"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // ✅ রিডাইরেক্ট করার জন্য যুক্ত করা হলো
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowDownRight,
  ChevronDown,
  Zap,
  GraduationCap,
  BookOpenCheck,
  Crown,
  HeartHandshake,
  Layers,
} from "lucide-react"

interface PricingFeature {
  feature: string
  studentFree: string | boolean
  studentPro: string | boolean
  tutorFree: string | boolean
  tutorPro: string | boolean
}

const COMPARISON_MATRIX: { category: string; features: PricingFeature[] }[] = [
  {
    category: "Tuition Batch Management",
    features: [
      {
        feature: "Tuition Listing Creation Quota",
        studentFree: "N/A",
        studentPro: "N/A",
        tutorFree: "Max 2 Batches",
        tutorPro: "Unlimited Batches",
      },
      {
        feature: "ImgBB Direct Banner Photo Upload",
        studentFree: "N/A",
        studentPro: "N/A",
        tutorFree: true,
        tutorPro: true,
      },
      {
        feature: "Batch Status Toggling (Active / Closed)",
        studentFree: "N/A",
        studentPro: "N/A",
        tutorFree: true,
        tutorPro: true,
      },
      {
        feature: "Featured Discovery Index Placement",
        studentFree: "N/A",
        studentPro: "N/A",
        tutorFree: false,
        tutorPro: true,
      },
    ],
  },
  {
    category: "Student Applications & Enrollment",
    features: [
      {
        feature: "Application Submission to Batches",
        studentFree: "Unlimited",
        studentPro: "Unlimited",
        tutorFree: "N/A",
        tutorPro: "N/A",
      },
      {
        feature: "Applicant Queue Placement",
        studentFree: "Standard FIFO",
        studentPro: "Pinned Priority #1",
        tutorFree: "N/A",
        tutorPro: "N/A",
      },
      {
        feature: "Pending Application Cancellation",
        studentFree: true,
        studentPro: true,
        tutorFree: "N/A",
        tutorPro: "N/A",
      },
      {
        feature: "Early Batch Opening Notifications",
        studentFree: false,
        studentPro: true,
        tutorFree: "N/A",
        tutorPro: "N/A",
      },
    ],
  },
  {
    category: "Trust Badges & Profile Identity",
    features: [
      {
        feature: "Official Verification Seal",
        studentFree: false,
        studentPro: "Verified Scholar",
        tutorFree: "Admin Reviewed",
        tutorPro: "Gold Pro Tutor Seal",
      },
      {
        feature: "Applicant CRM & Direct Notes Review",
        studentFree: "N/A",
        studentPro: "N/A",
        tutorFree: true,
        tutorPro: true,
      },
      {
        feature: "Dedicated Priority Advisory Support",
        studentFree: false,
        studentPro: true,
        tutorFree: false,
        tutorPro: true,
      },
    ],
  },
]

const FAQS = [
  {
    q: "Can I use MentorLagbe for free?",
    a: "Yes. Students can freely browse, search, and apply for any approved tuition batch. Tutors can register, get verified, and post up to two active tuition batches with zero subscription fees.",
  },
  {
    q: "How many tuitions can Free Tutors post?",
    a: "Two — Free tutors can hold a maximum of two active listings at a time. Need a third? Tutor Pro removes that ceiling entirely and gives you unlimited batch publishing, the Gold Pro Tutor seal, and featured index placement.",
  },
  {
    q: "What benefits does Pro provide?",
    a: "Student Pro pins your application at the top of the tutor's review queue and marks you as a verified scholar. Tutor Pro unlocks unlimited listings, the Gold Pro Tutor badge, featured discovery placement, and a dedicated priority advisory channel for your batches.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes — and we encourage it. Browse freely on Free, apply to your dream batch, and the moment you need priority placement or unlimited listings, upgrade from your dashboard. Student Pro is $10/month and Tutor Pro is $15/month, both active instantly via Stripe.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely via Stripe Checkout using industry-standard 256-bit encryption. We accept international and local cards (Visa, Mastercard, American Express). Your plan updates automatically upon completion.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. There are no lock-in contracts. You can manage or cancel your subscription at any time directly through your dashboard settings.",
  },
]

export default function PricingPage() {
  const router = useRouter() // ✅ রাউটার ইনিশিয়ালাইজ করা হলো
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0)

  // ✅ Stripe-এ যাওয়ার আগে চেকআউট পেজে পাঠানোর ফাংশন
  const handleUpgrade = (plan: "student" | "tutor") => {
    router.push(`/checkout?plan=${plan}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-24 selection:bg-primary/20 selection:text-foreground">
      {/* 1. CREATIVE EDITORIAL PRICING HERO */}
      <section className="relative overflow-hidden border-b border-border/80 bg-card/40 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(to_right,rgba(52,76,67,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,76,67,0.15)_1px,transparent_1px)] bg-size-4rem_4rem]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-sm font-mono tracking-wider uppercase text-foreground shadow-2xs">
            <ShieldCheck className="size-4 text-[#B87959]" />
            <span>Institutional Fairness & Sustainability</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-primary font-bold">Stripe Verified</span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground tracking-tight max-w-4xl mx-auto leading-[1.12]">
            A Better Learning{" "}
            <span className="text-primary italic font-serif">Experience</span>{" "}
            Starts Here.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            MentorLagbe membership means verified educators, moderated batches and zero surcharge on learning — whether you apply for a seat or publish a batch of your own.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Zero Application Surcharges</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              <span>No Contract Lock-in</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Instant Stripe Activation</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. AUDIENCE SELECTION */}
      <section className="border-b border-border/80 bg-background/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Choose your ledger
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="#student-membership" className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 transition-all duration-200 hover:border-primary/60 hover:bg-primary/10">
              <span className="flex items-center gap-3">
                <GraduationCap className="size-8 text-primary" strokeWidth={1.6} />
                <span>
                  <span className="block font-heading text-lg sm:text-xl font-bold text-foreground">Student Membership</span>
                  <span className="mt-0.5 block font-mono text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">Free to join · Pro $10/mo</span>
                </span>
              </span>
              <ArrowDownRight className="size-5 text-primary transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1" />
            </Link>

            <Link href="#tutor-membership" className="group flex items-center justify-between gap-4 rounded-2xl border border-[#B87959]/35 bg-[#B87959]/5 px-5 py-4 transition-all duration-200 hover:border-[#B87959]/60 hover:bg-[#B87959]/10">
              <span className="flex items-center gap-3">
                <BookOpenCheck className="size-8 text-[#B87959]" strokeWidth={1.6} />
                <span>
                  <span className="block font-heading text-lg sm:text-xl font-bold text-foreground">Tutor Membership</span>
                  <span className="mt-0.5 block font-mono text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">Free to join · Pro $15/mo</span>
                </span>
              </span>
              <ArrowDownRight className="size-5 text-[#B87959] transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DUAL-SIDED GUILD PRESENTATION */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* TUTOR PRO */}
          <div id="tutor-membership" className="rounded-3xl border-2 border-[#B87959]/40 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B87959]/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="font-mono text-sm uppercase tracking-widest text-[#B87959] font-bold block">Instructor Guild</span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-0.5">Tutor Pro Membership</h2>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#B87959]/15 text-[#B87959] border border-[#B87959]/30 font-mono text-sm font-bold">
                  <Sparkles className="size-4" />
                  <span>Educator Choice</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-sm text-muted-foreground uppercase block">Subscription Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground">$15</span>
                  <span className="font-mono text-base sm:text-lg text-muted-foreground">USD / month</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-mono pt-1">Permanently replaces the 2-batch limit with unlimited academic publishing.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2 text-sm sm:text-base font-mono">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Starter Free Plan:</span>
                  <span className="font-semibold text-foreground">Max 2 Tuition Batches</span>
                </div>
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>Tutor Pro Tier:</span>
                  <span className="text-[#B87959]">Unlimited Active Batches</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm sm:text-base lg:text-lg text-foreground/80">
                {[
                  "Unlimited Tuition Listings: Publish as many subject batches or 1-on-1 slots as your capacity allows.",
                  "Gold Pro Tutor Seal: Prominently badges your instructor profile, signaling institutional commitment.",
                  "Featured Index Placement: Your listings rank higher on the public Browse Tuitions catalog.",
                  "Applicant Management Console: Review student notes, preferred schedules, and update statuses in real time.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-[#B87959] shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: text.replace(/(.*?):/, "<strong>$1:</strong>") }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-border/80 space-y-2">
              <button
                type="button"
                onClick={() => handleUpgrade("tutor")} // ✅ এখানে পেজ রিডাইরেক্ট হবে
                className="w-full py-4 sm:py-5 px-4 rounded-xl bg-[#B87959] hover:bg-[#9F6446] text-white font-semibold text-base sm:text-lg shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Tutor Pro ($15)</span>
                <ArrowRight className="size-4" />
              </button>
              <p className="text-center font-mono text-xs text-muted-foreground">🔒 Processed via Stripe • Instant unlock in your tutor dashboard</p>
            </div>
          </div>

          {/* STUDENT PRO */}
          <div id="student-membership" className="rounded-3xl border-2 border-primary/50 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="font-mono text-sm uppercase tracking-widest text-primary font-bold block">Scholar Guild</span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-0.5">Student Pro Membership</h2>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-mono text-sm font-bold">
                  <Zap className="size-4" />
                  <span>Fast-Track</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-sm text-muted-foreground uppercase block">Subscription Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground">$10</span>
                  <span className="font-mono text-base sm:text-lg text-muted-foreground">USD / month</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-mono pt-1">Subsidized rate for serious candidates aiming for competitive admissions.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2 text-sm sm:text-base font-mono">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Standard Free Plan:</span>
                  <span className="font-semibold text-foreground">Standard FIFO Review Queue</span>
                </div>
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>Student Pro Tier:</span>
                  <span className="text-primary">Pinned #1 Application Priority</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm sm:text-base lg:text-lg text-foreground/80">
                {[
                  "Top-of-Queue Application Priority: Your enrollment request appears pinned first in the tutor's review inbox.",
                  "Verified Scholar Profile Badge: Proves authentic commitment to mentors, raising your acceptance likelihood.",
                  "Early Batch Notification Desk: Get first-look alerts when coveted mentors open limited-seat cohorts.",
                  "Application Ledger Audit: Dedicated tracking with detailed status history and tutor feedback notes.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: text.replace(/(.*?):/, "<strong>$1:</strong>") }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-border/80 space-y-2">
              <button
                type="button"
                onClick={() => handleUpgrade("student")} // ✅ এখানে পেজ রিডাইরেক্ট হবে
                className="w-full py-4 sm:py-5 px-4 rounded-xl bg-primary hover:bg-[#537363] text-white font-semibold text-base sm:text-lg shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Student Pro ($10)</span>
                <ArrowRight className="size-4" />
              </button>
              <p className="text-center font-mono text-xs text-muted-foreground">🔒 Processed via Stripe • Instant priority activation on all applications</p>
            </div>
          </div>
        </div>

        {/* 3B. THE COMPARATIVE MASTER MATRIX */}
        <section className="mt-20 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="font-mono text-sm uppercase tracking-widest text-primary font-bold">Institutional Specification</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Comprehensive Feature Ledger</h2>
            <p className="text-sm sm:text-base text-muted-foreground">A granular comparison of complimentary standard access versus our dedicated Pro memberships.</p>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-sm sm:text-base font-mono border-collapse">
                <thead>
                  <tr className="bg-background/80 border-b border-border/80 text-foreground">
                    <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs sm:text-sm w-2/5">Platform Capability</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-xs sm:text-sm text-center w-1/5">Student Free</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-xs sm:text-sm text-center text-primary w-1/5 bg-primary/5">Student Pro ($10)</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-xs sm:text-sm text-center w-1/5">Tutor Free</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-xs sm:text-sm text-center text-[#B87959] w-1/5 bg-[#B87959]/5">Tutor Pro ($15)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {COMPARISON_MATRIX.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      <tr className="bg-background/40">
                        <td colSpan={5} className="py-2.5 px-6 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold text-foreground/80 bg-background/60">{group.category}</td>
                      </tr>
                      {group.features.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-background/30 transition-colors">
                          <td className="py-3 px-6 text-foreground font-medium text-sm sm:text-base">{row.feature}</td>
                          <td className="py-3 px-4 text-center font-mono text-sm sm:text-base">
                            {typeof row.studentFree === "boolean" ? (row.studentFree ? <CheckCircle2 className="size-4 text-primary mx-auto" /> : <XCircle className="size-4 text-muted-foreground/40 mx-auto" />) : <span className="text-muted-foreground">{row.studentFree}</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-sm sm:text-base bg-primary/5">
                            {typeof row.studentPro === "boolean" ? (row.studentPro ? <CheckCircle2 className="size-4 text-primary mx-auto" /> : <XCircle className="size-4 text-muted-foreground/40 mx-auto" />) : <span className="font-semibold text-primary">{row.studentPro}</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-sm sm:text-base">
                            {typeof row.tutorFree === "boolean" ? (row.tutorFree ? <CheckCircle2 className="size-4 text-primary mx-auto" /> : <XCircle className="size-4 text-muted-foreground/40 mx-auto" />) : <span className="text-muted-foreground">{row.tutorFree}</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-sm sm:text-base bg-[#B87959]/5">
                            {typeof row.tutorPro === "boolean" ? (row.tutorPro ? <CheckCircle2 className="size-4 text-[#B87959] mx-auto" /> : <XCircle className="size-4 text-muted-foreground/40 mx-auto" />) : <span className="font-semibold text-[#B87959]">{row.tutorPro}</span>}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3C. MEMBERSHIP BENEFITS */}
        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-4">
            <div>
              <span className="font-mono text-sm uppercase tracking-widest text-[#B87959] font-bold">Why the Guild Exists</span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-1.5">
                Membership, <span className="font-serif italic text-primary">on the record.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm sm:text-base leading-snug text-muted-foreground">Two guilds, one ledger — what each side of the desk gets the moment the seal is affixed.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="flex flex-col rounded-2xl border border-primary/35 bg-card p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="size-7 text-primary" strokeWidth={1.75} />
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Benefits for Scholars</h3>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">I.</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-foreground/85">
                {[
                  "Priority #1 placement in tutor review queues — your application read first, always",
                  "Verified Scholar badge on every application — mentors see you mean it",
                  "Early-access desk for opening cohorts before they hit the public index",
                  "Application ledger audit with full status history and tutor notes",
                  "Weekly member-only study letters from senior board-examiners",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="flex flex-col rounded-2xl border border-[#B87959]/40 bg-card p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <BookOpenCheck className="size-7 text-[#B87959]" strokeWidth={1.75} />
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">Benefits for Mentors</h3>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-bold">II.</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-foreground/85">
                {[
                  "Unlimited active tuition listings — publish as many batches as your calendar holds",
                  "Gold Pro Tutor seal — the trust mark parents and scholars look for first",
                  "Featured placement on the Browse Tuitions index and home discovery",
                  "Applicant CRM console — notes, schedules and one-tap status updates",
                  "Monthly payout reports and direct Stripe invoicing, automatically",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <CheckCircle2 className="size-4 text-[#B87959] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="flex flex-col rounded-2xl border-2 border-foreground/20 bg-[#344C43] p-6 text-[#EFE7DC] shadow-sm md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-[#EFE7DC]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <Crown className="size-7 text-[#C98B6D]" strokeWidth={1.75} />
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#EFE7DC]">Why Upgrading Matters</h3>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C98B6D] font-bold">III.</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-[#EFE7DC]/85">
                {[
                  "High-demand cohorts close in hours — Free applications wait behind Pro pins by design",
                  "The 2-batch Free ceiling forces promising mentors to turn students away — Pro never does",
                  "Every Pro seat gates the Goodness Fee: 10–15% of it funds board-verification of new tutors",
                  "You can upgrade the moment you need it — instant activation, cancel any month, no lock-in",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <HeartHandshake className="size-4 text-[#C98B6D] shrink-0 mt-0.5" strokeWidth={2} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-4 border-t border-[#EFE7DC]/15 flex items-center gap-2 font-mono text-xs sm:text-sm uppercase leading-snug tracking-[0.18em] text-[#EFE7DC]/55">
                <Layers className="size-4 shrink-0 text-[#C98B6D]" strokeWidth={1.75} />
                Free keeps the lights on. Pro keeps the board sovereign.
              </p>
            </article>
          </div>
        </section>

        {/* 4. INSTITUTIONAL FAQ ACCORDION */}
        <section className="mt-20 pt-12 border-t border-border/80 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-sm uppercase tracking-widest text-[#B87959] font-bold">Frequently Clarified Inquiries</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Everything You Need to Know</h2>
          </div>

          <div className="space-y-3 pt-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {isOpen && (
                    <div id={`faq-panel-${idx}`} role="region" aria-label={faq.q} className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-border/60 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* 5. FINAL SUBSCRIPTION CTA */}
      <section className="border-t border-border/80 bg-[#344C43] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#C98B6D] font-bold">
            <Sparkles className="size-4" />
            The Cohort Waits for No One
          </span>
          <h2 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EFE7DC] max-w-3xl mx-auto leading-[1.15]">
            Pick your seat before the{" "}
            <span className="font-serif italic text-[#C98B6D]">board bell</span> rings.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-[#EFE7DC]/70 leading-relaxed">
            High-demand cohorts seal within hours of opening. Scholars, take priority. Mentors, take the platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleUpgrade("student")} // ✅ এখানে পেজ রিডাইরেক্ট হবে
              className="w-full sm:w-auto px-8 py-5 rounded-xl bg-[#B87959] text-[#1E3A2F] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#C98B6D] transition-all duration-200 shadow-[6px_6px_0_#10181A] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#10181A] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#C98B6D] cursor-pointer flex items-center justify-center gap-2"
            >
              Subscribe — Student Pro · $10
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handleUpgrade("tutor")} // ✅ এখানে পেজ রিডাইরেক্ট হবে
              className="w-full sm:w-auto px-8 py-5 rounded-xl bg-transparent border-2 border-[#EFE7DC]/40 text-[#EFE7DC] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] hover:border-[#C98B6D] hover:text-[#C98B6D] transition-all duration-200 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#C98B6D] cursor-pointer flex items-center justify-center gap-2"
            >
              Subscribe — Tutor Pro · $15
              <ArrowRight className="size-4" />
            </button>
          </div>
          <p className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-widest text-[#EFE7DC]/40">
            Cancel anytime · Instant activation · Zero hidden fees
          </p>
        </div>
      </section>
    </div>
  )
}