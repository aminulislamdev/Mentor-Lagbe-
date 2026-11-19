"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  ChevronDown,
  Hourglass,
  CheckCircle2,
  XCircle,
  Mail,
  ArrowUpDown,
  ArrowRight,
  Feather,
  Phone,
  CalendarDays,
  MapPin,
  Wallet,
  Inbox,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Colophon } from "@/components/dashboard/shared"

// ─── Static post-room data ───────────────────────────────────────────────────

type AppStatus = "pending" | "accepted" | "declined"

interface Application {
  ref: string
  title: string
  subject: string
  tutor: string
  tutorMeta: string
  phone: string
  schedule: string
  place: string
  fee: number
  applied: string
  appliedSort: number // yyyymmdd
  status: AppStatus
  yourNote: string
  theirReply: string
}

const APPLICATIONS: Application[] = [
  {
    ref: "#AP-1039",
    title: "ICT Practical Sprint — Number Systems",
    subject: "ICT",
    tutor: "Ms. Rumana Karim",
    tutorMeta: "Dhaka College · 6 yrs teaching",
    phone: "+880 1712-405 220",
    schedule: "Thu · 6:30 PM · Lab-based",
    place: "Dhanmondi, Dhaka",
    fee: 3200,
    applied: "14 Nov '26",
    appliedSort: 20261114,
    status: "pending",
    yourNote: "Number systems keep melting in the exam hall — I need the timed-drill treatment before the practical.",
    theirReply: "Awaiting Ms. Rumana's envelope back. Median reply: 4.2 days.",
  },
  {
    ref: "#AP-1038",
    title: "Higher Maths — Admission Marathon",
    subject: "Higher Maths",
    tutor: "Mr. Tanvir Alam",
    tutorMeta: "BUET '28 · Admission wing · 10 yrs",
    phone: "+880 1819-330 781",
    schedule: "Tue & Thu · 5:00 PM · BUET Road",
    place: "BUET Road, Shahbagh",
    fee: 5200,
    applied: "11 Nov '26",
    appliedSort: 20261111,
    status: "pending",
    yourNote: "Targeting BUET Civil '31. Problem sets 07–12 in your marathon look tailor-made for me.",
    theirReply: "Awaiting Mr. Tanvir's envelope back. Median reply: 4.2 days.",
  },
  {
    ref: "#AP-1031",
    title: "HSC Physics — The Integration Finals",
    subject: "Physics",
    tutor: "Dr. Nasrin Islam",
    tutorMeta: "BUET '12 · 7 yrs · Honours thesis",
    phone: "+880 1911-208 455",
    schedule: "Fri & Sat · 6:00 PM",
    place: "Dhanmondi, Dhaka",
    fee: 4500,
    applied: "04 Nov '26",
    appliedSort: 20261104,
    status: "accepted",
    yourNote: "Integration by parts keeps beating me. I read your chapter twice — seat me in the front bench.",
    theirReply: "“Front bench it is. Bring your Chapter 4 margin notes — I hear they're the talk of the reading room.”",
  },
  {
    ref: "#AP-1027",
    title: "Functional Groups, Finally",
    subject: "Chemistry",
    tutor: "Ms. Sadia Hossain",
    tutorMeta: "Dhaka Medical '29 · 4 yrs",
    phone: "+880 1713-902 614",
    schedule: "Sun · 4:00 PM · Online cohort",
    place: "Online · Zoom",
    fee: 3800,
    applied: "28 Oct '26",
    appliedSort: 20261028,
    status: "declined",
    yourNote: "Organic chemistry is my blind side — I will not walk into the HSC unarmed again.",
    theirReply: "“Dearest Scholar — the cohort filled with SSC candidates. Reapply for the January intake; you were lovely on paper.”",
  },
  {
    ref: "#AP-1019",
    title: "Comprehension for Boards — the Unseen Passage",
    subject: "English",
    tutor: "Mr. Arif Hossain",
    tutorMeta: "Jahangirnagar U. · 8 yrs",
    phone: "+880 1822-617 930",
    schedule: "Sat · 9:00 AM · Online cohort",
    place: "Online · Zoom",
    fee: 2800,
    applied: "21 Oct '26",
    appliedSort: 20261021,
    status: "declined",
    yourNote: "The unseen passage is where my marks go to die — teach me the examiner's habit of mind.",
    theirReply: "“Seat went to a repeater scholar with a 9.5 GPA. Send my regards to the Physics batch — you are doing well.”",
  },
  {
    ref: "#AP-1015",
    title: "Admission Physics — The Final Lap",
    subject: "Physics",
    tutor: "Dr. Nasrin Islam",
    tutorMeta: "BUET '12 · 7 yrs · Honours thesis",
    phone: "+880 1911-208 455",
    schedule: "Mon & Wed · 7:00 PM",
    place: "Dhanmondi, Dhaka",
    fee: 6800,
    applied: "02 Oct '26",
    appliedSort: 20261002,
    status: "accepted",
    yourNote: "Admission test physics or nothing. Six weeks, one syllabus, zero excuses.",
    theirReply: "“Six weeks. Two mock papers. One very determined scholar. Clock in, Tasnim.”",
  },
]

const STATUS_META: Record<
  AppStatus,
  { label: string; sub: string; Icon: typeof Hourglass }
> = {
  pending: { label: "Pending", sub: "Sealed", Icon: Hourglass },
  accepted: { label: "Accepted", sub: "Seal broken", Icon: CheckCircle2 },
  declined: { label: "Declined", sub: "Returned", Icon: XCircle },
}

const FILTERS: Array<{ key: "all" | AppStatus; label: string }> = [
  { key: "all", label: "All Mail" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
]

type SortKey = "newest" | "oldest" | "feeAsc" | "feeDesc"

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "feeAsc", label: "Fee · low to high" },
  { key: "feeDesc", label: "Fee · high to low" },
]

const fmtFee = (n: number) => `৳${n.toLocaleString("en-IN")}`

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

// ─── Postage stamp (status) ──────────────────────────────────────────────────

function PostageStamp({ status }: { status: AppStatus }) {
  const meta = STATUS_META[status]
  const tone =
    status === "accepted"
      ? "border-[#668B78] text-[#4A695C] bg-[#668B78]/10"
      : status === "pending"
        ? "border-[#B87959] text-[#B87959] bg-[#B87959]/10"
        : "border-[#344C43]/50 text-[#344C43]/60 bg-[#344C43]/5"

  return (
    <div
      className={cn(
        "postroom-stamp relative flex w-24 rotate-[-12deg] flex-col items-center border-2 border-dashed px-2 py-2.5 sm:w-28",
        tone
      )}
      style={{ "--stamp-delay": "0.15s" } as React.CSSProperties}
      aria-label={`Status: ${meta.label}`}
    >
      <meta.Icon aria-hidden="true" className="size-5 sm:size-6" strokeWidth={1.75} />
      <span className="mt-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.24em] sm:text-[10px]">
        {meta.label}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase leading-none tracking-[0.2em] opacity-75">
        {meta.sub}
      </span>
    </div>
  )
}

// ─── Postmark circle ─────────────────────────────────────────────────────────

function Postmark({ date }: { date: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-16 top-1/2 hidden size-24 -translate-y-1/2 rotate-[-16deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#344C43]/35 text-center md:flex"
    >
      <span className="font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
        Dhaka Post
        <br />
        {date}
      </span>
    </div>
  )
}

// ─── Single envelope (application row) ───────────────────────────────────────

function Envelope({
  app,
  expanded,
  onToggle,
  withdrawn,
  onWithdraw,
  onRestore,
}: {
  app: Application
  expanded: boolean
  onToggle: () => void
  withdrawn: boolean
  onWithdraw: () => void
  onRestore: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const meta = STATUS_META[app.status]

  return (
    <article
      className={cn(
        "group relative border border-[#344C43]/30 bg-[#EFE7DC] shadow-[4px_5px_0_rgba(52,76,67,0.14)] transition-all duration-300",
        withdrawn
          ? "opacity-60"
          : "hover:-translate-y-0.5 hover:border-[#344C43]/55 hover:shadow-[6px_8px_0_rgba(52,76,67,0.18)]"
      )}
      aria-label={`Application ${app.ref} — ${app.title}, ${meta.label}${withdrawn ? ", withdrawn" : ""}`}
    >
      <Postmark date={app.applied} />

      {/* Envelope body: ref strip | address | stamp */}
      <div className="grid grid-cols-[3.25rem_1fr_auto] items-stretch sm:grid-cols-[4.5rem_1fr_auto]">
        {/* Ref strip */}
        <div className="flex flex-col items-center justify-center gap-1 border-r border-dashed border-[#344C43]/30 px-1 py-4">
          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#344C43]/70 sm:text-[10px]">
            {app.ref.replace("#", "")}
          </span>
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#B87959]"
          />
          <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-[#344C43]/45 sm:text-[10px]">
            {app.applied}
          </span>
        </div>

        {/* Address zone */}
        <div className="min-w-0 px-3 py-4 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/45 sm:text-[10px]">
            To the Desk of — {app.subject}
          </p>
          <h3 className="postroom-serif mt-1 truncate text-base font-black leading-tight tracking-tight text-[#344C43] sm:text-lg">
            {app.title}
          </h3>
          <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[#B87959] sm:text-[10px]">
            {app.tutor} · <span className="text-[#344C43]/55">{app.tutorMeta}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#344C43]/60 sm:text-[10px]">
            <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />{app.place}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />{app.schedule}</span>
            <span className="inline-flex items-center gap-1.5"><Wallet aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} /><span className="font-bold text-[#344C43]">{fmtFee(app.fee)}<span className="font-normal opacity-70"> / mo</span></span></span>
          </div>
        </div>

        {/* Stamp + toggle */}
        <div className="flex flex-col items-center justify-center gap-2 border-l border-dashed border-[#344C43]/30 px-2 py-3 sm:px-5">
          {withdrawn ? (
            <div
              className="postroom-stamp flex w-24 rotate-[-12deg] flex-col items-center border-2 border-dashed border-[#344C43]/45 bg-[#344C43]/5 px-2 py-2.5 text-[#344C43]/55 sm:w-28"
              role="img"
              aria-label="Status: withdrawn"
            >
              <span className="font-mono text-[10px] font-bold uppercase leading-none tracking-[0.24em]">Withdrawn</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] opacity-75">Torn up</span>
            </div>
          ) : (
            <PostageStamp status={app.status} />
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`panel-${app.ref.replace("#", "")}`}
            className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#344C43]/60 underline decoration-[#B87959]/50 decoration-2 underline-offset-4 transition-colors hover:text-[#B87959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:text-[10px]"
          >
            {expanded ? "Close" : "Details"}
            <ChevronRight aria-hidden="true" className={cn("size-3 transition-transform duration-200", expanded && "rotate-90")} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Detail panel */}
      {expanded && (
        <div
          id={`panel-${app.ref.replace("#", "")}`}
          className="grid gap-4 border-t border-dashed border-[#344C43]/30 bg-[#F2ECDF]/70 px-4 py-4 sm:grid-cols-3 sm:gap-6 sm:px-6"
        >
          {/* Your note */}
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#B87959]">
              <Feather aria-hidden="true" className="size-3" strokeWidth={2} />
              Your Envelope
            </p>
            <p className="postroom-serif mt-1.5 text-[12px] italic leading-snug text-[#344C43]/90">
              “{app.yourNote}”
            </p>
          </div>

          {/* Their reply */}
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#668B78]">
              <Mail aria-hidden="true" className="size-3" strokeWidth={2} />
              The Reply
            </p>
            <p className="postroom-serif mt-1.5 text-[12px] italic leading-snug text-[#344C43]/90">
              {app.theirReply}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/50">
              <Phone aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} />
              {app.phone}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-start gap-2 border-t border-[#344C43]/15 pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#344C43]/55">
              Actions
            </p>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#344C43] underline decoration-[#668B78] decoration-2 underline-offset-4 transition-colors hover:text-[#4A695C]"
            >
              View tuition
              <ArrowRight aria-hidden="true" className="size-3" strokeWidth={2.5} />
            </Link>

            {withdrawn ? (
              <Button
                type="button"
                variant="ghost"
                onClick={onRestore}
                className="h-auto px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#668B78] hover:bg-[#668B78]/10 hover:text-[#4A695C]"
              >
                Restore letter
              </Button>
            ) : app.status === "pending" ? (
              confirming ? (
                <div className="w-full border border-[#A34343]/40 bg-[#A34343]/5 p-2">
                  <p className="font-mono text-[9px] font-bold uppercase leading-snug tracking-[0.18em] text-[#A34343]">
                    Tear up this letter?
                  </p>
                  <div className="mt-1.5 flex gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        onWithdraw()
                        setConfirming(false)
                      }}
                      className="h-7 rounded-sm border border-[#A34343]/50 bg-[#A34343] px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#EFE7DC] hover:bg-[#8f3838]"
                    >
                      Yes, tear it
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirming(false)}
                      className="h-7 rounded-sm px-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43]/70 hover:text-[#344C43]"
                    >
                      Keep
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirming(true)}
                  className="h-auto px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#A34343] hover:bg-[#A34343]/10"
                >
                  Withdraw
                </Button>
              )
            ) : (
              <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/45">
                {app.status === "accepted" ? "Enrolled — see your Almanac" : "Returned — but the ledger remembers"}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

// ─── Empty pigeonhole ────────────────────────────────────────────────────────

function EmptyPigeonhole({ query, onClear }: { query: string; onClear: () => void }) {
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
        {query
          ? `Nothing filed under “${query}” — try another pigeonhole.`
          : "Nothing filed under this filter — try another pigeonhole."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          onClick={onClear}
          className="h-11 rounded-sm border border-[#344C43]/40 bg-[#344C43] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC] shadow-[4px_4px_0_#B87959] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#B87959]"
        >
          Clear the filters
        </Button>
        <Link
          href="/tuitions"
          className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#344C43]/30 bg-transparent px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-all hover:border-[#B87959] hover:text-[#B87959]"
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
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | AppStatus>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [expandedRef, setExpandedRef] = useState<string | null>(null)
  const [withdrawnRefs, setWithdrawnRefs] = useState<Set<string>>(new Set())

  const counts = useMemo(
    () => ({
      all: APPLICATIONS.length,
      pending: APPLICATIONS.filter((a) => a.status === "pending").length,
      accepted: APPLICATIONS.filter((a) => a.status === "accepted").length,
      declined: APPLICATIONS.filter((a) => a.status === "declined").length,
    }),
    []
  )

  const visible = useMemo(() => {
    let list = APPLICATIONS.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [a.title, a.subject, a.tutor, a.ref, a.place]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    switch (sort) {
      case "oldest":
        list = [...list].sort((a, b) => a.appliedSort - b.appliedSort)
        break
      case "feeAsc":
        list = [...list].sort((a, b) => a.fee - b.fee)
        break
      case "feeDesc":
        list = [...list].sort((a, b) => b.fee - a.fee)
        break
      default:
        list = [...list].sort((a, b) => b.appliedSort - a.appliedSort)
    }
    return list
  }, [query, filter, sort])

  const toggleWithdraw = (ref: string) =>
    setWithdrawnRefs((prev) => {
      const next = new Set(prev)
      if (next.has(ref)) next.delete(ref)
      else next.add(ref)
      return next
    })

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
                  { key: "declined", n: counts.declined, label: "Declined", tone: "text-[#344C43]/55" },
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
                6 letters sent · 2 yeses · Avg. reply 4.2 days
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
          {visible.length} {visible.length === 1 ? "letter" : "letters"} on the table
          {filter !== "all" && ` · filed under ${filter}`}
        </p>

        {visible.length === 0 ? (
          <div className="mt-3">
            <EmptyPigeonhole query={query.trim()} onClear={() => { setQuery(""); setFilter("all") }} />
          </div>
        ) : (
          <ol className="mt-3 space-y-3">
            {visible.map((app) => (
              <li key={app.ref}>
                <Envelope
                  app={app}
                  expanded={expandedRef === app.ref}
                  onToggle={() => setExpandedRef((cur) => (cur === app.ref ? null : app.ref))}
                  withdrawn={withdrawnRefs.has(app.ref)}
                  onWithdraw={() => toggleWithdraw(app.ref)}
                  onRestore={() => toggleWithdraw(app.ref)}
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
