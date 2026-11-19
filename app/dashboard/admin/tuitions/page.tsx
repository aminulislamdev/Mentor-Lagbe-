"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  ChevronDown,
  XCircle,
  CheckCircle2,
  ArrowUpDown,
  BadgeCheck,
  Inbox,
  CalendarDays,
  MapPin,
  Wallet,
  Wifi,
  Eye,
  ClipboardCheck,
  Stamp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IndexPanel, Monogram, StatusChip, EmptyState, Colophon } from "@/components/dashboard/shared"

type ReviewStatus = "pending" | "approved" | "rejected"

interface Submission {
  ref: string
  title: string
  subject: string
  classLevel: string
  tutorName: string
  tutorEmail: string
  tutorVerified: boolean
  monthlySalary: number
  mode: "Online" | "Offline"
  location: string
  daysPerWeek: number
  submittedAt: string
  submittedSort: number
  status: ReviewStatus
  bannerImage: string
  description: string
  requirements: string[]
  strengths: string
}

const SUBMISSIONS: Submission[] = [
  {
    ref: "ML-1030",
    title: "IELTS Writing Task 2 — Band 8 Framework Lab",
    subject: "IELTS",
    classLevel: "University / Higher Studies",
    tutorName: "Mr. Nafis Kamal",
    tutorEmail: "nafis.kamal@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 5500,
    mode: "Online",
    location: "Live classroom · Zoom",
    daysPerWeek: 3,
    submittedAt: "28 Nov '26 · 13:05",
    submittedSort: 202611281305,
    status: "pending",
    bannerImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    description: "A rubric-first writing lab covering both TASK 2 essay archetypes — argument and discussion — with weekly 1-on-1 tutor marking, examiner-style feedback loops, and a 25-essay before/after portfolio.",
    requirements: ["Band 6.0+ in Writing already reached", "Commit to 6 weeks of weekly essay drafts", "Own laptop with working webcam"],
    strengths: "CELTA certified · Band 8.5 scorer · 340+ scholars placed",
  },
  {
    ref: "ML-1029",
    title: "O-Level Biology — Cell Division Masterclass",
    subject: "Biology",
    classLevel: "O-Level (Class 9–10)",
    tutorName: "Ms. Sadia Hossain",
    tutorEmail: "sadia.hossain@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 3400,
    mode: "Offline",
    location: "Uttara Sector 7, Dhaka",
    daysPerWeek: 2,
    submittedAt: "28 Nov '26 · 11:20",
    submittedSort: 202611281120,
    status: "pending",
    bannerImage: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    description: "Microscope-lab fused biology: meiosis vs mitosis under real slides, animated sequence diagrams every session, plus diagram-drawing drills tuned to O-Level mark schemes.",
    requirements: ["O-Level candidate or repeater", "Bring lab notebook (provided first session)", "Parent consent signature for lab access"],
    strengths: "DMC MBBS candidate · 4 yrs O-Level teaching",
  },
  {
    ref: "ML-1028",
    title: "Admission Physics — Wave Optics Sprint",
    subject: "Physics",
    classLevel: "Admission — BUET / DU / Medical",
    tutorName: "Mr. Tanvir Alam",
    tutorEmail: "tanvir.alam@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 4900,
    mode: "Offline",
    location: "BUET Road, Shahbagh",
    daysPerWeek: 4,
    submittedAt: "28 Nov '26 · 09:47",
    submittedSort: 202611280947,
    status: "pending",
    bannerImage: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80",
    description: "Four days a week targeted at BUET & DU written physics: Young's double-slit from first principles, diffraction gratings, JEE-pattern numericals, weekly OMR mock with negative-marking strategy.",
    requirements: ["HSC '26 candidate targeting BUET/DU", "Vectors & kinematics complete", "Own stopwatch for timed drills"],
    strengths: "BUET '28 · 10 years admission wing · 412 seat holders",
  },
  {
    ref: "ML-1027",
    title: "HSC Chemistry — Reaction Mechanisms Decoded",
    subject: "Chemistry",
    classLevel: "HSC (2026 batch)",
    tutorName: "Dr. Nasrin Islam",
    tutorEmail: "nasrin@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 3900,
    mode: "Offline",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    daysPerWeek: 3,
    submittedAt: "27 Nov '26 · 21:14",
    submittedSort: 202611272114,
    status: "pending",
    bannerImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    description: "Mechanism-first organic chemistry for HSC '26 — draw the arrows, predict the products, never memorise a reaction again. Includes one full board-paper mock every fortnight, marked line by line.",
    requirements: ["Completed Organic Ch. 1–4 syllabus", "Own copy of the mechanism workbook (provided)", "Attend Friday 18:00 problem clinics"],
    strengths: "BUET '12 · 7 yrs HSC chemistry · 9/12 seats already inked",
  },
  {
    ref: "ML-1024",
    title: "Chemistry — Functional Groups, Finally",
    subject: "Chemistry",
    classLevel: "HSC (2026 batch)",
    tutorName: "Ms. Sadia Hossain",
    tutorEmail: "sadia.hossain@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 3800,
    mode: "Online",
    location: "Online · Zoom cohort",
    daysPerWeek: 1,
    submittedAt: "19 Nov '26 · 08:02",
    submittedSort: 202611190802,
    status: "approved",
    bannerImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85c?auto=format&fit=crop&w=800&q=80",
    description: "One focused session a week, Sunday 16:00 sharp — nomenclature, reactions, and board-trap recognition across all functional groups with weekly formula drills.",
    requirements: ["HSC '26 candidate", "Camera on during sessions", "Workbook purchased before week 2"],
    strengths: "Dhaka Medical '29 · 4 yrs O-Level/HSC",
  },
  {
    ref: "ML-1021",
    title: "HSC Physics — The Integration Finals",
    subject: "Physics",
    classLevel: "HSC (2026 batch)",
    tutorName: "Dr. Nasrin Islam",
    tutorEmail: "nasrin@mentorlagbe.com",
    tutorVerified: true,
    monthlySalary: 4500,
    mode: "Offline",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    daysPerWeek: 2,
    submittedAt: "12 Nov '26 · 14:30",
    submittedSort: 202611121430,
    status: "approved",
    bannerImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    description: "Integration by parts from absolute zero to board-exam fluency — first-principles derivations, weekly timed problem staircases, and two full board mocks with examiner-style marking.",
    requirements: ["Limits & differentiation complete", "Own notebook + graph set", "Friday attendance non-negotiable"],
    strengths: "BUET '12 · 7 yrs · 84 scholars placed in BUET/DU/Medical",
  },
  {
    ref: "ML-1012",
    title: "Physics — Vectors Bootcamp (Guaranteed Admission)",
    subject: "Physics",
    classLevel: "HSC (2026 batch)",
    tutorName: "Mr. Arif Hossain",
    tutorEmail: "arif.hossain@mentorlagbe.com",
    tutorVerified: false,
    monthlySalary: 4000,
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    daysPerWeek: 1,
    submittedAt: "30 Aug '26 · 17:45",
    submittedSort: 202608301745,
    status: "rejected",
    bannerImage: "https://images.unsplash.com/photo-1561091919-bc8734d023a2?auto=format&fit=crop&w=800&q=80",
    description: "Vectors and kinematics bootcamp promising guaranteed admission outcomes with mock drills and handwritten notes.",
    requirements: ["HSC candidate", "'Weekend batch only' schedule"],
    strengths: "Claims 100% board success rate — unverifiable",
  },
  {
    ref: "ML-1009",
    title: "Maths — 100% Board Success Batch",
    subject: "Mathematics",
    classLevel: "HSC (2025 repeaters)",
    tutorName: "Mr. Arif Hossain",
    tutorEmail: "arif.hossain@mentorlagbe.com",
    tutorVerified: false,
    monthlySalary: 4200,
    mode: "Online",
    location: "Online · Zoom",
    daysPerWeek: 3,
    submittedAt: "13 Nov '26 · 15:02",
    submittedSort: 202611131502,
    status: "rejected",
    bannerImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    description: "Repeater-focused mathematics with guaranteed board outcomes, unlimited doubt sessions, and daily problem bursts.",
    requirements: ["Failed HSC 2025", "Device + webcam mandatory"],
    strengths: "Self-declared expert — no board certification provided",
  },
]

const SUBJECTS = ["All Subjects", "Physics", "Chemistry", "Biology", "Mathematics", "IELTS"] as const

const STATUS_FILTERS: Array<{ key: "all" | ReviewStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
]

const MODE_FILTERS: Array<{ key: "all" | "Online" | "Offline"; label: string }> = [
  { key: "all", label: "All Modes" },
  { key: "Online", label: "Online" },
  { key: "Offline", label: "Offline" },
]

type SortKey = "newest" | "oldest" | "feeAsc" | "feeDesc"

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "feeAsc", label: "Fee · low to high" },
  { key: "feeDesc", label: "Fee · high to low" },
]

const STATUS_META: Record<ReviewStatus, { label: string; tone: "terracotta" | "sage" | "rose"; Icon: typeof CalendarDays; stampBorder: string; stampText: string }> = {
  pending: {
    label: "Pending Review",
    tone: "terracotta",
    Icon: CalendarDays,
    stampBorder: "border-[#B87959]/75",
    stampText: "text-[#C98B6D]",
  },
  approved: {
    label: "Approved",
    tone: "sage",
    Icon: CheckCircle2,
    stampBorder: "border-[#7AA890]/75",
    stampText: "text-[#9DBFA9]",
  },
  rejected: {
    label: "Rejected",
    tone: "rose",
    Icon: XCircle,
    stampBorder: "border-[#A34343]/70",
    stampText: "text-[#E8B4B4]",
  },
}

const fmtFee = (n: number) => `৳${n.toLocaleString("en-IN")}`

const studioStyles = `
  .studio-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .studio-review-root ::selection { background: #C9A25E; color: #10181A; }

  @keyframes studio-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .studio-rise { animation: studio-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes studio-dialog-in {
    from { opacity: 0.4; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .studio-dialog { animation: studio-dialog-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @media (prefers-reduced-motion: reduce) {
    .studio-rise, .studio-dialog { animation: none !important; }
  }
`

// ─── Confirmation dialogs ────────────────────────────────────────────────────

function RulingDialog({
  kind,
  submission,
  onClose,
  onConfirm,
}: {
  kind: "approve" | "reject"
  submission: Submission
  onClose: () => void
  onConfirm: () => void
}) {
  const isApprove = kind === "approve"
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isApprove ? "Approve tuition submission" : "Reject tuition submission"}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#10181A]/78 backdrop-blur-[3px]"
      />
      <div
        className={cn(
          "studio-dialog relative w-full max-w-md border p-6 shadow-2xl",
          isApprove ? "border-[#7AA890]/40 bg-[#141E1B]" : "border-[#A34343]/45 bg-[#2B1B18]"
        )}
      >
        <span aria-hidden="true" className={cn(
          "absolute right-4 top-4 select-none font-mono text-[24px] leading-none",
          isApprove ? "text-[#C9A25E]/75" : "text-[#A34343]/75"
        )}>
          {isApprove ? "§" : "⌧"}
        </span>
        <p className={cn(
          "font-mono text-[10px] uppercase tracking-[0.32em]",
          isApprove ? "text-[#C9A25E]" : "text-[#E8B4B4]"
        )}>
          {isApprove ? "The Seal of Approval" : "The Returned Proof"}
        </p>
        <h3 className={cn(
          "studio-serif mt-1.5 text-2xl font-black leading-tight tracking-tight",
          isApprove ? "text-[#F2EDDF]" : "text-[#F7EDE1]"
        )}>
          {isApprove ? "Ink this batch live?" : "Return this submission?"}
        </h3>
        <p className={cn(
          "mt-2 text-[13px] leading-relaxed",
          isApprove ? "text-[#F2EDDF]/72" : "text-[#F7EDE1]/72"
        )}>
          {isApprove ? (
            <>You are approving <strong className="text-[#F2EDDF]">{submission.title}</strong> by <strong className="text-[#F2EDDF]">{submission.tutorName}</strong>. The listing goes live on the public index immediately with a verified seal.</>
          ) : (
            <>You are rejecting <strong className="text-[#F7EDE1]">{submission.title}</strong>. The tutor receives a kind one-line note and may revise and resubmit next term.</>
          )}
        </p>
        <p className={cn(
          "mt-4 border-t pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em]",
          isApprove ? "border-[#F2EDDF]/12 text-[#F2EDDF]/45" : "border-[#F7EDE1]/12 text-[#F7EDE1]/45"
        )}>
          {isApprove
            ? "Goes live to 12,847 scholars · board notified"
            : "Off-brief outcome claims · Tutor notified with reason"}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className={cn(
              "h-11 rounded-sm px-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em]",
              isApprove ? "text-[#F2EDDF]/60 hover:bg-[#F2EDDF]/8 hover:text-[#F2EDDF]" : "text-[#F7EDE1]/60 hover:bg-[#F7EDE1]/8 hover:text-[#F7EDE1]"
            )}
          >
            {isApprove ? "Hold Review" : "Keep In Queue"}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={cn(
              "h-11 rounded-sm border px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] shadow-[4px_4px_0_#10181A]",
              isApprove
                ? "border-[#D8C9A3]/55 bg-[#C9A25E] text-[#10181A] hover:bg-[#D8B67A]"
                : "border-[#D98C8C]/40 bg-[#A34343] text-[#F7EDE1] hover:bg-[#B85252]"
            )}
          >
            {isApprove ? "Affix the Seal" : "Seal the Return"}
          </Button>
        </div>
      </div>
    </div>
  )
}


// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminTuitionsPage() {
  const [items, setItems] = useState<Submission[]>(SUBMISSIONS)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All Subjects")
  const [status, setStatus] = useState<"all" | ReviewStatus>("all")
  const [mode, setMode] = useState<"all" | "Online" | "Offline">("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedRef, setSelectedRef] = useState(SUBMISSIONS[0].ref)
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null)
  const [dossierOpen, setDossierOpen] = useState(false)

  // Escape closes dialog + scroll lock
  useEffect(() => {
    if (!dialog) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDialog(null)
    }
    document.addEventListener("keydown", onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prev
    }
  }, [dialog])

  const counts = useMemo(
    () => ({
      submitted: items.length,
      pending: items.filter((s) => s.status === "pending").length,
      approved: items.filter((s) => s.status === "approved").length,
      rejected: items.filter((s) => s.status === "rejected").length,
    }),
    [items]
  )

  const visible = useMemo(() => {
    let list = items.filter((s) => {
      if (status !== "all" && s.status !== status) return false
      if (mode !== "all" && s.mode !== mode) return false
      if (subject !== "All Subjects" && s.subject !== subject) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [s.title, s.tutorName, s.subject, s.classLevel, s.ref, s.location]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    switch (sort) {
      case "oldest":
        list = [...list].sort((a, b) => a.submittedSort - b.submittedSort)
        break
      case "feeAsc":
        list = [...list].sort((a, b) => a.monthlySalary - b.monthlySalary)
        break
      case "feeDesc":
        list = [...list].sort((a, b) => b.monthlySalary - a.monthlySalary)
        break
      default:
        list = [...list].sort((a, b) => b.submittedSort - a.submittedSort)
    }
    return list
  }, [items, query, subject, status, mode, sort])

  const selected = items.find((s) => s.ref === selectedRef) ?? items[0] ?? null

  const decide = (ref: string, verdict: ReviewStatus) => {
    setItems((prev) => prev.map((s) => (s.ref === ref ? { ...s, status: verdict } : s)))
    setDialog(null)
  }

  // Verdict barometer segments
  const segments = [
    { label: "Pending", count: counts.pending, tone: "#B87959" },
    { label: "Approved", count: counts.approved, tone: "#668B78" },
    { label: "Rejected", count: counts.rejected, tone: "#A34343" },
  ]
  const segTotal = Math.max(1, segments.reduce((n, s) => n + s.count, 0))

  return (
    <div className="studio-review-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{studioStyles}</style>

      {/* ══ MASTHEAD — the review studio ═════════════════════════════════ */}
      <div
        className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 76% -10%, rgba(216,201,163,0.15) 0%, transparent 55%), radial-gradient(rgba(237,232,218,0.045) 1px, transparent 1.4px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#D8C9A3]/14" />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pb-7">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — The Review Studio ]
              </p>
              <h1
                className="studio-rise studio-serif mt-2.5 font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}
              >
                Tuition
                <span className="block">
                  <span className="italic text-[#C9A25E]">Review Studio.</span>
                  <span aria-hidden="true" className="text-[#B87959]">.</span>
                </span>
              </h1>
              <p className="studio-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/72" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                Every batch awaiting your ink — read the proof, check the
                credentials, and stamp the seal. Board SLA: two working days,
                no exceptions, no exceptions.
              </p>
            </div>
            {/* Pending count hero */}
            <div className="lg:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#F2EDDF]/40">
                Pending Review
              </p>
              <div className="mt-1 flex items-end gap-3">
                <p className="studio-serif text-6xl font-black leading-none text-[#C9A25E] sm:text-7xl">
                  {String(counts.pending).padStart(2, "0")}
                </p>
                <p className="mb-1 font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-[#F2EDDF]/50">
                  Proofs on the<br />review desk
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MODERATION OVERVIEW — verdict barometer ═════════════════════ */}
      <div className="border-b border-[#D8C9A3]/25 bg-[#10181A]" aria-label="Moderation overview">
        <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]/75">
              The Ruling Ledger — Trailing 180 Days
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#F2EDDF]/50">
              Total submitted — <span className="font-bold text-[#F2EDDF]">{counts.submitted + 527}</span> · Resolve rate <span className="font-bold text-[#9DBFA9]">97.4%</span>
            </p>
          </div>
          <div className="mt-1.5 flex h-9 w-full overflow-hidden rounded-sm border border-[#F2EDDF]/15 sm:h-11" role="presentation">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center justify-center border-r border-[#10181A]/40 last:border-r-0"
                style={{ width: `${(seg.count / segTotal) * 100}%`, backgroundColor: seg.tone, minWidth: seg.count > 0 ? "2.2rem" : "0" }}
                title={`${seg.label}: ${seg.count}`}
              >
                <span className="studio-serif text-lg font-black leading-none text-[#EFE7DC] sm:text-2xl">
                  {seg.count}
                </span>
              </div>
            ))}
          </div>
          <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
            {segments.map((seg) => (
              <li key={seg.label} className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F2EDDF]/55">
                <span aria-hidden="true" className="inline-block size-2.5" style={{ backgroundColor: seg.tone }} />
                {seg.label} — {seg.count}
              </li>
            ))}
            <li className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#F2EDDF]/35">
              527 ruled historically
            </li>
          </ul>
        </div>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[1280px] space-y-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        {/* ── Sorting desk ── */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="studio-subject" className="relative">
              <span className="sr-only">Filter by subject</span>
              <select
                id="studio-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number])}
                className="h-10 appearance-none rounded-sm border border-[#10181A]/30 bg-[#FCFAF2] pl-3 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#10181A] outline-none transition-all hover:border-[#10181A]/55 focus:border-[#C9A25E] focus:ring-2 focus:ring-[#C9A25E]/25 sm:text-[10px]"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/55" strokeWidth={2} />
            </label>
            {/* Status pills */}
            <div role="group" aria-label="Filter by review status" className="flex gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const active = status === f.key
                const n = f.key === "all" ? counts.submitted : f.key === "pending" ? counts.pending : f.key === "approved" ? counts.approved : counts.rejected
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStatus(f.key)}
                    className={cn(
                      "flex h-10 items-baseline gap-1.5 rounded-sm border px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A] sm:px-3 sm:text-[10px]",
                      active
                        ? "border-[#D8C9A3] bg-[#10181A] text-[#D8C9A3]"
                        : "border-[#10181A]/30 text-[#10181A]/70 hover:border-[#10181A]/60 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#C9A25E]" : "text-[#B87959]")}>{n}</span>
                  </button>
                )
              })}
            </div>
            {/* Mode toggle */}
            <div role="group" aria-label="Filter by teaching mode" className="flex rounded-sm border border-[#10181A]/30">
              {MODE_FILTERS.map((f) => {
                const active = mode === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMode(f.key)}
                    className={cn(
                      "h-10 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#10181A] sm:text-[10px]",
                      active ? "bg-[#10181A] text-[#D8C9A3]" : "text-[#10181A]/60 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="studio-search" className="relative min-w-0 flex-1 lg:w-60 lg:flex-none">
              <span className="sr-only">Search submissions by title, tutor, subject, or reference</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45" strokeWidth={1.75} />
              <Input
                id="studio-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the proofs…"
                className="h-10 rounded-sm border-[#10181A]/30 bg-[#FCFAF2] pl-9 text-[13px] placeholder:text-[#10181A]/38 focus:border-[#C9A25E] focus:ring-[#C9A25E]/25"
              />
            </label>
            <label htmlFor="studio-sort" className="relative shrink-0">
              <span className="sr-only">Sort submissions</span>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45" strokeWidth={1.75} />
              <select
                id="studio-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 appearance-none rounded-sm border border-[#10181A]/30 bg-[#FCFAF2] pl-9 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#10181A] outline-none transition-all hover:border-[#10181A]/55 focus:border-[#C9A25E] focus:ring-2 focus:ring-[#C9A25E]/25 sm:text-[10px]"
              >
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/55" strokeWidth={2} />
            </label>
          </div>
        </div>

        {/* ── Index + proof sheet ── */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">

          {/* Left — the submission ledger */}
          <IndexPanel
            tab="The Submission Ledger"
            meta={`${visible.length} of ${items.length} on view`}
            className="lg:col-span-7"
          >
            {visible.length === 0 ? (
              <EmptyState
                Icon={Inbox}
                tone="terminal"
                title={<>The studio is <span className="italic text-[#C9A25E]">clear.</span></>}
                description={query.trim()
                  ? `No submission matches “${query.trim()}” — the board keeps honest books.`
                  : "Nothing filed under these filters — every proof ruled upon."}
                actionLabel="Clear the desk"
                onAction={() => { setQuery(""); setSubject("All Subjects"); setStatus("all"); setMode("all") }}
              />
            ) : (
              <ol className="space-y-2.5">
                {visible.map((s) => {
                  const active = s.ref === selectedRef
                  const meta = STATUS_META[s.status]
                  return (
                    <li key={s.ref}>
                      <button
                        type="button"
                        onClick={() => { setSelectedRef(s.ref); setDossierOpen(false) }}
                        aria-pressed={active}
                        aria-label={`Open proof sheet for ${s.ref}, ${s.title} by ${s.tutorName} — ${meta.label}`}
                        className={cn(
                          "group grid w-full grid-cols-[4.5rem_1fr] items-stretch border text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E] sm:grid-cols-[6.5rem_1fr_auto]",
                          active
                            ? "border-[#C9A25E] bg-[#C9A25E]/10"
                            : "border-[#10181A]/25 bg-[#FCFAF2] hover:border-[#10181A]/55"
                        )}
                      >
                        {/* Banner thumbnail */}
                        <span className="relative block overflow-hidden border-r border-[#10181A]/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.bannerImage}
                            alt={`Banner for ${s.title}`}
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#10181A]/75 via-[#10181A]/15 to-transparent" />
                          <span className="absolute bottom-1 left-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#EDE8DA]">
                            {s.mode}
                          </span>
                        </span>

                        {/* Body */}
                        <span className="min-w-0 px-2.5 py-2 sm:px-3 sm:py-2.5">
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#B87959] sm:text-[10px]">
                            {s.ref} · {s.subject}
                          </span>
                          <span className="studio-serif mt-0.5 block text-[11px] font-black leading-snug tracking-tight sm:text-[12.5px]">
                            {s.title}
                          </span>
                          <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-[#10181A]/60 sm:text-[10px]">
                            {s.tutorName} · {s.classLevel}
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#10181A]/55 sm:text-[10px]">
                            <span className="font-bold text-[#10181A]">{fmtFee(s.monthlySalary)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{s.daysPerWeek}×/wk</span>
                            <span aria-hidden="true" className="hidden sm:inline">·</span>
                            <span className="hidden sm:inline">{s.submittedAt.split("·")[0].trim()}</span>
                          </span>
                        </span>

                        {/* Status chip */}
                        <span className="hidden flex-col items-center justify-center border-l border-[#10181A]/15 px-2.5 sm:flex">
                          <StatusChip tone={meta.tone} icon={meta.Icon}>
                            {meta.label}
                          </StatusChip>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </IndexPanel>

          {/* Right — the proof ruling sheet */}
          {selected && (
            <IndexPanel
              tab="The Ruling Sheet"
              meta={selected.ref}
              className="lg:col-span-5 lg:sticky lg:top-[136px]"
            >
              {/* Banner */}
              <div className="relative h-36 w-full overflow-hidden border border-[#10181A]/30 sm:h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.bannerImage}
                  alt={`Banner for ${selected.title}`}
                  className="absolute inset-0 size-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#10181A]/85 via-[#10181A]/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                  <span className="border border-[#D8C9A3]/55 bg-[#10181A]/75 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#D8C9A3] backdrop-blur-sm">
                    {selected.subject}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block -rotate-11 border-2 border-dashed px-2 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.2em]",
                      selected.status === "pending" && "border-[#C9A25E] text-[#D8C9A3]",
                      selected.status === "approved" && "border-[#7AA890] text-[#9DBFA9]",
                      selected.status === "rejected" && "border-[#A34343] text-[#E8B4B4]"
                    )}
                  >
                    {selected.status === "pending" ? "AWAITING" : selected.status === "approved" ? "SEALED" : "RETURNED"}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#B87959]">
                  {selected.ref} · Submitted {selected.submittedAt}
                </p>
                <h3 className="studio-serif mt-1 text-xl font-black leading-tight tracking-tight sm:text-2xl">
                  {selected.title}
                </h3>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#10181A]/55">
                  {selected.subject} · <span className="text-[#10181A]">{selected.classLevel}</span>
                </p>

                {/* Tutor strip */}
                <div className="mt-3 flex items-center gap-2.5 border border-[#10181A]/20 bg-[#F2EDDF] p-2.5">
                  <Monogram initials={selected.tutorName.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/, "").charAt(0).toUpperCase()} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-semibold tracking-tight">{selected.tutorName}</span>
                      {selected.tutorVerified && <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />}
                    </span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/55">
                      {selected.tutorEmail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase leading-snug tracking-[0.16em] text-[#10181A]/50 text-right">
                    {selected.strengths.split("·")[0].trim()}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-[11.5px] leading-relaxed text-[#10181A]/80">
                  {selected.description}
                </p>

                {/* Requirements */}
                <div className="mt-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#10181A]/60">
                    Board Requirements
                  </p>
                  <ul className="mt-1 space-y-1">
                    {selected.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#10181A]/80">
                        <ClipboardCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ledger rows */}
                <dl className="mt-3 divide-y divide-[#10181A]/12 border-y border-[#10181A]/20 text-[10.5px]">
                  {[
                    { Icon: Wallet, k: "Salary", v: `${fmtFee(selected.monthlySalary)} / month` },
                    { Icon: selected.mode === "Online" ? Wifi : MapPin, k: "Mode", v: `${selected.mode} · ${selected.daysPerWeek} days/week` },
                    { Icon: MapPin, k: "Location", v: selected.location },
                  ].map(({ Icon, k, v }) => (
                    <div key={k} className="flex items-baseline gap-2.5 py-1.5">
                      <Icon aria-hidden="true" className="size-3.5 shrink-0 translate-y-[2px] text-[#C9A25E]" strokeWidth={2} />
                      <dt className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-[#10181A]/50">{k}</dt>
                      <dd className="font-semibold leading-snug tracking-tight">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* View details toggle */}
                <button
                  type="button"
                  onClick={() => setDossierOpen((v) => !v)}
                  aria-expanded={dossierOpen}
                  aria-controls="ruling-dossier"
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#10181A] underline decoration-[#C9A25E] decoration-2 underline-offset-4 transition-colors hover:text-[#7A6A35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
                >
                  <Eye aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {dossierOpen ? "Hide submission dossier" : "View Details"}
                </button>

                {dossierOpen && (
                  <dl id="ruling-dossier" className="mt-3 grid grid-cols-1 gap-2 border border-dashed border-[#10181A]/35 bg-[#F2EDDF]/60 p-3 sm:grid-cols-2">
                    {[
                      ["Reference", selected.ref],
                      ["Tutor verification", selected.tutorVerified ? "Verified — sealed" : "Unverified — board review"],
                      ["Submission window", selected.submittedAt],
                      ["Board SLA", "2 working days"],
                      ["Strengths", selected.strengths],
                      ["Checklist", `${selected.requirements.length} requirements verified`],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10181A]/50">{k}</dt>
                        <dd className="mt-0.5 text-[10px] font-semibold leading-snug tracking-tight">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Ruling actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#10181A]/15 pt-3">
                  <Button
                    type="button"
                    onClick={() => setDialog("approve")}
                    className="h-11 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#9DBFA9] hover:bg-[#1E2A24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A]"
                  >
                    <CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
                    Approve Tuition
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setDialog("reject")}
                    className="h-11 rounded-sm border border-[#A34343]/50 bg-transparent px-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#A34343] hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                  >
                    <XCircle aria-hidden="true" className="size-4" strokeWidth={2} />
                    Reject Tuition
                  </Button>
                </div>
              </div>
            </IndexPanel>
          )}
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/admin" backLabel="Back to the Command Center" tone="ink">
          <span className="inline-flex items-center gap-1.5">
            <Stamp aria-hidden="true" className="size-4 text-[#C9A25E]" strokeWidth={2} />
            Every ruling inked — the board answers to the ledger
          </span>
        </Colophon>
      </div>

      {/* ══ Ruling dialogs ═══════════════════════════════════════════════ */}
      {dialog && selected && (
        <RulingDialog
          kind={dialog}
          submission={selected}
          onClose={() => setDialog(null)}
          onConfirm={() => decide(selected.ref, dialog === "approve" ? "approved" : "rejected")}
        />
      )}
    </div>
  )
}
