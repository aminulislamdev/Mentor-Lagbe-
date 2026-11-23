"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Compass,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Search,
  BadgeCheck,
  GraduationCap,
  Users,
  Wallet,
  BookOpenCheck,
  Sparkles,
  ChevronDown,
  Quote,
  FlaskConical,
  HeartHandshake,
  ClipboardCheck,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Static atelier data ─────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    Icon: Search,
    title: "The Parent’s Maze",
    body: "Verified tutors, scattered across word-of-mouth groups and gatekeeper agencies — filtered by subject, class level, mode, and fee, but never findable in one place.",
    tone: "text-[#B87959]",
    bg: "bg-[#B87959]/10 border-[#B87959]/30",
  },
  {
    Icon: GraduationCap,
    title: "The Tutor’s Gap",
    body: "Qualified educators have no dignified, structured system to publish a batch, meet applicants, and run the pipeline from inquiry to enrolment.",
    tone: "text-[#668B78]",
    bg: "bg-[#668B78]/10 border-[#668B78]/30",
  },
  {
    Icon: Wallet,
    title: "The Platform Tax",
    body: "Agencies skim 15–30% of every fee for merely standing in the middle. MentorLagbe charges parents nothing and tutors nothing to be listed.",
    tone: "text-[#344C43]",
    bg: "bg-[#344C43]/5 border-[#344C43]/25",
  },
]

const BOARD_STEPS = [
  {
    step: "01",
    title: "The Submission",
    body: "A tutor files credentials — degrees, board results, teaching letters, subject specialization, and the batch syllabus they intend to teach.",
    Icon: BookOpenCheck,
  },
  {
    step: "02",
    title: "The Review",
    body: "Our academic board cross-checks documents against university and board records, assesses subject depth, and interviews for teaching clarity.",
    Icon: ClipboardCheck,
  },
  {
    step: "03",
    title: "The Trial Tuition",
    body: "Approved tutors run one observed batch. Scholars rate clarity, patience, and rigor — the board reads every note before the seal is granted.",
    Icon: FlaskConical,
  },
  {
    step: "04",
    title: "The Verified Seal",
    body: "Only batches that clear the trial go live — with the tutor’s seal, rate history, and moderator’s notes visible on every card.",
    Icon: BadgeCheck,
  },
]

const CHARTER = [
  {
    Icon: ShieldCheck,
    title: "Verified educators only",
    body: "No anonymous tutors. Every profile carries board-verified credentials or it does not carry a listing.",
  },
  {
    Icon: ClipboardCheck,
    title: "Moderated before publication",
    body: "Every tuition post is approved or rejected by the academic board before a single scholar sees it.",
  },
  {
    Icon: Wallet,
    title: "Zero surcharge on learning",
    body: "We take nothing from parents, nothing from tuition fees. Pro plans fund the platform — never the classroom.",
  },
  {
    Icon: HeartHandshake,
    title: "Scholar-first conduct",
    body: "Fair fees, published schedules, refund-friendly cancellation, and a board that answers parents within one working day.",
  },
  {
    Icon: Users,
    title: "Small cohorts, real attention",
    body: "Batch caps are enforced. A tutor who accepts more than the ledger allows loses the listing — quietly and permanently.",
  },
  {
    Icon: XCircle,
    title: "No outcome guarantees",
    body: "We forbid impossible promises. Listings claiming guaranteed results are returned by the board, always.",
  },
]

const FAQS = [
  {
    q: "How is MentorLagbe different from a tuition agency?",
    a: "Agencies charge a percentage of every fee and take no responsibility for teaching quality. We are a curated marketplace: tutors are board-verified, batches are moderated, applications are direct — and we never touch the tuition fee.",
  },
  {
    q: "Who moderates the tutors?",
    a: "The MentorLagbe Academic Board — fellow educators, not algorithms. Every profile, credential, and batch is reviewed by a human who has taught the same subjects.",
  },
  {
    q: "Is it really free to join?",
    a: "Yes — browsing, applying, and hosting up to two batches cost nothing, forever. Pro plans ($10 student, $15 tutor) fund priority booking, unlimited listings, and verified seals.",
  },
  {
    q: "What happens if a tutor disappoints me?",
    a: "Cancel any pending application in one tap, or tell the board after joining. Two substantiated complaints and the listing comes down — the board does not negotiate on this.",
  },
  {
    q: "Can I teach on MentorLagbe?",
    a: "Yes — register as a Tutor, submit your credentials, clear the trial batch, and your seal goes live. Free plan hosts two batches; Pro hosts without limit.",
  },
]

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number>(0)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ══ MASTHEAD — the founder's letter ══════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-border/80 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(52,76,67,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,76,67,0.15)_1px,transparent_1px)] bg-size-[4rem_4rem]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 text-xs sm:text-sm font-mono tracking-wider uppercase shadow-2xs backdrop-blur-sm">
                <Compass className="size-3.5 sm:size-4 text-primary" strokeWidth={2} />
                About the Atelier
                <span aria-hidden="true" className="text-muted-foreground">·</span>
                <span className="text-[#B87959] font-bold">Est. 2026</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Teaching is a craft.{" "}
                <span className="font-serif italic text-primary">We keep its ledger.</span>
              </h1>

              <div className="max-w-2xl space-y-3 text-base sm:text-lg leading-relaxed text-foreground/80">
                <p>
                  MentorLagbe exists because a mother in Dhanmondi should not need a
                  godfather to find a trigonometry tutor, and a BUET scholar should not
                  beg Facebook groups for a place to teach.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">
                  We verify educators, moderate every batch, and take nothing from the
                  classroom — so the only thing left to negotiate is the learning itself.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/tuitions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-[#537363] text-white font-semibold text-base shadow-sm transition-all duration-200 group"
                >
                  Explore Approved Tuitions
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sign-up?role=tutor"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground font-semibold text-base shadow-2xs transition-all duration-200"
                >
                  <GraduationCap className="size-4 text-primary" />
                  Become a Mentor
                </Link>
              </div>
            </div>

            {/* The Founder's Letter */}
            <figure className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/5 rotate-[0.6deg] transition-transform duration-300 hover:rotate-0">
              <Quote aria-hidden="true" className="size-9 text-primary/25" strokeWidth={1.5} />
              <blockquote className="mt-4 font-serif text-lg sm:text-xl italic leading-snug text-foreground/90">
                &ldquo;Education in Bengal was never broken — it was just unfindable.
                We built the room where the serious ones meet the serious.&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/80 pt-4">
                <div
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary"
                >
                  MS
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-foreground">Prof. Mahbub Siddiqui</p>
                  <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                    Founder · Ex-Examiner, Dhaka Education Board
                  </p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══ WHY WE EXIST — the three failures we set out to fix ══════════ */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-10">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#B87959] font-semibold">
              Why We Exist
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Three failures nobody fixed.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map(({ Icon, title, body, tone, bg }) => (
              <div
                key={title}
                className={cn(
                  "flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
                  bg
                )}
              >
                <Icon aria-hidden="true" className={cn("size-8 sm:size-9", tone)} strokeWidth={1.6} />
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">{title}</h3>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE BOARD — how every verified seal is earned ═════════════════ */}
      <section className="relative py-16 sm:py-20 border-b border-border/80 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(to_right,rgba(52,76,67,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,76,67,0.15)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold">
                The Academic Board
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                A seal is <span className="font-serif italic text-primary">earned</span>, never bought.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Every verified mentor on MentorLagbe cleared the same four-gate
                pipeline. No shortcuts, no paid badges, no exceptions.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 self-start md:self-auto text-xs sm:text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              See what Pro unlocks
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOARD_STEPS.map(({ step, title, body, Icon }) => (
              <li
                key={step}
                className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-2xs hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span aria-hidden="true" className="font-mono text-3xl sm:text-4xl font-extrabold text-[#344C43]/15 dark:text-[#EFE7DC]/15">
                    {step}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ THE CHARTER — six promises we keep in public ═════════════════ */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-10">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#B87959] font-semibold">
              The MentorLagbe Charter
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Six promises, printed where you can see them.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHARTER.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-2xs"
              >
                <Icon aria-hidden="true" className="size-6 sm:size-7 shrink-0 text-primary mt-0.5" strokeWidth={1.75} />
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BY THE LEDGER — scoreboard strip ═════════════════════════════ */}
      <section className="py-14 sm:py-16 border-b border-border/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/70 border-y border-border/80 text-center">
            {[
              ["2,400+", "Verified Mentors"],
              ["180+", "Subjects Covered"],
              ["12,000+", "Scholars Enrolled"],
              ["99.2%", "Session Satisfaction"],
            ].map(([n, label]) => (
              <div key={label} className="px-2 py-6">
                <span className="font-heading block text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {n}
                </span>
                <span className="mt-2 block font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FIELD NOTES — honest answers ═════════════════════════════════ */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-background/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold">
              Field Notes
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Asked at the desk, often.
            </h2>
          </div>
          <ul className="divide-y divide-border/70 border border-border rounded-2xl overflow-hidden bg-card shadow-2xs">
            {FAQS.map((item, idx) => {
              const open = openFaq === idx
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-button-${idx}`}
                    className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left transition-colors hover:bg-background/60 focus-visible:outline focus-visible:outline-[#668B78]"
                  >
                    <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                      {item.q}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        open && "rotate-180 text-primary"
                      )}
                      strokeWidth={2}
                    />
                  </button>
                  {open && (
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-button-${idx}`}
                      className="px-5 sm:px-6 pb-5 -mt-1"
                    >
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground border-l-2 border-primary/40 pl-4">
                        {item.a}
                      </p>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ══ CLOSING CTA ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-background/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-widest text-primary font-semibold">
            <Sparkles aria-hidden="true" className="size-4" />
            The Room Is Open
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground max-w-2xl mx-auto">
            Come sit on the right side of the table.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Whether you are seeking a mentor or offering one, the ledger is open.
            Two minutes to enrol — a lifetime of rigor.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tuitions"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-[#537363] text-white text-sm sm:text-base font-semibold shadow-sm transition-colors"
            >
              Browse Approved Tuitions
            </Link>
            <Link
              href="/sign-up?role=tutor"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground text-sm sm:text-base font-semibold transition-colors"
            >
              Apply as a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}