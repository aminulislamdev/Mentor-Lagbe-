"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Compass,
  MapPin,
  Clock,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  Share2,
  BookOpen,
  Award,
  AlertCircle,
  X,
  Send,
  HelpCircle,
  ArrowUpRight,
  FileText,
  CornerDownRight,
  BadgeCheck,
} from "lucide-react"

interface TuitionDossier {
  id: string
  referenceCode: string
  title: string
  subtitle: string
  subject: string
  academicTier: string
  mode: "Online" | "Offline"
  venue: string
  monthlyInvestment: number
  feePerSession: number
  sessionsPerMonth: number
  daysPerWeek: number
  weeklyPace: string
  scheduleSchedule: { day: string; time: string }[]
  seatAllocation: { total: number; occupied: number; remaining: number }
  bannerImage: string
  manifesto: string
  pedagogicalFocus: { title: string; syllabus: string }[]
  learnerProfile: string[]
  tutor: {
    name: string
    credential: string
    institution: string
    facultyNote: string
    tenure: string
    alumniBadge: string
    rating: number
    reviewsTotal: number
    batchesCompleted: number
    responseCommitment: string
    directEmail: string
    initials: string
  }
}

const DOSSIER_RECORD: Record<string, TuitionDossier> = {
  "tui-001": {
    id: "tui-001",
    referenceCode: "ML-ACAD-2026-MATH",
    title: "Higher Mathematics & Differential Calculus Guild",
    subtitle: "A rigorous semester-long batch dedicated to mastering calculus derivations, vectors, and board exam dominance.",
    subject: "Higher Mathematics",
    academicTier: "HSC 2025 – 2026",
    mode: "Offline",
    venue: "Studio 4B, Road 27, Dhanmondi R/A, Dhaka",
    monthlyInvestment: 4500,
    feePerSession: 375,
    sessionsPerMonth: 12,
    daysPerWeek: 3,
    weeklyPace: "3 Sessions Weekly (90 mins each)",
    scheduleSchedule: [
      { day: "Saturday", time: "4:00 PM – 5:30 PM" },
      { day: "Monday", time: "4:00 PM – 5:30 PM" },
      { day: "Wednesday", time: "4:00 PM – 5:30 PM" },
    ],
    seatAllocation: { total: 12, occupied: 9, remaining: 3 },
    bannerImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=85",
    manifesto:
      "Calculus is not an accumulation of disparate formulas to be memorized; it is the universal mathematical language of change. This batch is structured as an atelier workshop. We reconstruct every foundational theorem from first principles before dismantling high-difficulty board problems and engineering entrance questions. Students keep an individualized error ledger, write weekly timed diagnostic proofs, and receive handwritten commentary on every problem set.",
    pedagogicalFocus: [
      {
        title: "I. Functional Limits, Continuity & First Principles",
        syllabus: "Rigorous epsilon-delta intuition, algebraic and trigonometric limits, indeterminate forms via L'Hôpital's Rule, continuity over closed intervals.",
      },
      {
        title: "II. Differential Geometries & Applied Maxima/Minima",
        syllabus: "Leibniz's successive differentiation theorem, rate of change mechanics, tangents, normals, concavity inflection, and real-world boundary optimization.",
      },
      {
        title: "III. Integral Calculus & Enclosed Quadric Areas",
        syllabus: "Riemann summation convergence, standard substitution transformations, integration by parts reduction formulas, and definite integration area metrics.",
      },
      {
        title: "IV. Coordinate Conics & Vector Space Modeling",
        syllabus: "Orthogonal straight line transformations, pairs of linear equations, standard and rotated parabolas, ellipses, and physical vector scalar/cross computations.",
      },
    ],
    learnerProfile: [
      "Current HSC 1st or 2nd year science students aiming for GPA 5.0 and engineering admission competitiveness.",
      "Solid comprehension of Class 9-10 Algebraic functions and basic trigonometric identities.",
      "Strict willingness to submit 3 weekly practice worksheets without skipping.",
    ],
    tutor: {
      name: "Tanvir Ahmed, M.Sc",
      credential: "Chief Instructor of Mathematical Sciences",
      institution: "BUET (B.Sc & M.Sc in Mathematics)",
      facultyNote:
        "Mathematics only yields to consistent, unhurried craftsmanship. My pedagogical duty is not merely to demonstrate solutions, but to train students in how an analytical mind systematically breaks down an unfamiliar problem.",
      tenure: "7 Years of Continuous Teaching",
      alumniBadge: "BUET Honors Faculty Scholar",
      rating: 4.9,
      reviewsTotal: 38,
      batchesCompleted: 24,
      responseCommitment: "Direct inquiry review within 2 hours",
      directEmail: "tanvir.math@mentorlagbe.com",
      initials: "TA",
    },
  },
}

export default function RedesignedTuitionDetailPage() {
  const params = useParams()
  const rawId = (params?.id as string) || "tui-001"
  const dossier = DOSSIER_RECORD[rawId] || DOSSIER_RECORD["tui-001"]

  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [showApplyModal, setShowApplyModal] = React.useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = React.useState(false)

  // Form states
  const [studentPhone, setStudentPhone] = React.useState("")
  const [preferredSlot, setPreferredSlot] = React.useState("Standard Batch Time")
  const [learnerGoals, setLearnerGoals] = React.useState("")

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    setApplicationSubmitted(true)
  }

  const closeModal = () => {
    setShowApplyModal(false)
    setTimeout(() => {
      setApplicationSubmitted(false)
      setStudentPhone("")
      setLearnerGoals("")
    }, 300)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-24 selection:bg-primary/20 selection:text-foreground">
      {/* ─────────────────────────────────────────────────────────────
          1. EDITORIAL HEADER & METADATA BAR
      ────────────────────────────────────────────────────────────── */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur-md pt-6 pb-8 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Breadcrumb & Actions Strip */}
          <div className="flex items-center justify-between pb-6 border-b border-border/60 text-xs font-mono">
            <Link
              href="/tuitions"
              className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Catalog Index</span>
              <span className="text-border">/</span>
              <span className="text-primary uppercase tracking-wider">{dossier.subject}</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] text-muted-foreground">
                <FileText className="size-3 text-primary" />
                <span>Ref: {dossier.referenceCode}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-[#B87959]/15 border-[#B87959]/40 text-[#B87959]"
                    : "bg-card border-border hover:border-primary/40 text-foreground"
                }`}
              >
                <Bookmark className={`size-3.5 ${isBookmarked ? "fill-[#B87959]" : ""}`} />
                <span className="hidden md:inline">{isBookmarked ? "Cataloged" : "Save Batch"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                    alert("Tuition dossier link copied to clipboard.")
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 text-foreground text-xs cursor-pointer"
              >
                <Share2 className="size-3.5" />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Distinctive Asymmetric Headline Identity */}
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md bg-[#344C43] text-[#EFE7DC] border border-[#344C43]/40 shadow-2xs">
                  {dossier.subject}
                </span>

                <span className="font-mono text-xs font-semibold px-3 py-1 rounded-md bg-primary/15 text-primary border border-primary/30">
                  {dossier.academicTier}
                </span>

                <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1 rounded-md bg-card border border-border text-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{dossier.mode} Delivery</span>
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                {dossier.title}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-3xl">
                {dossier.subtitle}
              </p>
            </div>

            {/* Quick Status Stamp */}
            <div className="lg:col-span-4 lg:text-right space-y-2">
              <div className="inline-block p-4 rounded-2xl bg-card border border-border shadow-2xs text-left w-full sm:w-auto">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                  Current Admission Quota
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-[#B87959]">
                    0{dossier.seatAllocation.remaining}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    seats available of {dossier.seatAllocation.total}
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full bg-background rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-[#B87959] rounded-full"
                    style={{
                      width: `${(dossier.seatAllocation.occupied / dossier.seatAllocation.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. ASYMMETRIC EDITORIAL BODY & STICKY DOCKET
      ────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: THE SCHOLAR'S DOSSIER (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Visual Header Composition: Architectural Image with Offset Framing */}
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
              <div className="relative h-72 sm:h-96 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dossier.bannerImage}
                  alt={dossier.title}
                  className="size-full object-cover filter contrast-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Overlaid Location & Schedule Seal */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex flex-wrap items-center justify-between gap-3 text-white font-mono text-xs">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 backdrop-blur-md">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{dossier.venue}</span>
                  </span>

                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#344C43]/90 border border-white/20 backdrop-blur-md text-[#EFE7DC]">
                    <ShieldCheck className="size-3.5 text-[#B87959]" />
                    <span>Moderated Academic Program</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Schedule & Pacing Visualization */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Weekly Rhythm & Contact Hours
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {dossier.weeklyPace}
                </span>
              </div>

              {/* Rhythmic Days Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dossier.scheduleSchedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87959] font-bold block mb-1">
                      Session 0{idx + 1}
                    </span>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {slot.day}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      {slot.time}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Manifesto / Statement of Intent */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <BookOpen className="size-4 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Manifesto & Teaching Pedagogy
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-2xs leading-relaxed text-sm sm:text-base text-foreground/90 font-sans space-y-4">
                <p>{dossier.manifesto}</p>

                <div className="pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-muted-foreground">
                  <div>
                    <span className="text-[10px] uppercase block">Total Sessions</span>
                    <strong className="text-foreground">{dossier.sessionsPerMonth} / Month</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block">Format</span>
                    <strong className="text-foreground">{dossier.mode} Guild</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block">Per Session Fee</span>
                    <strong className="text-primary">৳ {dossier.feePerSession}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block">Assessments</span>
                    <strong className="text-foreground">Weekly Board Papers</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Pedagogical Focus (Modules Breakdown) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Curriculum Pillars & Syllabus Scope
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  4 Comprehensive Pillars
                </span>
              </div>

              <div className="space-y-3">
                {dossier.pedagogicalFocus.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-card border border-border shadow-2xs hover:border-primary/40 transition-colors space-y-2"
                  >
                    <h3 className="font-heading text-base font-bold text-foreground flex items-baseline gap-2">
                      <CornerDownRight className="size-3.5 text-primary shrink-0 mt-1" />
                      <span>{pillar.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-5 font-sans">
                      {pillar.syllabus}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Student Suitability & Learner Profile */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <GraduationCap className="size-4 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Ideal Candidate Profile
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border shadow-2xs">
                <ul className="space-y-3 text-xs sm:text-sm text-foreground/80">
                  {dossier.learnerProfile.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* The Faculty Monograph: Personal Editorial Feature for Tutor */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Instructor Monograph & Credentials
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#B87959] font-bold">
                  Verified Academic Faculty
                </span>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#344C43] text-[#EFE7DC] shadow-lg relative overflow-hidden space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Monogram Badge */}
                  <div className="size-20 rounded-2xl bg-white/10 text-[#EFE7DC] border border-white/20 font-mono text-2xl font-bold flex items-center justify-center shrink-0">
                    {dossier.tutor.initials}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-2xl font-bold text-[#EFE7DC]">
                        {dossier.tutor.name}
                      </h3>
                      <BadgeCheck className="size-5 text-[#B87959]" />
                    </div>

                    <p className="font-mono text-xs text-[#D9CBB5]/80">
                      {dossier.tutor.credential}
                    </p>

                    <p className="font-mono text-xs text-[#668B78] font-semibold">
                      {dossier.tutor.institution}
                    </p>
                  </div>
                </div>

                {/* Faculty Philosophy Quote */}
                <blockquote className="p-4 rounded-2xl bg-black/25 border-l-2 border-[#B87959] text-xs sm:text-sm italic text-[#D9CBB5] leading-relaxed">
                  &ldquo;{dossier.tutor.facultyNote}&rdquo;
                </blockquote>

                {/* Metric Ledger */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-[#D9CBB5]/80">
                  <div>
                    <span className="text-[10px] uppercase text-[#D9CBB5]/50 block">Faculty Tenure</span>
                    <strong className="text-[#EFE7DC]">{dossier.tutor.tenure}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#D9CBB5]/50 block">Rating</span>
                    <strong className="text-amber-300">★ {dossier.tutor.rating.toFixed(1)} ({dossier.tutor.reviewsTotal})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#D9CBB5]/50 block">Batches Delivered</span>
                    <strong className="text-[#EFE7DC]">{dossier.tutor.batchesCompleted}+ Batches</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#D9CBB5]/50 block">Direct Channel</span>
                    <strong className="text-[#668B78] truncate block">{dossier.tutor.directEmail}</strong>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: THE ARCHIVAL STICKY APPLICATION DOCKET (4 cols) */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-7 shadow-lg space-y-6">
              {/* Top Archival Header Slip */}
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87959] font-bold block">
                    Tuition Subscription
                  </span>
                  <span className="font-mono text-xs text-foreground font-semibold">
                    12 Sessions / Month
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#668B78]/15 text-primary font-bold">
                  Active Intake
                </span>
              </div>

              {/* Fee Visualization Lockup */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase text-muted-foreground block">
                  Monthly Tuition Investment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-extrabold text-foreground">
                    ৳ {dossier.monthlyInvestment.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">/ month</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                  Equivalent to <strong>৳ {dossier.feePerSession}</strong> per 90-min session. No registration surcharge.
                </p>
              </div>

              {/* Tactical Enrollment Status Checklist */}
              <div className="p-4 rounded-2xl bg-background border border-border/80 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Class Frequency:</span>
                  <span className="font-semibold text-foreground">{dossier.daysPerWeek} Days / Week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span className="font-semibold text-primary">{dossier.mode} Batch</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Remaining Seats:</span>
                  <span className="font-bold text-[#B87959]">
                    0{dossier.seatAllocation.remaining} Left in Cohort
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Approval Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Board Approved
                  </span>
                </div>
              </div>

              {/* Primary Application Trigger */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-primary hover:bg-[#537363] text-white font-semibold text-sm shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Enrollment Application</span>
                  <ArrowUpRight className="size-4" />
                </button>

                <p className="text-center font-mono text-[10px] text-muted-foreground">
                  Free application • Tutor confirms seat placement within 24 hours
                </p>
              </div>

              {/* Policy & Safety Seal */}
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-foreground/80 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Applications are reserved exclusively for students. You can monitor or cancel pending submissions directly inside your dashboard.
                </span>
              </div>
            </div>

            {/* Assistance Helpline Docket */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-2xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <HelpCircle className="size-4 text-primary" />
                <span>Academic Advisory Desk</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Have questions regarding the batch syllabus or prerequisite alignment? Our mentors are accessible.
              </p>
              <p className="font-mono text-primary font-bold pt-1">
                +880 1700-000000 (10 AM – 8 PM)
              </p>
            </div>
          </aside>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. RELATED BATCHES: EDITORIAL HORIZONTAL STRIP
        ────────────────────────────────────────────────────────────── */}
        <section className="mt-20 pt-12 border-t border-border/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#B87959] font-bold">
                Alternative Cohorts
              </span>
              <h2 className="font-heading text-2xl font-bold text-foreground mt-0.5">
                Related Academic Batches
              </h2>
            </div>

            <Link
              href="/tuitions"
              className="text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              Browse Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">Physics</span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Quantum Physics & Derivations Masterclass
                </h3>
                <p className="text-xs text-muted-foreground font-mono">By Dr. Samia Rahman • Class 10 / SSC</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">৳ 3,800/mo</span>
                <Link href="/tuitions/tui-002" className="text-xs font-semibold text-primary hover:underline">
                  View Dossier →
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">Computer Science</span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Full-Stack Web Engineering Mentorship
                </h3>
                <p className="text-xs text-muted-foreground font-mono">By Abrar Fahad • Undergrad</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">৳ 6,000/mo</span>
                <Link href="/tuitions/tui-003" className="text-xs font-semibold text-primary hover:underline">
                  View Dossier →
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">IELTS</span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  IELTS Band 8.0 Intensive & Speaking Lab
                </h3>
                <p className="text-xs text-muted-foreground font-mono">By Nafis Kamal • Higher Studies</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-foreground">৳ 5,200/mo</span>
                <Link href="/tuitions/tui-004" className="text-xs font-semibold text-primary hover:underline">
                  View Dossier →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE APPLICATION DOCKET MODAL (UI Only)
      ────────────────────────────────────────────────────────────── */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl text-foreground">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 size-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {applicationSubmitted ? (
              <div className="py-6 text-center space-y-4">
                <div className="size-16 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="size-8" />
                </div>

                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  Enrollment Request Dispatched
                </span>

                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Application Logged in Academic Ledger
                </h3>

                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your seat reservation request for <strong>{dossier.title}</strong> has been saved with status <span className="font-mono text-[#B87959] font-bold">Pending</span>. Instructor {dossier.tutor.name} will review your application.
                </p>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-[#537363] transition-colors cursor-pointer"
                  >
                    Done
                  </button>

                  <Link
                    href="/dashboard/student/my-applications"
                    className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-background text-xs font-semibold text-foreground transition-colors"
                  >
                    View in Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="border-b border-border/80 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#B87959] font-bold">
                    Official Student Application
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground mt-0.5">
                    Apply for {dossier.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Faculty: {dossier.tutor.name} • Monthly: ৳{dossier.monthlyInvestment.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">
                      Direct Student Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">
                      Schedule Preference
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <option value="Standard Batch Time">Standard Batch Time (Sat/Mon/Wed 4:00 PM)</option>
                      <option value="Alternative Evening">Alternative Evening Slot (Discuss with Tutor)</option>
                      <option value="Weekend Mornings">Weekend Mornings Focus</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono uppercase font-semibold text-foreground block mb-1">
                      Academic Objectives & Note to Faculty
                    </label>
                    <textarea
                      rows={3}
                      value={learnerGoals}
                      onChange={(e) => setLearnerGoals(e.target.value)}
                      placeholder="Mention your target board examination, current marks, and specific mathematical topics you wish to prioritize..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/80 flex items-start gap-2 text-[11px] text-muted-foreground">
                  <AlertCircle className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Your submission creates an entry in the applications ledger with status <strong>Pending</strong>. You can cancel at any time before acceptance.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-card cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-[#537363] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Submit to Faculty</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
