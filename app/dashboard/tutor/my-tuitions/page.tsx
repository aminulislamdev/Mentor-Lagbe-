"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  ChevronDown,
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Wifi,
  RotateCcw,
  Users,
  Wallet,
  SearchX,
  Power,
  BookOpenCheck,
  Archive,
  Crown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Colophon, StickyRail } from "@/components/dashboard/shared"

// ─── Static portfolio data ───────────────────────────────────────────────────

type Approval = "approved" | "pending" | "rejected"

interface Listing {
  ref: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  schedule: string
  location: string
  daysPerWeek: number
  createdAt: string
  createdSort: number
  monthlySalary: number
  approval: Approval
  isActive: boolean
  applicants: number
  seats: { filled: number; cap: number }
  tone: string
  note?: string
}

const LISTINGS: Listing[] = [
  {
    ref: "ML-1021",
    title: "HSC Physics — The Integration Finals",
    subject: "Physics",
    classLevel: "HSC (2026 batch)",
    mode: "Offline",
    schedule: "Fri & Sat · 6:00 PM · 90 min",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    daysPerWeek: 2,
    createdAt: "04 Nov 2026",
    createdSort: 20261104,
    monthlySalary: 4500,
    approval: "approved",
    isActive: true,
    applicants: 27,
    seats: { filled: 9, cap: 12 },
    tone: "#1E3A2F",
  },
  {
    ref: "ML-1018",
    title: "Higher Maths — Admission Marathon",
    subject: "Higher Maths",
    classLevel: "Admission — BUET / DU",
    mode: "Offline",
    schedule: "Tue & Thu · 5:00 PM · 90 min",
    location: "BUET Road, Shahbagh",
    daysPerWeek: 2,
    createdAt: "18 Oct 2026",
    createdSort: 20261018,
    monthlySalary: 5200,
    approval: "approved",
    isActive: true,
    applicants: 19,
    seats: { filled: 7, cap: 10 },
    tone: "#B87959",
  },
  {
    ref: "ML-1024",
    title: "Chemistry — Functional Groups, Finally",
    subject: "Chemistry",
    classLevel: "HSC (2026 batch)",
    mode: "Online",
    schedule: "Sun · 4:00 PM · 90 min",
    location: "Online · Zoom cohort",
    daysPerWeek: 1,
    createdAt: "28 Nov 2026",
    createdSort: 20261128,
    monthlySalary: 3800,
    approval: "pending",
    isActive: true,
    applicants: 34,
    seats: { filled: 0, cap: 16 },
    tone: "#4A695C",
    note: "Board review — banner copy and prerequisite line under proofing.",
  },
  {
    ref: "ML-1015",
    title: "Inorganic Foundations — Morning Cohort",
    subject: "Inorganic Chemistry",
    classLevel: "HSC (2025 repeaters)",
    mode: "Offline",
    schedule: "Sat · 9:00 AM · 2 hrs",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    daysPerWeek: 1,
    createdAt: "15 Sep 2026",
    createdSort: 20260915,
    monthlySalary: 4200,
    approval: "approved",
    isActive: false,
    applicants: 22,
    seats: { filled: 14, cap: 14 },
    tone: "#344C43",
    note: "Cohort complete — 14 scholars, all cleared the primer test.",
  },
  {
    ref: "ML-1012",
    title: "Physics — Vectors & Kinematics Bootcamp",
    subject: "Physics",
    classLevel: "HSC (2026 batch)",
    mode: "Offline",
    schedule: "Wed · 7:00 PM · 90 min",
    location: "Dhanmondi 27, Dhaka — Studio № 3",
    daysPerWeek: 1,
    createdAt: "30 Aug 2026",
    createdSort: 20260830,
    monthlySalary: 4000,
    approval: "rejected",
    isActive: true,
    applicants: 8,
    seats: { filled: 0, cap: 12 },
    tone: "#B87959",
    note: "Returned by the board — banner copy promised guaranteed admission. Claims of outcome are off-brief. Revise and resubmit.",
  },
  {
    ref: "ML-1007",
    title: "English — Unseen Passage Drill",
    subject: "English",
    classLevel: "SSC (2027 batch)",
    mode: "Online",
    schedule: "Sat · 10:00 AM · 60 min",
    location: "Online · Zoom cohort",
    daysPerWeek: 1,
    createdAt: "12 Jul 2026",
    createdSort: 20260712,
    monthlySalary: 2800,
    approval: "approved",
    isActive: false,
    applicants: 12,
    seats: { filled: 10, cap: 10 },
    tone: "#668B78",
    note: "Cohort complete — 10 scholars, average board-mock jump of 14 marks.",
  },
]

const APPROVAL_META: Record<Approval, { label: string; chip: string; stamp: string }> = {
  approved: {
    label: "Approved",
    chip: "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]",
    stamp: "border-[#668B78]/70 text-[#4A695C]",
  },
  pending: {
    label: "Pending Approval",
    chip: "border-[#B87959]/55 bg-[#B87959]/10 text-[#B87959]",
    stamp: "border-[#B87959]/70 text-[#B87959]",
  },
  rejected: {
    label: "Rejected",
    chip: "border-[#A34343]/45 bg-[#A34343]/10 text-[#A34343]",
    stamp: "border-[#A34343]/65 text-[#A34343]",
  },
}

const SUBJECTS = ["All Subjects", "Physics", "Higher Maths", "Chemistry", "Inorganic Chemistry", "English"] as const

const APPROVAL_FILTERS: Array<{ key: "all" | Approval; label: string }> = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
]

const ACTIVE_FILTERS: Array<{ key: "all" | "active" | "closed"; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "closed", label: "Closed" },
]

type SortKey = "newest" | "oldest" | "feeAsc" | "feeDesc" | "applicants"

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "feeAsc", label: "Salary · low to high" },
  { key: "feeDesc", label: "Salary · high to low" },
  { key: "applicants", label: "Most applicants" },
]

const fmtSalary = (n: number) => `৳${n.toLocaleString("en-IN")}`

// ─── Scoped portfolio styles ─────────────────────────────────────────────────

const portfolioStyles = `
  .portfolio-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .portfolio-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes portfolio-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .portfolio-rise { animation: portfolio-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes portfolio-stamp-in {
    0%   { transform: rotate(-15deg) scale(1.5); }
    60%  { transform: rotate(-10deg) scale(0.94); }
    100% { transform: rotate(-11deg) scale(1); }
  }
  .portfolio-stamp { animation: portfolio-stamp-in 0.45s cubic-bezier(0.2, 1.4, 0.35, 1) both; animation-delay: var(--stamp-delay, 0s); }

  @media (prefers-reduced-motion: reduce) {
    .portfolio-rise, .portfolio-stamp { animation: none !important; }
  }
`

// ─── Seat gauge ──────────────────────────────────────────────────────────────

function SeatGauge({ filled, cap }: { filled: number; cap: number }) {
  const pct = cap === 0 ? 0 : Math.round((filled / cap) * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#344C43]/55">Seats filled</span>
        <span className="font-mono text-[10px] font-bold tabular-nums text-[#344C43]">
          {filled}<span className="text-[#344C43]/40"> / {cap}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full bg-[#344C43]/10" role="img" aria-label={`${filled} of ${cap} seats filled`}>
        <div className={cn("h-full", pct >= 90 ? "bg-[#B87959]" : "bg-[#668B78]")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function MyTuitionsPage() {
  const [items, setItems] = useState<Listing[]>(LISTINGS)
  const [deleted, setDeleted] = useState<Listing | null>(null)
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All Subjects")
  const [approval, setApproval] = useState<"all" | Approval>("all")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "closed">("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedRef, setSelectedRef] = useState(LISTINGS[0].ref)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Keep selection valid as items change (adjust state during render)
  const [prevItems, setPrevItems] = useState(items)
  if (prevItems !== items) {
    setPrevItems(items)
    if (!items.find((l) => l.ref === selectedRef)) {
      setSelectedRef(items[0]?.ref ?? "")
    }
  }

  const stats = useMemo(() => {
    const total = items.length
    const approved = items.filter((l) => l.approval === "approved").length
    const pending = items.filter((l) => l.approval === "pending").length
    const closed = items.filter((l) => !l.isActive).length
    return { total, approved, pending, closed }
  }, [items])

  const approvalCounts = useMemo(
    () => ({
      all: items.length,
      approved: items.filter((l) => l.approval === "approved").length,
      pending: items.filter((l) => l.approval === "pending").length,
      rejected: items.filter((l) => l.approval === "rejected").length,
    }),
    [items]
  )

  const visible = useMemo(() => {
    let list = items.filter((l) => {
      if (approval !== "all" && l.approval !== approval) return false
      if (activeFilter === "active" && !l.isActive) return false
      if (activeFilter === "closed" && l.isActive) return false
      if (subject !== "All Subjects" && l.subject !== subject) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [l.title, l.subject, l.classLevel, l.ref, l.location].join(" ").toLowerCase().includes(q)
    })
    switch (sort) {
      case "oldest":
        list = [...list].sort((a, b) => a.createdSort - b.createdSort)
        break
      case "feeAsc":
        list = [...list].sort((a, b) => a.monthlySalary - b.monthlySalary)
        break
      case "feeDesc":
        list = [...list].sort((a, b) => b.monthlySalary - a.monthlySalary)
        break
      case "applicants":
        list = [...list].sort((a, b) => b.applicants - a.applicants)
        break
      default:
        list = [...list].sort((a, b) => b.createdSort - a.createdSort)
    }
    return list
  }, [items, query, subject, approval, activeFilter, sort])

  const selected = items.find((l) => l.ref === selectedRef) ?? null

  const toggleActive = (ref: string) =>
    setItems((prev) => prev.map((l) => (l.ref === ref ? { ...l, isActive: !l.isActive } : l)))

  const deleteListing = (ref: string) => {
    const target = items.find((l) => l.ref === ref)
    if (!target) return
    setDeleted(target)
    setItems((prev) => prev.filter((l) => l.ref !== ref))
    setConfirmDelete(null)
  }

  const undoDelete = () => {
    if (!deleted) return
    setItems((prev) => [...prev, deleted].sort((a, b) => b.createdSort - a.createdSort))
    setDeleted(null)
  }

  // ─── The beam segments ───
  const beam = [
    { label: "Approved", count: stats.approved, tone: "#668B78" },
    { label: "Pending", count: stats.pending, tone: "#B87959" },
    { label: "Rejected", count: items.filter((l) => l.approval === "rejected").length, tone: "#A34343" },
    { label: "Closed", count: stats.closed, tone: "#344C43" },
  ]
  const beamTotal = Math.max(1, beam.reduce((n, s) => n + s.count, 0))

  return (
    <div className="portfolio-root relative text-[#344C43]">
      <style>{portfolioStyles}</style>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">

        {/* ══ MASTHEAD — Your Teaching Portfolio ═══════════════════════════ */}
        <header className="border-b-2 border-[#344C43] pb-5 sm:pb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
            [ The Mentor&rsquo;s Register — Your Listings ]
          </p>
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1
              className="portfolio-rise portfolio-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)" } as React.CSSProperties}
            >
              Your Teaching
              <span className="block">
                <span className="italic text-[#668B78]">Portfolio.</span>
                <span aria-hidden="true" className="text-[#B87959]">.</span>
              </span>
            </h1>
            <div className="max-w-[42ch]">
              <p className="text-sm leading-relaxed text-[#344C43]/80">
                Every batch you have published on the atelier — what awaits the
                board, what the board approved, what the board returned, and
                what has served its season. Select an edition to read its proof sheet.
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 border border-[#C98B6D]/50 bg-[#B87959]/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#B87959]">
                <Crown aria-hidden="true" className="size-3" strokeWidth={2} />
                Tutor Pro · Unlimited Listings
              </p>
            </div>
          </div>

          {/* ══ THE PORTFOLIO BEAM — horizontal performance visualization ══ */}
          <div className="portfolio-rise mt-5" style={{ "--rise-delay": "0.14s" } as React.CSSProperties} aria-label={`Portfolio overview: ${stats.total} total tuitions, ${stats.approved} approved, ${stats.pending} pending approval, ${stats.closed} closed`}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#344C43]/55">
                Portfolio Health
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#344C43]/55">
                <span className="mr-2 hidden sm:inline">The Register Closes Monthly</span>
                Total — <span className="font-bold text-[#344C43]">{String(stats.total).padStart(2, "0")}</span>
              </p>
            </div>
            <div className="mt-1.5 flex h-9 w-full overflow-hidden rounded-sm border border-[#344C43]/35 sm:h-11" role="presentation">
              {beam.map((seg) => (
                <div
                  key={seg.label}
                  className={cn(
                    "flex items-center justify-center border-r border-[#F2ECDF]/40 last:border-r-0",
                    seg.label === "Pending" && "border-r border-dashed"
                  )}
                  style={{ width: `${(seg.count / beamTotal) * 100}%`, backgroundColor: seg.tone, minWidth: seg.count > 0 ? "2.2rem" : "0" }}
                  title={`${seg.label}: ${seg.count}`}
                >
                  <span className="portfolio-serif text-lg font-black leading-none text-[#EFE7DC] sm:text-2xl">
                    {seg.count}
                  </span>
                </div>
              ))}
            </div>
            <ul className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
              {beam.map((seg) => (
                <li key={seg.label} className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/60">
                  <span aria-hidden="true" className="inline-block size-2.5" style={{ backgroundColor: seg.tone }} />
                  {seg.label} — {seg.count}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Undo banner after delete */}
        {deleted && (
          <div role="status" className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-[#A34343]/40 bg-[#A34343]/8 px-4 py-2.5">
            <p className="font-mono text-[10px] font-bold uppercase leading-snug tracking-[0.2em] text-[#A34343]">
              Edition {deleted.ref} torn from the register
            </p>
            <button
              type="button"
              onClick={undoDelete}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] underline decoration-[#A34343]/60 decoration-2 underline-offset-4 transition-colors hover:text-[#A34343]"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
              Undo — restore edition
            </button>
          </div>
        )}

        {/* ══ SORTING DESK — search, subject, approval, active, sort ═════ */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject filter */}
            <label htmlFor="portfolio-subject" className="relative">
              <span className="sr-only">Filter by subject</span>
              <select
                id="portfolio-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as (typeof SUBJECTS)[number])}
                className="h-10 appearance-none rounded-sm border border-[#344C43]/25 bg-[#EFE7DC] pl-3 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20 sm:text-[10px]"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
            </label>

            {/* Approval filter pills */}
            <div role="group" aria-label="Filter by approval status" className="flex gap-1.5">
              {APPROVAL_FILTERS.map((f) => {
                const active = approval === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setApproval(f.key)}
                    className={cn(
                      "flex h-10 items-baseline gap-1.5 rounded-sm border px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:px-3 sm:text-[10px]",
                      active
                        ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[2px_2px_0_#B87959]"
                        : "border-[#344C43]/25 text-[#344C43]/65 hover:border-[#344C43]/55 hover:text-[#344C43]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#C98B6D]" : "text-[#B87959]")}>
                      {f.key === "all" ? approvalCounts.all : approvalCounts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Active / Closed toggle */}
            <div role="group" aria-label="Filter by listing status" className="flex rounded-sm border border-[#344C43]/25">
              {ACTIVE_FILTERS.map((f) => {
                const active = activeFilter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveFilter(f.key)}
                    className={cn(
                      "h-10 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#344C43] sm:text-[10px]",
                      active ? "bg-[#344C43]/85 text-[#EFE7DC]" : "text-[#344C43]/60 hover:text-[#344C43]"
                    )}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="portfolio-search" className="relative min-w-0 flex-1 lg:w-56 lg:flex-none">
              <span className="sr-only">Search tuitions by title, subject, class, reference, or location</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45" strokeWidth={1.75} />
              <Input
                id="portfolio-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the register…"
                className="h-10 rounded-sm border-[#344C43]/25 bg-[#EFE7DC] pl-9 text-[13px] placeholder:text-[#344C43]/38 focus:border-[#668B78] focus:ring-[#668B78]/20"
              />
            </label>
            <label htmlFor="portfolio-sort" className="relative shrink-0">
              <span className="sr-only">Sort tuitions</span>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45" strokeWidth={1.75} />
              <select
                id="portfolio-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 appearance-none rounded-sm border border-[#344C43]/25 bg-[#EFE7DC] pl-9 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20 sm:text-[10px]"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
            </label>
          </div>
        </div>

        {/* ══ THE INDEX + THE PROOF SHEET ════════════════════════════════ */}
        <div className="mt-4 grid gap-5 lg:grid-cols-12 lg:items-start">

          {/* ── Left — the edition index ── */}
          <section aria-labelledby="index-heading" className="lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="index-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">
                The Register — Your Listings
              </h2>
              <p aria-live="polite" className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#344C43]/55">
                {visible.length} {visible.length === 1 ? "listing" : "listings"} on the shelf
              </p>
            </div>

            {items.length === 0 ? (
              /* ── Portfolio empty state — first listing ── */
              <div className="mt-3 flex flex-col items-center border border-dashed border-[#344C43]/35 bg-[#EFE7DC]/50 px-6 py-16 text-center">
                <BookOpenCheck aria-hidden="true" className="size-11 text-[#668B78]" strokeWidth={1.5} />
                <h3 className="portfolio-serif mt-4 text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
                  The register is <span className="italic text-[#B87959]">bare.</span>
                </h3>
                <p className="mt-2 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/60">
                  Every tutor starts with an empty register. Your first batch is six sections away.
                </p>
                <Link
                  href="/dashboard/tutor/post-tuition"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm border border-[#A6683F]/60 bg-[#B87959] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#344C43]"
                >
                  Publish your first tuition
                  <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
                </Link>
              </div>
            ) : visible.length === 0 ? (
              /* ── Filtered-empty pigeonhole ── */
              <div className="mt-3 flex flex-col items-center border border-dashed border-[#344C43]/35 bg-[#EFE7DC]/50 px-6 py-14 text-center">
                <SearchX aria-hidden="true" className="size-10 text-[#B87959]" strokeWidth={1.5} />
                <h3 className="portfolio-serif mt-4 text-2xl font-black tracking-tight text-[#344C43]">
                  Nothing on this <span className="italic text-[#B87959]">shelf.</span>
                </h3>
                <p className="mt-2 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/60">
                  {query.trim()
                    ? `No edition matches “${query.trim()}” — the register keeps honest books.`
                    : "No editions filed under these filters."}
                </p>
                <Button
                  type="button"
                  onClick={() => { setQuery(""); setSubject("All Subjects"); setApproval("all"); setActiveFilter("all") }}
                  className="mt-6 h-11 rounded-sm border border-[#344C43]/40 bg-[#344C43] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC] shadow-[4px_4px_0_#B87959] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#B87959]"
                >
                  Restock the shelf
                </Button>
              </div>
            ) : (
              <ol className="mt-3 space-y-2.5">
                {visible.map((l) => {
                  const active = l.ref === selectedRef
                  const meta = APPROVAL_META[l.approval]
                  return (
                    <li key={l.ref}>
                      <article
                        className={cn(
                          "relative border transition-all duration-200",
                          active
                            ? "border-[#344C43] bg-[#EFE7DC] shadow-[5px_6px_0_#B87959]"
                            : "border-[#344C43]/25 bg-[#EFE7DC]/65 hover:border-[#344C43]/55 hover:bg-[#EFE7DC]"
                        )}
                      >
                        {/* Main row — selectable */}
                        <button
                          type="button"
                          onClick={() => setSelectedRef(l.ref)}
                          aria-pressed={active}
                          aria-label={`Open proof sheet for ${l.ref}, ${l.title} — ${meta.label}${l.isActive ? ", active" : ", closed"}`}
                          className="grid w-full grid-cols-[3.2rem_1fr_auto] items-stretch text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#344C43] sm:grid-cols-[4.2rem_1fr_auto_auto]"
                        >
                          {/* Edition plate */}
                          <span aria-hidden="true" className={cn(
                            "flex flex-col items-center justify-center gap-1 border-r py-3 transition-colors sm:py-4",
                            active ? "border-[#344C43] bg-[#344C43]" : "border-[#344C43]/20 bg-[#344C43]/5"
                          )}>
                            <span className={cn("font-mono text-[10px] uppercase tracking-[0.3em]", active ? "text-[#C98B6D]" : "text-[#B87959]")}>Ed.</span>
                            <span className={cn("portfolio-serif text-sm font-black leading-none tracking-tight sm:text-base", active ? "text-[#EFE7DC]" : "text-[#344C43]")}>
                              {l.ref.replace("ML-", "")}
                            </span>
                          </span>

                          {/* Body */}
                          <span className="min-w-0 px-3 py-3 sm:px-4">
                            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#344C43]/50 sm:text-[10px]">
                              {l.subject} · {l.classLevel}
                            </span>
                            <span className="portfolio-serif mt-1 block text-[13px] font-black leading-snug tracking-tight text-[#344C43] sm:text-[15px]">
                              {l.title}
                            </span>
                            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#344C43]/60 sm:text-[10px]">
                              <span className="inline-flex items-center gap-1">{l.mode === "Online" ? <Wifi aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} /> : <MapPin aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />}{l.mode}</span>
                              <span aria-hidden="true">·</span>
                              <span>{l.daysPerWeek}× / wk</span>
                              <span aria-hidden="true">·</span>
                              <span className="hidden sm:inline">{l.location}</span>
                              <span aria-hidden="true">·</span>
                              <span>{l.createdAt}</span>
                            </span>
                          </span>

                          {/* Salary + applicants */}
                          <span className="flex flex-col items-center justify-center gap-0.5 border-l border-[#344C43]/15 px-2 sm:px-3">
                            <span className="portfolio-serif text-sm font-black leading-none tracking-tight text-[#344C43] sm:text-base">
                              ৳{l.monthlySalary.toLocaleString("en-IN")}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#344C43]/50">/ month</span>
                            <span className="mt-1 flex items-center gap-1 font-mono text-[9px] font-bold tabular-nums text-[#B87959]">
                              <Users aria-hidden="true" className="size-3" strokeWidth={2} />
                              {l.applicants}
                            </span>
                          </span>

                          {/* Approval stamp + active chip */}
                          <span className="hidden flex-col items-center justify-center gap-1.5 border-l border-[#344C43]/15 px-3 md:flex">
                            <span className={cn("whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]", meta.chip)}>
                              {meta.label}
                            </span>
                            <span className={cn(
                              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em]",
                              l.isActive ? "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]" : "border-[#344C43]/40 bg-[#344C43]/5 text-[#344C43]/60"
                            )}>
                              <span aria-hidden="true" className={cn("size-1.5 rounded-full", l.isActive ? "bg-[#668B78]" : "bg-[#344C43]/50")} />
                              {l.isActive ? "Active" : "Closed"}
                            </span>
                          </span>
                        </button>

                        {/* Action strip */}
                        <div className="flex flex-wrap items-center gap-1.5 border-t border-dashed border-[#344C43]/25 px-3 py-2 sm:px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedRef(l.ref)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-[#344C43]/25 bg-transparent px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                          >
                            <Eye aria-hidden="true" className="size-3.5" strokeWidth={2} />
                            View Details
                          </button>
                          <Link
                            href="/dashboard/tutor/post-tuition"
                            className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-[#344C43]/25 bg-transparent px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                          >
                            <Pencil aria-hidden="true" className="size-3.5" strokeWidth={2} />
                            Edit Tuition
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleActive(l.ref)}
                            aria-label={l.isActive ? `Close tuition ${l.ref}` : `Activate tuition ${l.ref}`}
                            className={cn(
                              "inline-flex h-8 items-center gap-1.5 rounded-sm border px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                              l.isActive
                                ? "border-[#B87959]/45 bg-transparent text-[#B87959] hover:bg-[#B87959]/10"
                                : "border-[#668B78]/45 bg-transparent text-[#4A695C] hover:bg-[#668B78]/10"
                            )}
                          >
                            <Power aria-hidden="true" className="size-3.5" strokeWidth={2} />
                            {l.isActive ? "Close Tuition" : "Activate"}
                          </button>
                          {confirmDelete === l.ref ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="font-mono text-[9px] font-bold uppercase leading-none tracking-[0.16em] text-[#A34343]">Tear up?</span>
                              <button
                                type="button"
                                onClick={() => deleteListing(l.ref)}
                                className="inline-flex h-8 items-center rounded-sm border border-[#A34343]/50 bg-[#A34343] px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#EFE7DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="inline-flex h-8 items-center rounded-sm border border-[#344C43]/25 px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                              >
                                Keep
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(l.ref)}
                              aria-label={`Delete tuition ${l.ref}`}
                              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-[#A34343]/30 bg-transparent px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#A34343] transition-all hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                            >
                              <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={2} />
                              Delete
                            </button>
                          )}
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>

          {/* ── Right — the proof sheet (sticky) ── */}
          {selected ? (
            <StickyRail ariaLabelledby="proof-heading" className="lg:col-span-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="proof-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">
                  The Proof Sheet
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#344C43]/55">{selected.ref}</p>
              </div>

              <figure className="mt-3 border border-[#344C43]/30 bg-[#EFE7DC] shadow-[6px_7px_0_rgba(52,76,67,0.16)]">
                {/* Mini banner */}
                <div
                  className="relative flex h-32 flex-col justify-between border-b border-[#344C43]/20 p-4 sm:h-36"
                  style={{ backgroundColor: selected.tone, backgroundImage: "radial-gradient(circle at 85% 15%, rgba(242,237,223,0.12) 0%, transparent 55%)" }}
                  role="img"
                  aria-label={`Banner for ${selected.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="border border-dashed border-white/40 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/85">
                      {selected.subject}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "portfolio-stamp inline-block border-2 border-dashed px-2 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.22em] sm:text-[10px]",
                        selected.approval === "approved" && "border-white/60 text-white/95",
                        selected.approval === "pending" && "border-[#C98B6D] text-[#C98B6D]",
                        selected.approval === "rejected" && "border-[#E8B4B4] text-[#E8B4B4]"
                      )}
                    >
                      {selected.approval === "approved" ? "ON THE STANDS" : selected.approval === "pending" ? "AWAITING BOARD" : "RETURNED"}
                    </span>
                  </div>
                  <p className="portfolio-serif max-w-[26ch] text-lg font-black leading-[1.05] tracking-tight text-[#F2ECDF] sm:text-xl">
                    {selected.title}
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#344C43]/55">
                      Edition {selected.ref} · Created {selected.createdAt}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em]",
                      selected.isActive ? "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]" : "border-[#344C43]/40 bg-[#344C43]/5 text-[#344C43]/60"
                    )}>
                      <span aria-hidden="true" className={cn("size-1.5 rounded-full", selected.isActive ? "bg-[#668B78]" : "bg-[#344C43]/50")} />
                      {selected.isActive ? "Active — Listing Live" : "Closed — Edition Spent"}
                    </span>
                  </div>

                  <h3 className="portfolio-serif mt-2 text-xl font-black leading-tight tracking-tight text-[#344C43] sm:text-2xl">
                    {selected.title}
                  </h3>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#B87959]">
                    {selected.subject} · <span className="text-[#344C43]/55">{selected.classLevel}</span>
                  </p>

                  {/* Ledger */}
                  <dl className="mt-3 divide-y divide-[#344C43]/12 border-y border-[#344C43]/20 text-[11px]">
                    {[
                      { Icon: CalendarDays, k: "Schedule", v: selected.schedule },
                      { Icon: MapPin, k: "Location", v: selected.location },
                      { Icon: Wifi, k: "Mode", v: `${selected.mode} · ${selected.daysPerWeek} day${selected.daysPerWeek > 1 ? "s" : ""} per week` },
                      { Icon: Wallet, k: "Salary", v: `${fmtSalary(selected.monthlySalary)} / month` },
                      { Icon: Users, k: "Applicants", v: `${selected.applicants} in the ledger` },
                    ].map(({ Icon, k, v }) => (
                      <div key={k} className="flex items-baseline gap-2.5 py-2">
                        <Icon aria-hidden="true" className="size-3.5 shrink-0 translate-y-[2px] text-[#668B78]" strokeWidth={2} />
                        <dt className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/50">{k}</dt>
                        <dd className="font-semibold leading-snug tracking-tight text-[#344C43]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-3">
                    <SeatGauge filled={selected.seats.filled} cap={selected.seats.cap} />
                  </div>

                  {selected.note && (
                    <p className={cn(
                      "mt-3 border-l-2 py-1.5 pl-3 text-[11px] italic leading-snug",
                      selected.approval === "rejected" ? "border-[#A34343]/60 text-[#A34343]" : "border-[#344C43]/25 text-[#344C43]/70"
                    )}>
                      {selected.note}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href="/dashboard/tutor/post-tuition"
                      className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#344C43]/35 bg-transparent px-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-all hover:border-[#344C43] hover:bg-[#EFE7DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                    >
                      <Pencil aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      Edit Tuition
                    </Link>
                    <Link
                      href="/dashboard/tutor/applicants"
                      className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#344C43] bg-[#344C43] px-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC] shadow-[3px_3px_0_#B87959] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#B87959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]"
                    >
                      <Eye aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      View Applicants
                      <span className="font-mono text-[10px] text-[#C98B6D]">{selected.applicants}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleActive(selected.ref)}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-sm border px-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]",
                        selected.isActive
                          ? "border-[#B87959]/45 bg-transparent text-[#B87959] hover:bg-[#B87959]/10"
                          : "border-[#668B78]/45 bg-transparent text-[#4A695C] hover:bg-[#668B78]/10"
                      )}
                    >
                      <Power aria-hidden="true" className="size-4" strokeWidth={1.75} />
                      {selected.isActive ? "Close Tuition" : "Activate"}
                    </button>
                  </div>
                  {selected.isActive && (
                    <p className="mt-3 flex items-center gap-2 border-t border-[#344C43]/15 pt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#344C43]/55">
                      <CheckCircle2 aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                      Live — applications close 30 Nov · 2 seats remaining
                    </p>
                  )}
                </div>
              </figure>
            </StickyRail>
          ) : (
            <StickyRail ariaLabelledby="proof-empty-heading" className="lg:col-span-5">
              <div className="flex h-full min-h-64 flex-col items-center justify-center border border-dashed border-[#344C43]/35 bg-[#EFE7DC]/50 p-8 text-center">
                <Archive aria-hidden="true" className="size-9 text-[#344C43]/40" strokeWidth={1.5} />
                <h3 id="proof-empty-heading" className="portfolio-serif mt-3 text-xl font-black tracking-tight text-[#344C43]">
                  Nothing to proof.
                </h3>
                <p className="mt-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/55">
                  Every edition is torn — the register is yours to write.
                </p>
                <Link
                  href="/dashboard/tutor/post-tuition"
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-sm border border-[#A6683F]/60 bg-[#B87959] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#1E3A2F] transition-all hover:-translate-y-0.5"
                >
                  Publish a tuition
                  <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.5} />
                </Link>
              </div>
            </StickyRail>
          )}
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/tutor" backLabel="Back to the Register">
          <Link href="/dashboard/tutor/post-tuition" className="group inline-flex items-center gap-1.5 font-bold text-[#B87959] transition-colors hover:text-[#96603F]">
            Write the next edition
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </Colophon>
      </div>
    </div>
  )
}
