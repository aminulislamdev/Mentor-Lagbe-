"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  Feather,
  Inbox,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Colophon } from "@/components/dashboard/shared"
import { apiFetch, ApiError } from "@/lib/api"
import { useApi } from "@/lib/hooks/use-api"
import type { Application } from "@/lib/api-types"
import { Envelope, applicationRef } from "@/components/student/application-envelope"
import type { AppStatus } from "@/components/student/application-envelope"

// ─── Display helpers ─────────────────────────────────────────────────────────


const FILTERS: Array<{ key: "all" | AppStatus; label: string }> = [
  { key: "all", label: "All Mail" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Declined" },
]

type SortKey = "newest" | "oldest" | "feeAsc" | "feeDesc"

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "feeAsc", label: "Fee · low to high" },
  { key: "feeDesc", label: "Fee · high to low" },
]


// ─── Scoped post-room styles ─────────────────────────────────────────────────

const postRoomStyles = `
  .postroom-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .postroom-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes postroom-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .postroom-rise { animation: postroom-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes postroom-stamp-land {
    0%   { transform: rotate(-18deg) scale(1.6); }
    60%  { transform: rotate(-11deg) scale(0.94); }
    100% { transform: rotate(-12deg) scale(1); }
  }
  .postroom-stamp { animation: postroom-stamp-land 0.45s cubic-bezier(0.2, 1.4, 0.35, 1) both; animation-delay: var(--stamp-delay, 0s); }

  @media (prefers-reduced-motion: reduce) {
    .postroom-rise, .postroom-stamp { animation: none !important; }
  }
`


// ─── Loading letters ─────────────────────────────────────────────────────────

function LoadingLetters() {
  return (
    <div className="mt-3 space-y-3" aria-hidden="true">
      {[0, 1, 2].map((key) => (
        <div
          key={key}
          className="h-28 animate-pulse border border-[#344C43]/15 bg-[#EFE7DC]/60"
        />
      ))}
    </div>
  )
}

// ─── Error notice ────────────────────────────────────────────────────────────

function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="mt-3 flex flex-col items-start gap-3 border border-[#A34343]/40 bg-[#A34343]/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="postroom-serif text-lg font-black tracking-tight text-[#A34343]">
          The ledger could not be opened.
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#344C43]/60">
          {message}
        </p>
      </div>
      <Button
        type="button"
        onClick={onRetry}
        className="h-10 shrink-0 rounded-sm border border-[#A34343] bg-[#A34343] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#EFE7DC] hover:bg-[#8f3838]"
      >
        <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
        Retry
      </Button>
    </div>
  )
}

// ─── Empty pigeonhole ────────────────────────────────────────────────────────

function EmptyPigeonhole({
  query,
  hasApplications,
  onClear,
}: {
  query: string
  hasApplications: boolean
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center border border-dashed border-[#344C43]/35 bg-[#EFE7DC]/50 px-6 py-14 text-center">
      {/* Pigeonhole illustration */}
      <div aria-hidden="true" className="relative grid w-48 grid-cols-3 gap-[3px] border-2 border-[#344C43]/40 bg-[#344C43]/40 p-[3px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex h-12 items-center justify-center bg-[#EFE7DC] sm:h-14">
            {i === 4 && <Feather className="size-6 text-[#B87959]" strokeWidth={1.5} />}
          </div>
        ))}
      </div>
      <h3 className="postroom-serif mt-6 text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
        The pigeonhole is <span className="italic text-[#B87959]">empty.</span>
      </h3>
      <p className="mt-2 max-w-sm font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/60">
        {!hasApplications
          ? "You have not sent a letter yet — browse the catalogue and apply to your first tuition."
          : query
            ? `Nothing filed under “${query}” — try another pigeonhole.`
            : "Nothing filed under this filter — try another pigeonhole."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasApplications && (
          <Button
            type="button"
            onClick={onClear}
            className="h-11 rounded-sm border border-[#344C43]/40 bg-[#344C43] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC] shadow-[4px_4px_0_#B87959] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#B87959]"
          >
            Clear the filters
          </Button>
        )}
        <Link
          href="/tuitions"
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-sm border px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] transition-all",
            hasApplications
              ? "border-[#344C43]/30 bg-transparent text-[#344C43] hover:border-[#B87959] hover:text-[#B87959]"
              : "border-[#344C43]/40 bg-[#344C43] text-[#EFE7DC] shadow-[4px_4px_0_#B87959] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#B87959]"
          )}
        >
          Browse the catalogue
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function MyApplicationsPage() {
  const applications = useApi<Application[]>("/api/applications/student")

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | AppStatus>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)

  const apps = useMemo(() => applications.data ?? [], [applications.data])
  const loading = applications.loading && !applications.data
  const error = applications.error

  const counts = useMemo(
    () => ({
      all: apps.length,
      pending: apps.filter((application) => application.status === "pending").length,
      accepted: apps.filter((application) => application.status === "accepted").length,
      rejected: apps.filter((application) => application.status === "rejected").length,
    }),
    [apps]
  )

  const visible = useMemo(() => {
    let list = apps.filter((application) => {
      if (filter !== "all" && application.status !== filter) return false
      if (!query.trim()) return true

      const term = query.trim().toLowerCase()
      return [
        application.tuitionTitle,
        application.subject,
        application.tutorEmail,
        application.preferredSchedule,
        applicationRef(application),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    })

    switch (sort) {
      case "oldest":
        list = [...list].sort(
          (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        )
        break
      case "feeAsc":
        list = [...list].sort((a, b) => a.monthlyFee - b.monthlyFee)
        break
      case "feeDesc":
        list = [...list].sort((a, b) => b.monthlyFee - a.monthlyFee)
        break
      default:
        list = [...list].sort(
          (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        )
    }

    return list
  }, [apps, query, filter, sort])

  const withdraw = async (application: Application) => {
    setWithdrawingId(application._id)

    try {
      await apiFetch(`/api/applications/${application._id}`, { method: "DELETE" })
      toast.success("Application withdrawn")
      applications.refetch()
    } catch (cause) {
      toast.error(
        cause instanceof ApiError ? cause.message : "Could not withdraw the application"
      )
    } finally {
      setWithdrawingId(null)
    }
  }

  return (
    <div className="postroom-root relative text-[#344C43]">
      <style>{postRoomStyles}</style>

      <div className="relative mx-auto max-w-[1180px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        {/* ══ MASTHEAD — the post room frontispiece ══════════════════════ */}
        <header className="grid gap-6 border-b-2 border-[#344C43] pb-6 sm:pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
              [ The Post Room — Application Ledger ]
            </p>
            <h1
              className="postroom-rise postroom-serif mt-3 font-black leading-[0.92] tracking-[-0.035em] text-[#344C43]"
              style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.6vw, 4.5rem)" } as React.CSSProperties}
            >
              Every letter,
              <span className="relative block w-fit italic text-[#B87959]">
                accounted for.
                <svg aria-hidden="true" viewBox="0 0 260 12" className="absolute -bottom-2.5 left-0 w-full overflow-visible text-[#344C43]/70" fill="none">
                  <path d="M3 8C50 3 92 2.4 132 6.6C172 10.8 214 8.6 257 4.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1 6" />
                </svg>
              </span>
            </h1>
            <p className="postroom-rise mt-5 max-w-[50ch] text-sm leading-relaxed text-[#344C43]/80 sm:text-[15px]" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              Every envelope you have entrusted to the atelier — sent, sealed,
              opened, or politely returned. This is where each one lands, and
              what came of it.
            </p>
          </div>

          {/* The Tally — three wax-seal counts on a dotted delivery line */}
          <dl className="postroom-rise lg:col-span-5" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
            <div className="relative border border-[#344C43]/25 bg-[#EFE7DC] p-4 sm:p-5">
              <span aria-hidden="true" className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full border border-[#344C43]/25 bg-[#F2ECDF]" />
              <span aria-hidden="true" className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full border border-[#344C43]/25 bg-[#F2ECDF]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#344C43]/55">
                The Tally — Live Count
              </p>
              <div className="mt-3 grid grid-cols-3 divide-x divide-[#344C43]/15">
                {([
                  { key: "pending", n: counts.pending, label: "Pending", tone: "text-[#B87959]" },
                  { key: "accepted", n: counts.accepted, label: "Accepted", tone: "text-[#4A695C]" },
                  { key: "rejected", n: counts.rejected, label: "Declined", tone: "text-[#344C43]/55" },
                ] as const).map((s) => (
                  <div key={s.key} className="flex flex-col items-center py-1">
                    <span className={cn("postroom-serif text-5xl font-black leading-none tracking-tight sm:text-6xl", s.tone)}>
                      {s.n}
                    </span>
                    <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[#344C43]/55 sm:text-[10px]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-dashed border-[#344C43]/25 pt-2 text-center font-mono text-[9px] uppercase tracking-[0.26em] text-[#344C43]/45">
                {counts.all} {counts.all === 1 ? "letter" : "letters"} sent · {counts.accepted} {counts.accepted === 1 ? "yes" : "yeses"}
              </p>
            </div>
          </dl>
        </header>

        {/* ══ SORTING CHUTE — filters, search, sort ══════════════════════ */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Mail-slot tabs */}
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-10 items-baseline gap-2 border px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:text-[10px]",
                    active
                      ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[3px_3px_0_#B87959]"
                      : "border-[#344C43]/25 bg-transparent text-[#344C43]/65 hover:border-[#344C43]/55 hover:text-[#344C43]"
                  )}
                >
                  {f.label}
                  <span className={cn("text-[10px] tabular-nums", active ? "text-[#C98B6D]" : "text-[#B87959]")}>
                    {f.key === "all" ? counts.all : counts[f.key]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <label htmlFor="postroom-search" className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">Search applications by title, tutor, subject, or reference</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45"
                strokeWidth={1.75}
              />
              <Input
                id="postroom-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the letters…"
                className="h-11 rounded-sm border-[#344C43]/25 bg-[#EFE7DC] pl-9 text-[13px] placeholder:text-[#344C43]/38 focus:border-[#668B78] focus:ring-[#668B78]/20"
              />
            </label>

            {/* Sort */}
            <label htmlFor="postroom-sort" className="relative shrink-0">
              <span className="sr-only">Sort applications</span>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/45" strokeWidth={1.75} />
              <select
                id="postroom-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 appearance-none rounded-sm border border-[#344C43]/25 bg-[#EFE7DC] pl-9 pr-8 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20 sm:text-[10px]"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#344C43]/55" strokeWidth={2} />
            </label>
          </div>
        </div>

        {/* ══ THE REGISTRY — envelopes ═══════════════════════════════════ */}
        <p aria-live="polite" className="mt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-[#344C43]/55">
          {loading
            ? "Reading the ledger…"
            : `${visible.length} ${visible.length === 1 ? "letter" : "letters"} on the table${filter !== "all" ? ` · filed under ${filter}` : ""}`}
        </p>

        {loading ? (
          <LoadingLetters />
        ) : error ? (
          <LoadError message={error} onRetry={applications.refetch} />
        ) : visible.length === 0 ? (
          <div className="mt-3">
            <EmptyPigeonhole
              query={query.trim()}
              hasApplications={apps.length > 0}
              onClear={() => {
                setQuery("")
                setFilter("all")
              }}
            />
          </div>
        ) : (
          <ol className="mt-3 space-y-3">
            {visible.map((app) => (
              <li key={app._id}>
                <Envelope
                  app={app}
                  expanded={expandedId === app._id}
                  onToggle={() => setExpandedId((current) => (current === app._id ? null : app._id))}
                  onWithdraw={() => withdraw(app)}
                  withdrawing={withdrawingId === app._id}
                />
              </li>
            ))}
          </ol>
        )}

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/student" backLabel="Back to the Almanac">
          <span className="flex items-center gap-1.5">
            <Inbox aria-hidden="true" className="size-3.5 text-[#B87959]" strokeWidth={2} />
            Replies are read aloud in the reading room — Fridays, six sharp
          </span>
        </Colophon>
      </div>
    </div>
  )
}
