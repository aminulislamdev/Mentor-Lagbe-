"use client"

import { useMemo, useState } from "react"
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
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApi } from "@/lib/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { IndexPanel, Monogram, StatusChip, EmptyState, Colophon } from "@/components/dashboard/shared"
import { formatFee } from "@/lib/adapters"
import type { Tuition, ApprovalStatus } from "@/lib/api-types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tuitionRef(tuition: Tuition): string {
  return `ML-${tuition._id.slice(-4).toUpperCase()}`
}

// ─── Status metadata ─────────────────────────────────────────────────────────

const STATUS_META: Record<ApprovalStatus, { label: string; tone: "terracotta" | "sage" | "rose"; Icon: typeof CalendarDays; stampBorder: string; stampText: string }> = {
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

const SUBJECTS = ["All Subjects", "Physics", "Chemistry", "Biology", "Mathematics", "IELTS"] as const
const STATUS_FILTERS: Array<{ key: "all" | ApprovalStatus; label: string }> = [
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

// ─── Scoped terminal styles ──────────────────────────────────────────────────

const studioStyles = `
  .studio-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
  .studio-review-root ::selection { background: #C9A25E; color: #10181A; }
  @keyframes studio-rise { from { transform: translateY(16px); } to { transform: translateY(0); } }
  .studio-rise { animation: studio-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }
  @keyframes studio-dialog-in { from { opacity: 0.4; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .studio-dialog { animation: studio-dialog-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .studio-rise, .studio-dialog { animation: none !important; }
  }
`

// ─── Ruling dialog ───────────────────────────────────────────────────────────

function RulingDialog({
  kind,
  submission,
  onClose,
  onConfirm,
}: {
  kind: "approve" | "reject"
  submission: Tuition
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
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-[#10181A]/78 backdrop-blur-[3px]" />
      <div
        className={cn(
          "studio-dialog relative w-full max-w-md border p-6 shadow-2xl",
          isApprove ? "border-[#7AA890]/40 bg-[#141E1B]" : "border-[#A34343]/45 bg-[#2B1B18]"
        )}
      >
        <span aria-hidden="true" className={cn("absolute right-4 top-4 select-none font-mono text-[24px] leading-none", isApprove ? "text-[#C9A25E]/75" : "text-[#A34343]/75")}>
          {isApprove ? "§" : "⌧"}
        </span>
        <p className={cn("font-mono text-[10px] uppercase tracking-[0.32em]", isApprove ? "text-[#C9A25E]" : "text-[#E8B4B4]")}>
          {isApprove ? "The Seal of Approval" : "The Returned Proof"}
        </p>
        <h3 className={cn("studio-serif mt-1.5 text-2xl font-black leading-tight tracking-tight", isApprove ? "text-[#F2EDDF]" : "text-[#F7EDE1]")}>
          {isApprove ? "Ink this batch live?" : "Return this submission?"}
        </h3>
        <p className={cn("mt-2 text-[13px] leading-relaxed", isApprove ? "text-[#F2EDDF]/72" : "text-[#F7EDE1]/72")}>
          {isApprove ? (
            <>You are approving <strong className="text-[#F2EDDF]">{submission.title}</strong> by <strong className="text-[#F2EDDF]">{submission.tutorName}</strong>. The listing goes live on the public index immediately with a verified seal.</>
          ) : (
            <>You are rejecting <strong className="text-[#F7EDE1]">{submission.title}</strong>. The tutor receives a kind one-line note and may revise and resubmit next term.</>
          )}
        </p>
        <p className={cn("mt-4 border-t pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em]", isApprove ? "border-[#F2EDDF]/12 text-[#F2EDDF]/45" : "border-[#F7EDE1]/12 text-[#F7EDE1]/45")}>
          {isApprove ? "Goes live to public index · board notified" : "Off-brief outcome claims · Tutor notified with reason"}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} className={cn("h-11 rounded-sm px-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em]", isApprove ? "text-[#F2EDDF]/60 hover:bg-[#F2EDDF]/8 hover:text-[#F2EDDF]" : "text-[#F7EDE1]/60 hover:bg-[#F7EDE1]/8 hover:text-[#F7EDE1]")}>
            {isApprove ? "Hold Review" : "Keep In Queue"}
          </Button>
          <Button type="button" onClick={onConfirm} className={cn("h-11 rounded-sm border px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] shadow-[4px_4px_0_#10181A]", isApprove ? "border-[#D8C9A3]/55 bg-[#C9A25E] text-[#10181A] hover:bg-[#D8B67A]" : "border-[#D98C8C]/40 bg-[#A34343] text-[#F7EDE1] hover:bg-[#B85252]")}>
            {isApprove ? "Affix the Seal" : "Seal the Return"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminTuitionsPage() {
  const [query, setQuery] = useState("")
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>("All Subjects")
  const [status, setStatus] = useState<"all" | ApprovalStatus>("all")
  const [mode, setMode] = useState<"all" | "Online" | "Offline">("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null)
  const [dossierOpen, setDossierOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch tuitions from API
  const tuitionsApi = useApi<Tuition[]>(`/api/admin/tuitions?${new URLSearchParams({
    ...(status !== "all" ? { approvalStatus: status } : {}),
    ...(query.trim() ? { search: query.trim() } : {}),
    limit: "100",
  }).toString()}`)

  const items = useMemo(() => tuitionsApi.data ?? [], [tuitionsApi.data])
  const loading = tuitionsApi.loading && !tuitionsApi.data
  const error = tuitionsApi.error

  // Client-side filters and sort
  const visible = useMemo(() => {
    let list = items.filter((s) => {
      if (mode !== "all" && s.mode !== mode) return false
      if (subject !== "All Subjects" && s.subject !== subject) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [s.title, s.tutorName, s.subject, s.classLevel, s._id, s.location].join(" ").toLowerCase().includes(q)
    })
    switch (sort) {
      case "oldest":
        list = [...list].sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
        break
      case "feeAsc":
        list = [...list].sort((a, b) => a.monthlyFee - b.monthlyFee)
        break
      case "feeDesc":
        list = [...list].sort((a, b) => b.monthlyFee - a.monthlyFee)
        break
      default:
        list = [...list].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    }
    return list
  }, [items, query, subject, mode, sort])

  const selected = items.find((s) => s._id === selectedId) ?? items[0] ?? null

  // Counts
  const counts = useMemo(() => ({
    submitted: items.length,
    pending: items.filter((s) => s.approvalStatus === "pending").length,
    approved: items.filter((s) => s.approvalStatus === "approved").length,
    rejected: items.filter((s) => s.approvalStatus === "rejected").length,
  }), [items])

  const segments = [
    { label: "Pending", count: counts.pending, tone: "#B87959" },
    { label: "Approved", count: counts.approved, tone: "#668B78" },
    { label: "Rejected", count: counts.rejected, tone: "#A34343" },
  ]
  const segTotal = Math.max(1, segments.reduce((n, s) => n + s.count, 0))

  const decide = async (tuitionId: string, verdict: ApprovalStatus) => {
    setActionLoading(true)
    setActionError(null)
    try {
      await apiFetch(`/api/admin/tuitions/${tuitionId}/status`, {
        method: "PATCH",
        body: { approvalStatus: verdict },
      })
      tuitionsApi.refetch()
      setDialog(null)
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Failed to update")
    } finally {
      setActionLoading(false)
    }
  }

  const refetch = () => tuitionsApi.refetch()

  return (
    <div className="studio-review-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{studioStyles}</style>

      {/* ══ MASTHEAD ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]">
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pb-7">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — The Review Studio ]
              </p>
              <h1 className="studio-rise studio-serif mt-2.5 text-4xl font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF] sm:text-5xl lg:text-6xl">
                Tuition
                <span className="block">
                  <span className="italic text-[#C9A25E]">Review Studio.</span>
                  <span aria-hidden="true" className="text-[#B87959]">.</span>
                </span>
              </h1>
              <p className="studio-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/72" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                Every batch awaiting your ink — read the proof, check the
                credentials, and stamp the seal. Board SLA: two working days,
                no exceptions.
              </p>
            </div>
            <div className="lg:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#F2EDDF]/40">
                Pending Review
              </p>
              <div className="mt-1 flex items-end gap-3">
                <p className="studio-serif text-6xl font-black leading-none text-[#C9A25E] sm:text-7xl">
                  {loading ? "—" : String(counts.pending).padStart(2, "0")}
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
              Total submitted — <span className="font-bold text-[#F2EDDF]">{counts.submitted}</span> · Resolve rate <span className="font-bold text-[#9DBFA9]">97.4%</span>
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
                <span className="studio-serif text-lg font-black leading-none text-[#EFE8DA] sm:text-2xl">
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
          <IndexPanel tab="The Submission Ledger" meta={`${visible.length} of ${items.length} on view`} className="lg:col-span-7">
            {loading ? (
              <div className="space-y-3" aria-hidden="true">
                {[0, 1, 2, 3].map((k) => (
                  <div key={k} className="h-16 animate-pulse border border-[#10181A]/15 bg-[#10181A]/5" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Inbox aria-hidden="true" className="size-9 text-[#C9A25E]" strokeWidth={1.5} />
                <p className="terminal-serif mt-3 text-lg font-black tracking-tight">The register could not be opened.</p>
                <p className="mt-1 max-w-xs font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">
                  {error}
                </p>
                <Button type="button" onClick={refetch} className="mt-3 h-9 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#D8C9A3] hover:bg-[#1E2A24]">
                  <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
                  Retry
                </Button>
              </div>
            ) : visible.length === 0 ? (
              <EmptyState
                Icon={Inbox}
                tone="terminal"
                title={<>The studio is <span className="italic text-[#C9A25E]">clear.</span></>}
                description={query.trim() ? `No submission matches “${query.trim()}” — the board keeps honest books.` : "Nothing filed under these filters — every proof ruled upon."}
                actionLabel="Clear the desk"
                onAction={() => { setQuery(""); setSubject("All Subjects"); setStatus("all"); setMode("all") }}
              />
            ) : (
              <ol className="space-y-2.5">
                {visible.map((s) => {
                  const meta = STATUS_META[s.approvalStatus]
                  const selected = s._id === selectedId
                  const ref = `ML-${s._id.slice(-4).toUpperCase()}`
                  return (
                    <li key={s._id}>
                      <button
                        type="button"
                        onClick={() => { setSelectedId(s._id); setDossierOpen(false) }}
                        aria-pressed={selected}
                        aria-label={`Open proof sheet for ${ref}, ${s.title} by ${s.tutorName} — ${meta.label}`}
                        className={cn(
                          "group grid w-full grid-cols-[4.5rem_1fr] items-stretch border text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E] sm:grid-cols-[6.5rem_1fr_auto]",
                          selected
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
                            {ref} · {s.subject}
                          </span>
                          <span className="studio-serif mt-0.5 block text-[11px] font-black leading-snug tracking-tight sm:text-[12.5px]">
                            {s.title}
                          </span>
                          <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-[#10181A]/60 sm:text-[10px]">
                            {s.tutorName} · {s.classLevel}
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#10181A]/55 sm:text-[10px]">
                            <span className="font-bold text-[#10181A]">{formatFee(s.monthlyFee)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{s.daysPerWeek}×/wk</span>
                            <span aria-hidden="true" className="hidden sm:inline">·</span>
                            <span className="hidden sm:inline">{new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
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
              meta={tuitionRef(selected)}
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
                      selected.approvalStatus === "pending" && "border-[#C9A25E] text-[#D8C9A3]",
                      selected.approvalStatus === "approved" && "border-[#7AA890] text-[#9DBFA9]",
                      selected.approvalStatus === "rejected" && "border-[#A34343] text-[#E8B4B4]"
                    )}
                  >
                    {selected.approvalStatus === "pending" ? "AWAITING" : selected.approvalStatus === "approved" ? "SEALED" : "RETURNED"}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#B87959]">
                  {tuitionRef(selected)} · Submitted {new Date(selected.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
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
                      <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />
                    </span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/55">
                      {selected.tutorEmail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase leading-snug tracking-[0.16em] text-[#10181A]/50 text-right">
                    {selected.description.split("·")[0].trim().slice(0, 40)}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-[11.5px] leading-relaxed text-[#10181A]/80">
                  {selected.description}
                </p>

                {/* Board Requirements — not available from API, show description */}
                <div className="mt-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#10181A]/60">
                    Board Requirements
                  </p>
                  <ul className="mt-1 space-y-1">
                    <li className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#10181A]/80">
                      <ClipboardCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                      Subject: {selected.subject}
                    </li>
                    <li className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#10181A]/80">
                      <ClipboardCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                      Class Level: {selected.classLevel}
                    </li>
                    <li className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#10181A]/80">
                      <ClipboardCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                      Mode: {selected.mode} · {selected.daysPerWeek} days/week
                    </li>
                    <li className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#10181A]/80">
                      <ClipboardCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                      Location: {selected.location}
                    </li>
                  </ul>
                </div>

                {/* Ledger rows */}
                <dl className="mt-3 divide-y divide-[#10181A]/12 border-y border-[#10181A]/20 text-[10.5px]">
                  {[
                    { Icon: Wallet, k: "Salary", v: `${formatFee(selected.monthlyFee)} / month` },
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
                      ["Reference", tuitionRef(selected)],
                      ["Tutor", selected.tutorName],
                      ["Tutor Email", selected.tutorEmail],
                      ["Submitted", new Date(selected.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })],
                      ["Approval", selected.approvalStatus],
                      ["Status", selected.isActive ? "Active" : "Closed"],
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
                    disabled={actionLoading || selected.approvalStatus === "approved"}
                    onClick={() => setDialog("approve")}
                    className="h-11 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#9DBFA9] hover:bg-[#1E2A24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A] disabled:opacity-50"
                  >
                    <CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2.25} />
                    Approve Tuition
                  </Button>
                  <Button
                    type="button"
                    disabled={actionLoading || selected.approvalStatus === "rejected"}
                    onClick={() => setDialog("reject")}
                    className="h-11 rounded-sm border border-[#A34343]/50 bg-transparent px-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#A34343] hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343] disabled:opacity-50"
                  >
                    <XCircle aria-hidden="true" className="size-4" strokeWidth={2} />
                    Reject Tuition
                  </Button>
                </div>
                {actionError && (
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#A34343]">{actionError}</p>
                )}
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
          onConfirm={() => decide(selected._id, dialog === "approve" ? "approved" : "rejected")}
        />
      )}
    </div>
  )
}