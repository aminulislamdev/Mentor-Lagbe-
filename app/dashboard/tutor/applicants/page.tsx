"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Check,
  CheckCircle2,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Search,
  CalendarClock,
  X,
  XCircle,
} from "lucide-react"
import { apiFetch, ApiError } from "@/lib/api"
import { useApi } from "@/lib/hooks/use-api"
import { Kpi, StudioBoard, StudioNotice, studioStyles } from "@/components/dashboard/studio"
import { Colophon, EmptyState, Monogram, StatusChip } from "@/components/dashboard/shared"
import { formatDate, initials } from "@/lib/adapters"
import type { Application } from "@/lib/api-types"

type StatusFilter = "all" | "pending" | "accepted" | "rejected"

const STATUS_TONE = {
  pending: "terracotta",
  accepted: "sage",
  rejected: "rose",
} as const

const FILTER_BUTTON =
  "px-3 py-1.5 border-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors capitalize"

export default function ApplicantsPage() {
  const router = useRouter()
  const applicants = useApi<Application[]>("/api/applications/tutor")

  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [tuitionFilter, setTuitionFilter] = React.useState("all")
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const applications = React.useMemo(() => applicants.data ?? [], [applicants.data])

  // Tuition titles that actually have applicants, for the filter dropdown.
  const tuitionTitles = React.useMemo(
    () => Array.from(new Set(applications.map((application) => application.tuitionTitle))),
    [applications]
  )

  const visible = React.useMemo(() => {
    const term = query.trim().toLowerCase()

    return applications.filter((application) => {
      if (status !== "all" && application.status !== status) return false
      if (tuitionFilter !== "all" && application.tuitionTitle !== tuitionFilter) return false
      if (!term) return true
      return (
        application.studentName.toLowerCase().includes(term) ||
        application.studentEmail.toLowerCase().includes(term) ||
        application.tuitionTitle.toLowerCase().includes(term)
      )
    })
  }, [applications, status, tuitionFilter, query])

  const pendingCount = applications.filter((application) => application.status === "pending").length
  const acceptedCount = applications.filter((application) => application.status === "accepted").length
  const rejectedCount = applications.filter((application) => application.status === "rejected").length

  const decide = async (application: Application, next: "accepted" | "rejected") => {
    setBusyId(application._id)

    try {
      await apiFetch(`/api/applications/${application._id}/status`, {
        method: "PATCH",
        body: { status: next },
      })
      toast.success(
        next === "accepted"
          ? `${application.studentName} accepted`
          : `${application.studentName} rejected`
      )
      applicants.refetch()
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not save the decision")
    } finally {
      setBusyId(null)
    }
  }

  const loading = applicants.loading && !applicants.data

  return (
    <div className="studio-root min-h-screen bg-[#F2EDDF] text-[#1E3A2F]">
      <style>{studioStyles}</style>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b-2 border-[#344C43] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#B87959]">
              [ The Mentor&rsquo;s Register — Applications ]
            </p>
            <h1 className="studio-serif mt-2 text-3xl font-black tracking-tight text-[#344C43] sm:text-4xl">
              Decide who <span className="italic text-[#668B78]">joins the batch</span>.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#344C43]/70">
              Every student who applied to one of your listings, with their contact details and
              preferred schedule. Accept or reject, and they see it immediately.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex h-11 shrink-0 items-center gap-2 border border-[#344C43]/40 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-colors hover:bg-[#344C43]/5"
          >
            View listings
          </Link>
        </div>

        {applicants.error && (
          <div className="mt-5">
            <StudioNotice
              tone="error"
              title="The applicant ledger could not be loaded"
              action={
                <button
                  type="button"
                  onClick={applicants.refetch}
                  className="inline-flex h-9 items-center gap-2 border border-[#A34343] bg-[#A34343] px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCFAF2]"
                >
                  <RefreshCw aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  Retry
                </button>
              }
            >
              {applicants.error}
            </StudioNotice>
          </div>
        )}

        {/* KPI rail */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total Applicants" value={applications.length} hint="Across all your batches" Icon={Inbox} />
          <Kpi label="Awaiting Decision" value={pendingCount} hint="Pending your review" Icon={CalendarClock} />
          <Kpi label="Accepted" value={acceptedCount} hint="Confirmed students" Icon={CheckCircle2} />
          <Kpi label="Rejected" value={rejectedCount} hint="Declined applications" Icon={XCircle} />
        </div>

        {/* Filters + list */}
        <div className="mt-8">
          <StudioBoard tab="The Applicant Ledger" note={`${visible.length} shown`}>
            <div className="flex flex-col gap-3 border-b border-[#344C43]/20 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#344C43]/45" strokeWidth={2} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search student, email or batch…"
                  className="w-full border border-[#344C43]/30 bg-[#FCFAF2] py-2 pl-9 pr-3 text-xs text-[#1E3A2F] outline-none transition-colors placeholder:text-[#344C43]/40 focus:border-[#B87959] focus:ring-2 focus:ring-[#B87959]/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex border border-[#344C43]/30">
                  {(["all", "pending", "accepted", "rejected"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatus(value)}
                      className={`${FILTER_BUTTON} ${
                        status === value
                          ? "bg-[#344C43] text-[#EFE7DC]"
                          : "bg-[#FCFAF2] text-[#344C43]/70 hover:bg-[#344C43]/5"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <select
                  value={tuitionFilter}
                  onChange={(event) => setTuitionFilter(event.target.value)}
                  className="max-w-[15rem] border border-[#344C43]/30 bg-[#FCFAF2] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#344C43] outline-none focus:border-[#B87959]"
                >
                  <option value="all">All batches</option>
                  {tuitionTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 pt-4" aria-hidden="true">
                {[0, 1, 2].map((key) => (
                  <div key={key} className="h-24 animate-pulse border border-[#344C43]/15 bg-[#344C43]/5" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="pt-4">
                <EmptyState
                  Icon={Inbox}
                  title={applications.length === 0 ? "No applications yet" : "Nothing matches those filters"}
                  description={
                    applications.length === 0
                      ? "When a student applies to one of your batches, their request lands here."
                      : "Clear the filters to see every applicant again."
                  }
                  actionLabel={applications.length === 0 ? "View my listings" : "Clear filters"}
                  onAction={() => {
                    if (applications.length === 0) {
                      router.push("/dashboard/tutor/my-tuitions")
                      return
                    }
                    setQuery("")
                    setStatus("all")
                    setTuitionFilter("all")
                  }}
                />
              </div>
            ) : (
              <ul className="divide-y divide-[#344C43]/15">
                {visible.map((application) => {
                  const busy = busyId === application._id

                  return (
                    <li key={application._id} className="py-4 first:pt-2">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <Monogram initials={initials(application.studentName)} size="lg" />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-[#1E3A2F]">{application.studentName}</p>
                              <StatusChip tone={STATUS_TONE[application.status]}>
                                {application.status}
                              </StatusChip>
                              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/45">
                                applied {formatDate(application.appliedAt)}
                              </span>
                            </div>

                            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#344C43]/60">
                              {application.tuitionTitle}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-[#344C43]/70">
                              <span className="inline-flex items-center gap-1.5">
                                <Mail aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} />
                                {application.studentEmail}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Phone aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} />
                                {application.studentPhone}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarClock aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} />
                                {application.preferredSchedule}
                              </span>
                            </div>

                            {application.studentNote && (
                              <p className="mt-2 max-w-2xl border-l-2 border-[#B87959]/40 pl-3 text-xs leading-relaxed text-[#344C43]/75">
                                {application.studentNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 lg:pl-4">
                          <button
                            type="button"
                            onClick={() => decide(application, "accepted")}
                            disabled={busy || application.status === "accepted"}
                            className="inline-flex h-9 items-center gap-1.5 border border-[#668B78]/60 bg-[#668B78]/15 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#4A695C] transition-colors hover:bg-[#668B78]/25 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() => decide(application, "rejected")}
                            disabled={busy || application.status === "rejected"}
                            className="inline-flex h-9 items-center gap-1.5 border border-[#A34343]/50 bg-[#A34343]/10 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#A34343] transition-colors hover:bg-[#A34343]/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <X aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </StudioBoard>
        </div>

        <Colophon backHref="/dashboard/tutor" backLabel="Back to the studio">
          <span>{visible.length} of {applications.length} applications shown</span>
        </Colophon>
      </div>
    </div>
  )
}
