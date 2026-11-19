"use client"

import { useMemo, useState } from "react"
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  CalendarDays,
  Mail,
  Phone,
  Users,
  Inbox,
  Eye,
  Hourglass,
  BadgeCheck,
  MailX,
  MapPin,
  GraduationCap,
  FileText,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EmptyState, Colophon } from "@/components/dashboard/shared"

// ─── Static applicant data ───────────────────────────────────────────────────

type AppStatus = "pending" | "accepted" | "rejected"

interface Applicant {
  ref: string
  name: string
  initials: string
  classLevel: string
  gpa: string
  email: string
  phone: string
  tuitionRef: string
  tuitionTitle: string
  subject: string
  tuitionTone: string
  monthlySalary: number
  preferredSchedule: string
  appliedAt: string
  appliedSort: number
  status: AppStatus
  note: string
  guardian: string
  board: string
  source: string
}

const APPLICANTS: Applicant[] = [
  {
    ref: "#AP-1042",
    name: "Tasnim Rahman",
    initials: "TR",
    classLevel: "HSC · 2026 batch",
    gpa: "GPA 5.00 · Dhaka Board",
    email: "tasnim.rahman@scholarmail.com",
    phone: "+880 1711-405 903",
    tuitionRef: "ML-1021",
    tuitionTitle: "HSC Physics — The Integration Finals",
    subject: "Physics",
    tuitionTone: "#1E3A2F",
    monthlySalary: 4500,
    preferredSchedule: "Fri & Sat · Evenings",
    appliedAt: "17 Nov '26",
    appliedSort: 20261117,
    status: "pending",
    note: "Integration by parts kept beating me until I read your chapter twice. I want in on the batch — front bench, or nothing.",
    guardian: "Mr. Imran Rahman (father)",
    board: "Dhaka Board · HSC '26",
    source: "Guardian recommendation",
  },
  {
    ref: "#AP-1041",
    name: "Rafia Sultana",
    initials: "RS",
    classLevel: "HSC · 2026 batch",
    gpa: "GPA 4.92 · Comilla Board",
    email: "rafia.sultana@scholarmail.com",
    phone: "+880 1819-233 674",
    tuitionRef: "ML-1021",
    tuitionTitle: "HSC Physics — The Integration Finals",
    subject: "Physics",
    tuitionTone: "#1E3A2F",
    monthlySalary: 4500,
    preferredSchedule: "Fri & Sat · Evenings",
    appliedAt: "16 Nov '26",
    appliedSort: 20261116,
    status: "pending",
    note: "I need a mentor who will not let me hide behind average mock marks. Six weeks, full commitment — I will show up every session.",
    guardian: "Mrs. Shireen Sultana (mother)",
    board: "Comilla Board · HSC '26",
    source: "Tuition directory",
  },
  {
    ref: "#AP-1038",
    name: "Mahin Chowdhury",
    initials: "MC",
    classLevel: "Admit · BUET ’31 (target)",
    gpa: "N/A — admission candidate",
    email: "mahin.chowdhury@scholarmail.com",
    phone: "+880 1911-742 208",
    tuitionRef: "ML-1018",
    tuitionTitle: "Higher Maths — Admission Marathon",
    subject: "Higher Maths",
    tuitionTone: "#B87959",
    monthlySalary: 5200,
    preferredSchedule: "Tue & Thu · Late afternoons",
    appliedAt: "11 Nov '26",
    appliedSort: 20261111,
    status: "pending",
    note: "BUET Civil or nothing. I want the marathon — the problem sets, the OMR drills, the public mocks. Teach me like the board already said yes.",
    guardian: "Mr. Nasir Chowdhury (father)",
    board: "Dhaka Board · HSC '26",
    source: "MentorLagbe index",
  },
  {
    ref: "#AP-1035",
    name: "Sumaiya Akter",
    initials: "SA",
    classLevel: "HSC · 2026 batch",
    gpa: "GPA 5.00 · Dhaka Board",
    email: "sumaiya.akter@scholarmail.com",
    phone: "+880 1713-509 812",
    tuitionRef: "ML-1021",
    tuitionTitle: "HSC Physics — The Integration Finals",
    subject: "Physics",
    tuitionTone: "#1E3A2F",
    monthlySalary: 4500,
    preferredSchedule: "Fri & Sat · Evenings",
    appliedAt: "08 Nov '26",
    appliedSort: 20261108,
    status: "accepted",
    note: "I completed chapter 4 on my own and only half of it made sense — which means I need the whole arc. Bring on the winter batch.",
    guardian: "Mrs. Farhana Akter (mother)",
    board: "Dhaka Board · HSC '26",
    source: "Guardian recommendation",
  },
  {
    ref: "#AP-1033",
    name: "Fahim Rahman",
    initials: "FR",
    classLevel: "HSC · 2025 repeater",
    gpa: "GPA 4.58 · Rajshahi Board",
    email: "fahim.rahman@scholarmail.com",
    phone: "+880 1755-640 119",
    tuitionRef: "ML-1015",
    tuitionTitle: "Inorganic Foundations — Morning Cohort",
    subject: "Inorganic Chemistry",
    tuitionTone: "#344C43",
    monthlySalary: 4200,
    preferredSchedule: "Sat · Mornings",
    appliedAt: "05 Nov '26",
    appliedSort: 20261105,
    status: "accepted",
    note: "I failed inorganic twice because I memorised instead of seeing the patterns. Repeat batch, Sat mornings, before the library closes for me.",
    guardian: "Mr. Kamrul Hasan (guardian)",
    board: "Rajshahi Board · Repeater",
    source: "Repeater scholarship desk",
  },
  {
    ref: "#AP-1029",
    name: "Anika Islam",
    initials: "AI",
    classLevel: "HSC · 2026 batch",
    gpa: "GPA 4.75 · Dhaka Board",
    email: "anika.islam@scholarmail.com",
    phone: "+880 1822-731 945",
    tuitionRef: "ML-1024",
    tuitionTitle: "Chemistry — Functional Groups, Finally",
    subject: "Chemistry",
    tuitionTone: "#4A695C",
    monthlySalary: 3800,
    preferredSchedule: "Sun · Afternoons",
    appliedAt: "02 Nov '26",
    appliedSort: 20261102,
    status: "rejected",
    note: "Functional groups are my weak wall. One Sunday a week, and I will not miss a single one.",
    guardian: "Mrs. Rehnuma Islam (mother)",
    board: "Dhaka Board · HSC '26",
    source: "Tuition directory",
  },
  {
    ref: "#AP-1027",
    name: "Tanvir Ahmed",
    initials: "TA",
    classLevel: "Admit · DU KA (target)",
    gpa: "N/A — admission candidate",
    email: "tanvir.ahmed@scholarmail.com",
    phone: "+880 1633-908 471",
    tuitionRef: "ML-1018",
    tuitionTitle: "Higher Maths — Admission Marathon",
    subject: "Higher Maths",
    tuitionTone: "#B87959",
    monthlySalary: 5200,
    preferredSchedule: "Tue & Thu · Late afternoons",
    appliedAt: "29 Oct '26",
    appliedSort: 20261029,
    status: "accepted",
    note: "DU KA admission is my whole exam year. I solve 30 problems a day on average — I want a room that pushes me higher.",
    guardian: "Mr. Shahriar Ahmed (father)",
    board: "Dhaka Board · HSC '26",
    source: "MentorLagbe index",
  },
  {
    ref: "#AP-1025",
    name: "Nusrat Jahan",
    initials: "NJ",
    classLevel: "SSC · 2027 batch",
    gpa: "GPA 5.00 · Dhaka Board",
    email: "nusrat.jahan@scholarmail.com",
    phone: "+880 1712-660 384",
    tuitionRef: "ML-1007",
    tuitionTitle: "English — Unseen Passage Drill",
    subject: "English",
    tuitionTone: "#668B78",
    monthlySalary: 2800,
    preferredSchedule: "Sat · Late mornings",
    appliedAt: "12 Oct '26",
    appliedSort: 20261012,
    status: "rejected",
    note: "The unseen passage is where my marks go to die. I want the drill — passage every week, markschemes always.",
    guardian: "Mrs. Taslima Jahan (mother)",
    board: "Dhaka Board · SSC '27",
    source: "Guardian recommendation",
  },
  {
    ref: "#AP-1019",
    name: "Shuvo Das",
    initials: "SD",
    classLevel: "HSC · 2026 batch",
    gpa: "GPA 4.42 · Sylhet Board",
    email: "shuvo.das@scholarmail.com",
    phone: "+880 1913-527 760",
    tuitionRef: "ML-1012",
    tuitionTitle: "Physics — Vectors & Kinematics Bootcamp",
    subject: "Physics",
    tuitionTone: "#B87959",
    monthlySalary: 4000,
    preferredSchedule: "Wed · Evenings",
    appliedAt: "02 Oct '26",
    appliedSort: 20261002,
    status: "rejected",
    note: "Vectors became a nightmare in class 10 and it followed me into HSC. Boot me back to zero, properly this time.",
    guardian: "Mr. Bishwajit Das (father)",
    board: "Sylhet Board · HSC '26",
    source: "Tuition directory",
  },
]

const STATUS_META: Record<AppStatus, { label: string; chip: string; stampBorder: string; stampText: string }> = {
  pending: {
    label: "Pending Review",
    chip: "border-[#B87959]/55 bg-[#B87959]/10 text-[#B87959]",
    stampBorder: "border-[#B87959]/75",
    stampText: "text-[#C98B6D]",
  },
  accepted: {
    label: "Accepted",
    chip: "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]",
    stampBorder: "border-[#7AA890]/75",
    stampText: "text-[#9DBFA9]",
  },
  rejected: {
    label: "Returned",
    chip: "border-[#A34343]/45 bg-[#A34343]/10 text-[#A34343]",
    stampBorder: "border-[#A34343]/70",
    stampText: "text-[#E8B4B4]",
  },
}

const STATUS_FILTERS: Array<{ key: "all" | AppStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
]

const TUITION_FILTERS = ["All Tuitions", "ML-1021", "ML-1018", "ML-1024", "ML-1015", "ML-1012", "ML-1007"] as const

type SortKey = "newest" | "oldest"

const fmtSalary = (n: number) => `৳${n.toLocaleString("en-IN")}`

// ─── Scoped applicant-studio styles ──────────────────────────────────────────

const studioStyles = `
  .applicant-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .applicant-root ::selection { background: #B87959; color: #1E3A2F; }

  @keyframes applicant-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .applicant-rise { animation: applicant-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes applicant-dialog-in {
    from { opacity: 0.4; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .applicant-dialog { animation: applicant-dialog-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes applicant-stamp-in {
    0%   { transform: rotate(-15deg) scale(1.6); }
    60%  { transform: rotate(-9deg) scale(0.94); }
    100% { transform: rotate(-11deg) scale(1); }
  }
  .applicant-stamp { animation: applicant-stamp-in 0.45s cubic-bezier(0.2, 1.4, 0.35, 1) both; animation-delay: var(--stamp-delay, 0s); }

  @media (prefers-reduced-motion: reduce) {
    .applicant-rise, .applicant-dialog, .applicant-stamp { animation: none !important; }
  }
`

// ─── Decision dialogs ────────────────────────────────────────────────────────

function DecisionDialog({
  kind,
  applicant,
  onClose,
  onConfirm,
}: {
  kind: "accept" | "reject"
  applicant: Applicant
  onClose: () => void
  onConfirm: () => void
}) {
  const isAccept = kind === "accept"
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isAccept ? "Accept application" : "Reject application"}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-[#16241F]/75 backdrop-blur-[3px]"
      />
      <div
        className={cn(
          "applicant-dialog relative w-full max-w-md border p-6 shadow-2xl",
          isAccept
            ? "border-[#7AA890]/45 bg-[#1E3A2F]"
            : "border-[#A34343]/45 bg-[#2B1B18]"
        )}
      >
        {isAccept ? (
          <>
            <span aria-hidden="true" className="absolute right-4 top-4 select-none font-mono text-[26px] leading-none text-[#C98B6D]/75">✦</span>
            <div className="flex size-12 items-center justify-center rounded-full border border-[#7AA890]/50 bg-[#668B78]/20">
              <CheckCircle2 className="size-6 text-[#9DBFA9]" strokeWidth={1.75} />
            </div>
            <h3 className="applicant-serif mt-4 text-2xl font-black tracking-tight text-[#F2EDDF]">
              Affix the Seal of Acceptance?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#F2EDDF]/75">
              You are admitting <strong className="text-[#F2EDDF]">{applicant.name}</strong> into
              <strong className="text-[#F2EDDF]"> {applicant.tuitionTitle}</strong>. The seat is deducted
              from the batch ledger — <span className="font-mono text-[#9DBFA9]">3 of 12 remain after</span>.
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[7px] uppercase tracking-[0.22em] text-[#F2EDDF]/45">
              <BadgeCheck aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2} />
              Seal of admission · Board notified automatically
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-sm px-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F2EDDF]/65 hover:bg-[#F2EDDF]/10 hover:text-[#F2EDDF]"
              >
                Not Yet
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="h-11 rounded-sm border border-[#A9CDB8]/50 bg-[#668B78] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#16241F] shadow-[4px_4px_0_#C98B6D] hover:bg-[#7AA890]"
              >
                Affix the Seal
              </Button>
            </div>
          </>
        ) : (
          <>
            <span aria-hidden="true" className="absolute right-4 top-4 select-none font-mono text-[26px] leading-none text-[#A34343]/75">⌧</span>
            <div className="flex size-12 items-center justify-center rounded-full border border-[#A34343]/45 bg-[#A34343]/12">
              <MailX className="size-6 text-[#E8B4B4]" strokeWidth={1.75} />
            </div>
            <h3 className="applicant-serif mt-4 text-2xl font-black tracking-tight text-[#F7EDE1]">
              The Returned Letter?
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#F7EDE1]/72">
              You are returning <strong className="text-[#F7EDE1]">{applicant.name}</strong>&rsquo;s application
              for <strong className="text-[#F7EDE1]">{applicant.subject}</strong>. The return is kind by design —
              one line, no reasons demanded, no bridge burned. They may reapply next term.
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-[#F7EDE1]/12 pt-3 font-mono text-[7px] uppercase tracking-[0.22em] text-[#F7EDE1]/45">
              <XCircle aria-hidden="true" className="size-3.5 text-[#A34343]" strokeWidth={2} />
              Return sealed · Applicant notified with a kind note
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 rounded-sm px-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F7EDE1]/65 hover:bg-[#F7EDE1]/10 hover:text-[#F7EDE1]"
              >
                Keep the Letter
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="h-11 rounded-sm border border-[#D98C8C]/40 bg-[#A34343] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F7EDE1] shadow-[4px_4px_0_#1E3A2F] hover:bg-[#B85252]"
              >
                Seal the Return
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Empty studio ────────────────────────────────────────────────────────────



// ─── Main page ───────────────────────────────────────────────────────────────

export default function ApplicantsPage() {
  const [items, setItems] = useState<Applicant[]>(APPLICANTS)
  const [query, setQuery] = useState("")
  const [tuition, setTuition] = useState<(typeof TUITION_FILTERS)[number]>("All Tuitions")
  const [status, setStatus] = useState<"all" | AppStatus>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedRef, setSelectedRef] = useState(APPLICANTS[0].ref)
  const [dialog, setDialog] = useState<"accept" | "reject" | null>(null)
  const [dossierOpen, setDossierOpen] = useState(false)

  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((a) => a.status === "pending").length,
      accepted: items.filter((a) => a.status === "accepted").length,
      rejected: items.filter((a) => a.status === "rejected").length,
    }),
    [items]
  )

  const statusCounts = useMemo(
    () => ({
      all: items.length,
      pending: counts.pending,
      accepted: counts.accepted,
      rejected: counts.rejected,
    }),
    [items, counts]
  )

  const visible = useMemo(() => {
    const list = items.filter((a) => {
      if (status !== "all" && a.status !== status) return false
      if (tuition !== "All Tuitions" && a.tuitionRef !== tuition) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [a.name, a.subject, a.tuitionTitle, a.ref, a.tuitionRef, a.classLevel]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    return [...list].sort((a, b) =>
      sort === "newest" ? b.appliedSort - a.appliedSort : a.appliedSort - b.appliedSort
    )
  }, [items, query, tuition, status, sort])

  const selected = items.find((a) => a.ref === selectedRef) ?? items[0] ?? null

  const decide = (ref: string, verdict: AppStatus) => {
    setItems((prev) => prev.map((a) => (a.ref === ref ? { ...a, status: verdict } : a)))
    setDialog(null)
  }

  // Verdict barometer segments
  const verdictSegments = [
    { label: "Pending", count: counts.pending, tone: "#B87959" },
    { label: "Accepted", count: counts.accepted, tone: "#668B78" },
    { label: "Rejected", count: counts.rejected, tone: "#A34343" },
  ]
  const verdictTotal = Math.max(1, verdictSegments.reduce((n, s) => n + s.count, 0))

  return (
    <div className="applicant-root relative text-[#344C43]">
      <style>{studioStyles}</style>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">

        {/* ══ MASTHEAD — the selection room ═══════════════════════════════ */}
        <header className="border-b-2 border-[#344C43] pb-5 sm:pb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
            [ The Selection Room — Applicant Ledger ]
          </p>
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1
              className="applicant-rise applicant-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)" } as React.CSSProperties}
            >
              Your Applicant
              <span className="block">
                <span className="italic text-[#668B78]">Studio.</span>
                <span aria-hidden="true" className="text-[#B87959]">.</span>
              </span>
            </h1>
            <div className="max-w-[42ch]">
              <p className="text-sm leading-relaxed text-[#344C43]/80">
                Every scholar who knocked on the studio door this term — their
                notes, their hunger, their seat. Read each letter before the
                board seals your reply.
              </p>
              <p className="mt-2 inline-flex items-center gap-2 border border-[#C98B6D]/50 bg-[#B87959]/10 px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-[#B87959]">
                <Hourglass aria-hidden="true" className="size-3.5" strokeWidth={2} />
                {counts.pending} awaiting your review
              </p>
            </div>
          </div>

          {/* ══ THE VERDICT BAROMETER — horizontal status visualization ══ */}
          <div className="applicant-rise mt-5" style={{ "--rise-delay": "0.14s" } as React.CSSProperties} aria-label={`Applicant barometer: ${counts.total} total, ${counts.pending} pending review, ${counts.accepted} accepted, ${counts.rejected} rejected`}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#344C43]/55">
                The Verdict Barometer
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#344C43]/55">
                <span className="hidden sm:inline">HSC Physics — 3 seats remain </span>
                Total — <span className="font-bold text-[#344C43]">{String(counts.total).padStart(2, "0")}</span>
              </p>
            </div>
            <div className="mt-1.5 flex h-9 w-full overflow-hidden rounded-sm border border-[#344C43]/35 sm:h-11" role="presentation">
              {verdictSegments.map((seg) => (
                <div
                  key={seg.label}
                  className="flex items-center justify-center border-r border-[#F2ECDF]/40 last:border-r-0"
                  style={{ width: `${(seg.count / verdictTotal) * 100}%`, backgroundColor: seg.tone, minWidth: seg.count > 0 ? "2.2rem" : "0" }}
                  title={`${seg.label}: ${seg.count}`}
                >
                  <span className="applicant-serif text-lg font-black leading-none text-[#EFE7DC] sm:text-2xl">
                    {seg.count}
                  </span>
                </div>
              ))}
            </div>
            <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
              {verdictSegments.map((seg) => (
                <li key={seg.label} className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.2em] text-[#344C43]/60">
                  <span aria-hidden="true" className="inline-block size-2.5" style={{ backgroundColor: seg.tone }} />
                  {seg.label} — {seg.count}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* ══ SORTING DESK — search, tuition filter, status, sort ═════════ */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tuition filter */}
            <label htmlFor="studio-tuition" className="relative">
              <span className="sr-only">Filter by tuition listing</span>
              <select
                id="studio-tuition"
                value={tuition}
                onChange={(e) => setTuition(e.target.value as (typeof TUITION_FILTERS)[number])}
                className="h-10 appearance-none rounded-sm border border-[#344C43]/25 bg-[#EFE7DC] pl-3 pr-8 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20 sm:text-[9px]"
              >
                {TUITION_FILTERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
            </label>

            {/* Status pills */}
            <div role="group" aria-label="Filter by application status" className="flex gap-1.5">
              {STATUS_FILTERS.map((f) => {
                const active = status === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStatus(f.key)}
                    className={cn(
                      "flex h-10 items-baseline gap-1.5 rounded-sm border px-2.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:px-3 sm:text-[8px]",
                      active
                        ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[2px_2px_0_#B87959]"
                        : "border-[#344C43]/25 text-[#344C43]/65 hover:border-[#344C43]/55 hover:text-[#344C43]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#C98B6D]" : "text-[#B87959]")}>
                      {f.key === "all" ? statusCounts.all : statusCounts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="studio-search" className="relative min-w-0 flex-1 lg:w-56 lg:flex-none">
              <span className="sr-only">Search applicants by name, subject, tuition, or reference</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45" strokeWidth={1.75} />
              <Input
                id="studio-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the letters…"
                className="h-10 rounded-sm border-[#344C43]/25 bg-[#EFE7DC] pl-9 text-[13px] placeholder:text-[#344C43]/38 focus:border-[#668B78] focus:ring-[#668B78]/20"
              />
            </label>
            <label htmlFor="studio-sort" className="relative shrink-0">
              <span className="sr-only">Sort applicants</span>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45" strokeWidth={1.75} />
              <select
                id="studio-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 appearance-none rounded-sm border border-[#344C43]/25 bg-[#EFE7DC] pl-9 pr-8 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20 sm:text-[9px]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
            </label>
          </div>
        </div>

        {/* ══ THE LEDGER + THE SELECTION SHEET ═══════════════════════════ */}
        <div className="mt-4 grid gap-5 lg:grid-cols-12 lg:items-start">

          {/* ── Left — applicant index ── */}
          <section aria-labelledby="applicants-heading" className="lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="applicants-heading" className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#B87959] sm:text-[9px]">
                The Applicant Index
              </h2>
              <p aria-live="polite" className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#344C43]/55">
                {visible.length} {visible.length === 1 ? "applicant" : "applicants"} on the desk
              </p>
            </div>

            {visible.length === 0 ? (
              <div className="mt-3">
                <EmptyState
                  Icon={Inbox}
                  tone="paper"
                  title={<>The studio is <span className="italic text-[#B87959]">quiet.</span></>}
                  description={query.trim()
                    ? `No applicant matches “${query.trim()}” — the ledger keeps honest books.`
                    : "No applicants filed under these filters — adjust the shelf."}
                  actionLabel="Clear the desk"
                  onAction={() => { setQuery(""); setTuition("All Tuitions"); setStatus("all") }}
                />
              </div>
            ) : (
              <ol className="mt-3 space-y-2.5">
                {visible.map((a) => {
                  const selectedRow = selected?.ref === a.ref
                  const meta = STATUS_META[a.status]
                  return (
                    <li key={a.ref}>
                      <button
                        type="button"
                        onClick={() => { setSelectedRef(a.ref); setDossierOpen(false) }}
                        aria-pressed={selectedRow}
                        aria-label={`Open selection sheet for ${a.name}, ${a.classLevel}, applied to ${a.tuitionTitle} — ${meta.label}`}
                        className={cn(
                          "group grid w-full grid-cols-[3.25rem_1fr_auto] items-center border text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:grid-cols-[3.75rem_1fr_auto_auto]",
                          selectedRow
                            ? "border-[#344C43] bg-[#EFE7DC] shadow-[5px_6px_0_#B87959]"
                            : "border-[#344C43]/25 bg-[#EFE7DC]/65 hover:border-[#344C43]/55 hover:bg-[#EFE7DC]"
                        )}
                      >
                        {/* Monogram avatar */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex size-full items-center justify-center border-r font-mono text-[11px] font-bold tracking-wide transition-colors sm:text-[13px]",
                            selectedRow
                              ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC]"
                              : "border-[#344C43]/20 bg-[#344C43]/5 text-[#344C43] group-hover:bg-[#344C43] group-hover:text-[#EFE7DC]"
                          )}
                          style={{ minHeight: "4.5rem" }}
                        >
                          {a.initials}
                        </span>

                        {/* Body */}
                        <span className="min-w-0 px-3 py-3 sm:px-4">
                          <span className="block truncate text-[13px] font-bold tracking-tight text-[#344C43] sm:text-[14px]">
                            {a.name}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[6.5px] uppercase leading-snug tracking-[0.16em] text-[#B87959]">
                            {a.subject} · <span className="text-[#344C43]/55">{a.tuitionRef}</span>
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#344C43]/60">
                            <span>{a.preferredSchedule}</span>
                            <span aria-hidden="true">·</span>
                            <span>{a.appliedAt}</span>
                          </span>
                        </span>

                        {/* Salary */}
                        <span className="flex flex-col items-center justify-center gap-0.5 border-l border-[#344C43]/15 px-2 sm:px-3">
                          <span className="text-[12px] font-black tabular-nums tracking-tight text-[#344C43]">
                            {fmtSalary(a.monthlySalary)}
                          </span>
                          <span className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-[#344C43]/50">/ month</span>
                        </span>

                        {/* Status chip */}
                        <span className="hidden flex-col items-center justify-center gap-1.5 border-l border-[#344C43]/15 px-3 sm:flex">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-1 font-mono text-[6px] font-bold uppercase tracking-[0.18em]",
                            meta.chip
                          )}>
                            {a.status === "pending" && <Hourglass aria-hidden="true" className="size-3" strokeWidth={2} />}
                            {a.status === "accepted" && <CheckCircle2 aria-hidden="true" className="size-3" strokeWidth={2} />}
                            {a.status === "rejected" && <XCircle aria-hidden="true" className="size-3" strokeWidth={2} />}
                            {meta.label}
                          </span>
                          <ChevronRight aria-hidden="true" className={cn(
                            "size-4 text-[#344C43]/35 transition-transform duration-200",
                            selectedRow && "translate-x-1 text-[#B87959]"
                          )} strokeWidth={2} />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>

          {/* ── Right — the selection sheet (sticky) ── */}
          {selected && (
            <aside aria-labelledby="selection-heading" className="lg:col-span-5 lg:sticky lg:top-[136px]">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="selection-heading" className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-[#B87959] sm:text-[9px]">
                  The Selection Sheet
                </h2>
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#344C43]/55">{selected.ref}</p>
              </div>

              <figure className="mt-3 overflow-hidden border border-[#344C43]/30 bg-[#EFE7DC] shadow-[6px_7px_0_rgba(52,76,67,0.16)]">
                {/* Selection header strip */}
                <div className="flex items-center gap-4 border-b border-[#344C43]/20 bg-[#344C43] px-5 py-4">
                  <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-[#C98B6D]/70 bg-[#243630] font-mono text-base font-bold text-[#EFE7DC]">
                    {selected.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-bold tracking-tight text-[#EFE7DC]">
                      {selected.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[6.5px] uppercase leading-snug tracking-[0.18em] text-[#9DBFA9]">
                      {selected.classLevel} · {selected.gpa}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "applicant-stamp inline-block shrink-0 -rotate-11 border-2 border-dashed px-2 py-1 font-mono text-[6px] font-bold uppercase leading-none tracking-[0.2em] sm:text-[7px]",
                      STATUS_META[selected.status].stampBorder,
                      STATUS_META[selected.status].stampText
                    )}
                  >
                    {selected.status === "pending" ? "SEALED" : selected.status === "accepted" ? "ADMITTED" : "RETURNED"}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Tuition strip */}
                  <div
                    className="flex items-center justify-between gap-3 border border-[#344C43]/20 p-3"
                    style={{ backgroundColor: selected.tuitionTone }}
                    role="img"
                    aria-label={`Applied to ${selected.tuitionTitle}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[6.5px] uppercase leading-snug tracking-[0.22em] text-white/65">
                        Applying to — {selected.tuitionRef}
                      </span>
                      <span className="applicant-serif mt-1 block text-[13px] font-black leading-snug tracking-tight text-[#F2ECDF]">
                        {selected.tuitionTitle}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-mono text-[11px] font-bold tracking-tight text-[#F2ECDF]">
                        {fmtSalary(selected.monthlySalary)}
                      </span>
                      <span className="font-mono text-[5.5px] uppercase tracking-[0.2em] text-white/55">/ month</span>
                    </span>
                  </div>

                  {/* Contact rows */}
                  <ul className="mt-3 divide-y divide-[#344C43]/12 border-y border-[#344C43]/20 text-[11px]">
                    {[
                      { Icon: Mail, k: "Email", v: selected.email },
                      { Icon: Phone, k: "Phone", v: selected.phone },
                      { Icon: CalendarDays, k: "Schedule", v: selected.preferredSchedule },
                      { Icon: GraduationCap, k: "Board", v: selected.board },
                      { Icon: MapPin, k: "Source", v: selected.source },
                    ].map(({ Icon, k, v }) => (
                      <li key={k} className="flex items-baseline gap-2.5 py-2">
                        <Icon aria-hidden="true" className="size-3.5 shrink-0 translate-y-[2px] text-[#668B78]" strokeWidth={2} />
                        <span className="w-14 shrink-0 font-mono text-[7px] uppercase tracking-[0.18em] text-[#344C43]/50">{k}</span>
                        <span className="truncate font-semibold leading-snug tracking-tight text-[#344C43]">{v}</span>
                      </li>
                    ))}
                  </ul>

                  {/* The letter — learning note */}
                  <div className="mt-3 border-l-2 border-[#B87959] bg-[#F2ECDF] p-3">
                    <p className="flex items-center gap-1.5 font-mono text-[6.5px] font-bold uppercase tracking-[0.28em] text-[#B87959]">
                      <FileText aria-hidden="true" className="size-3" strokeWidth={2} />
                      The Letter
                    </p>
                    <p className="applicant-serif mt-1.5 text-[12px] italic leading-snug text-[#344C43]/90">
                      “{selected.note}”
                    </p>
                  </div>

                  {/* Application footer */}
                  <p className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[7px] uppercase tracking-[0.2em] text-[#344C43]/55">
                    <span>Applied {selected.appliedAt}</span>
                    <span>{selected.ref} · Dhaka Post</span>
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#344C43]/15 pt-3">
                    <button
                      type="button"
                      onClick={() => setDialog("accept")}
                      className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#7AA890]/60 bg-[#668B78] px-4 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#16241F] shadow-[3px_3px_0_#C98B6D] transition-all hover:-translate-y-0.5 hover:bg-[#7AA890] hover:shadow-[5px_5px_0_#C98B6D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#668B78]"
                    >
                      <CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
                      Accept Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setDialog("reject")}
                      className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#A34343]/45 bg-transparent px-4 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#A34343] transition-all hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                    >
                      <XCircle aria-hidden="true" className="size-4" strokeWidth={2} />
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setDossierOpen((v) => !v)}
                      aria-expanded={dossierOpen}
                      className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#344C43]/25 px-4 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#344C43] transition-all hover:border-[#344C43] hover:bg-[#EFE7DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                    >
                      <Eye aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      {dossierOpen ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {/* Full dossier expansion */}
                  {dossierOpen && (
                    <div className="mt-3 border border-dashed border-[#344C43]/35 bg-[#F2ECDF]/60 p-3">
                      <p className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-[#B87959]">
                        Full Dossier
                      </p>
                      <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px]">
                        {[
                          ["Guardian", selected.guardian],
                          ["Board", selected.board],
                          ["Class", selected.classLevel],
                          ["Reference", selected.ref],
                          ["Source", selected.source],
                          ["Preferred", selected.preferredSchedule],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="font-mono text-[6.5px] uppercase tracking-[0.22em] text-[#344C43]/50">{k}</dt>
                            <dd className="mt-0.5 font-semibold leading-snug tracking-tight text-[#344C43]">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </figure>
            </aside>
          )}
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/tutor/my-tuitions" backLabel="My Tuitions">
          <span className="inline-flex items-center gap-1.5"><Users aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />{counts.pending} decisions pending</span>
          <span className="inline-flex items-center gap-1.5"><BadgeCheck aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />Batch cap respected</span>
          <span className="inline-flex items-center gap-1">The register closes 30 Nov</span>
        </Colophon>
      </div>

      {/* ══ Decision dialogs ═════════════════════════════════════════════ */}
      {dialog && selected && (
        <DecisionDialog
          kind={dialog}
          applicant={selected}
          onClose={() => setDialog(null)}
          onConfirm={() => decide(selected.ref, dialog === "accept" ? "accepted" : "rejected")}
        />
      )}
    </div>
  )
}
