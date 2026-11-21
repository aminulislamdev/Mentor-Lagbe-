"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Crown,
  Inbox,
  MapPin,
  Plus,
  Users,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useApi } from "@/lib/hooks/use-api"
import { Kpi, StudioBoard, studioStyles } from "@/components/dashboard/studio"
import { Colophon, EmptyState, Monogram, StatusChip } from "@/components/dashboard/shared"
import { formatDate, formatFee, initials, weeklyPace } from "@/lib/adapters"
import type { Application, Tuition, TutorStats } from "@/lib/api-types"

// ─── Page ────────────────────────────────────────────────────────────────────

const APPROVAL_TONE = {
  approved: "sage",
  pending: "terracotta",
  rejected: "rose",
} as const

const APPLICATION_TONE = {
  pending: "terracotta",
  accepted: "sage",
  rejected: "rose",
} as const

export default function TutorDashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const stats = useApi<TutorStats>("/api/dashboard/stats")
  const mine = useApi<Tuition[]>("/api/tuitions/mine")
  const applicants = useApi<Application[]>("/api/applications/tutor")

  const listings = mine.data ?? []
  const applications = applicants.data ?? []
  const summary = stats.data

  const loading = stats.loading || mine.loading || applicants.loading
  const error = stats.error ?? mine.error ?? applicants.error

  const firstName = session?.user?.name?.split(" ")[0] ?? "Mentor"
  const isPro = summary?.plan === "pro"
  const subjects = Array.from(new Set(listings.map((listing) => listing.subject)))

  const pendingApplications = applications.filter((application) => application.status === "pending").length
  const mix = [
    { label: "Accepted", count: applications.filter((a) => a.status === "accepted").length, tone: "#668B78" },
    { label: "Pending", count: pendingApplications, tone: "#B87959" },
    { label: "Rejected", count: applications.filter((a) => a.status === "rejected").length, tone: "#A34343" },
  ]
  const mixTotal = applications.length || 1

  const retryAll = () => {
    stats.refetch()
    mine.refetch()
    applicants.refetch()
  }

  return (
    <div className="studio-root min-h-screen bg-[#F2EDDF] text-[#1E3A2F]">
      <style>{studioStyles}</style>

      {/* ══ CHALKBOARD PLATE — studio masthead ══════════════════════════ */}
      <div
        className="relative overflow-hidden border-b-4 border-[#B87959] bg-[#1E3A2F] text-[#F2EDDF]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 78% -10%, rgba(201,139,109,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at -5% 110%, rgba(102,139,120,0.16) 0%, transparent 55%), radial-gradient(rgba(242,237,223,0.05) 1px, transparent 1.4px)",
          backgroundSize: "auto, auto, 24px 24px",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#F2EDDF]/12" />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
            {/* Identity block */}
            <div className="lg:col-span-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#C98B6D]">
                [ The Mentor&rsquo;s Register — Studio № 3 ]
              </p>
              <h1
                className="studio-rise studio-serif mt-3 font-black leading-[0.95] tracking-[-0.03em]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.4rem, 5.8vw, 4.5rem)" } as React.CSSProperties}
              >
                <span className="text-[#F2EDDF]">Back at the board,</span>
                <span className="relative mt-1 block w-fit italic text-[#9DBFA9]">
                  {firstName}.
                  <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-[72%] overflow-visible text-[#C98B6D]" fill="none">
                    <path d="M2 8C36 2.5 68 2.2 102 7C136 11.8 166 8.4 198 4.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6.5" opacity="0.9" />
                  </svg>
                </span>
              </h1>

              {/* Chip row — every value comes from the API */}
              <div className="studio-rise mt-5 flex flex-wrap items-center gap-2.5" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                <span className="inline-flex items-center gap-1.5 border border-[#7AA890]/45 bg-[#668B78]/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#9DBFA9]">
                  <BadgeCheck aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2} />
                  Verified Mentor
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#C98B6D]/45 bg-[#B87959]/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#C98B6D]">
                  <Crown aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  {isPro ? "Tutor Pro — Active" : "Free Plan"}
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#F2EDDF]/20 bg-[#F2EDDF]/5 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F2EDDF]/70">
                  <BookOpenCheck aria-hidden="true" className="size-3.5 text-[#9DBFA9]" strokeWidth={2} />
                  {subjects.length > 0 ? subjects.slice(0, 2).join(" · ") : "No listings yet"}
                  {listings.length > 0 ? ` · ${listings.length} ${listings.length === 1 ? "Batch" : "Batches"}` : ""}
                </span>
              </div>

              <p className="studio-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/70" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
                {loading
                  ? "Opening your register…"
                  : `${summary?.activeTuitions ?? 0} active ${summary?.activeTuitions === 1 ? "listing" : "listings"} on the board, ${pendingApplications} ${pendingApplications === 1 ? "application" : "applications"} waiting for your decision. Here is the studio.`}
              </p>

              {/* Quick actions */}
              <div className="studio-rise mt-5 flex flex-wrap items-center gap-3" style={{ "--rise-delay": "0.26s" } as React.CSSProperties}>
                <Link
                  href="/dashboard/tutor/post-tuition"
                  className="studio-cta-glow group inline-flex h-12 items-center gap-2.5 rounded-sm border border-[#E0A57E]/60 bg-[#B87959] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#1E3A2F] transition-all hover:-translate-y-0.5 hover:bg-[#C98B6D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0A57E]"
                >
                  <Plus aria-hidden="true" className="size-4.5 transition-transform duration-200 group-hover:rotate-90" strokeWidth={2.5} />
                  Post a New Tuition
                </Link>
                <Link
                  href="/dashboard/tutor/applicants"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-sm border border-[#F2EDDF]/25 bg-transparent px-5 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#F2EDDF] transition-all hover:border-[#C98B6D] hover:text-[#C98B6D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D]"
                >
                  <Inbox aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Review Applicants
                  {pendingApplications > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#C98B6D] font-mono text-[9px] font-bold text-[#1E3A2F]">
                      {pendingApplications}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Membership card — reflects the real plan */}
            <div className="lg:col-span-5">
              <figure
                className="studio-rise relative rotate-[-0.8deg] border border-[#C98B6D]/55 bg-[#243630]/80 p-5 shadow-[10px_12px_0_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform duration-300 hover:rotate-0 sm:p-6"
                style={{ "--rise-delay": "0.3s", backgroundImage: "linear-gradient(155deg, rgba(201,139,109,0.14) 0%, transparent 45%)" } as React.CSSProperties}
                aria-label={isPro ? "Tutor Pro membership — active" : "Free plan"}
              >
                <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[22px] leading-none text-[#C98B6D]/70">✦</span>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-[#C98B6D]">
                    <Crown aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    {isPro ? "Tutor Pro" : "Free Plan"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#7AA890]/45 bg-[#668B78]/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.26em] text-[#9DBFA9]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7AA890]" />
                    {isPro ? "Active" : "Limited"}
                  </span>
                </div>

                <p className="studio-serif mt-4 text-3xl font-black leading-none tracking-tight text-[#F2EDDF]">
                  {isPro ? "Unlimited" : `${summary?.activeTuitions ?? 0} / 2`}
                  <span className="text-base font-bold text-[#F2EDDF]/55">
                    {isPro ? " listings" : " active listings"}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-[#F2EDDF]/45">
                  {isPro ? "Mentor’s Guild Membership" : "Free plan allows two active batches"}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[#F2EDDF]/12 pt-4 font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-[#F2EDDF]/70">
                  {(isPro
                    ? ["Unlimited batch listings", "Verified mentor seal", "Applicant ledger"]
                    : ["Two active listings", "Verified mentor seal", "Upgrade for unlimited batches"]
                  ).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0 text-[#C98B6D]" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2EDDF]/12 pt-3">
                  <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#F2EDDF]/45">
                    Joined {formatDate(session?.user?.createdAt as string | undefined)}
                  </span>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#C98B6D] transition-colors hover:text-[#E0A57E]"
                  >
                    {isPro ? "Manage" : "Upgrade"}
                    <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex flex-col items-start justify-between gap-3 border border-[#A34343]/35 bg-[#A34343]/8 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#A34343]">
                The register could not be loaded
              </p>
              <p className="mt-1 text-xs text-[#344C43]/70">{error}</p>
            </div>
            <button
              type="button"
              onClick={retryAll}
              className="inline-flex h-10 items-center gap-2 border border-[#344C43] bg-[#344C43] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2EDDF] transition-colors hover:bg-[#2A3E36]"
            >
              <RefreshCw aria-hidden="true" className="size-3.5" strokeWidth={2} />
              Retry
            </button>
          </div>
        )}

        {/* KPI rail */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Total Listings"
            value={loading && !summary ? "—" : (summary?.totalTuitions ?? 0)}
            hint="Every batch you have posted"
            Icon={FileText}
          />
          <Kpi
            label="Active Battches"
            value={loading && !summary ? "—" : (summary?.activeTuitions ?? 0)}
            hint="Open for applications"
            Icon={BookOpenCheck}
          />
          <Kpi
            label="Applicants"
            value={loading && !summary ? "—" : (summary?.totalApplicants ?? 0)}
            hint="Across all your batches"
            Icon={Users}
          />
          <Kpi
            label="Awaiting Decision"
            value={loading && !applicants.data ? "—" : pendingApplications}
            hint="Pending applications"
            Icon={Inbox}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Listings */}
          <div className="lg:col-span-7">
            <StudioBoard tab="The Listing Register" note={`${listings.length} total`}>
              {mine.loading && !mine.data ? (
                <div className="space-y-3" aria-hidden="true">
                  {[0, 1, 2].map((key) => (
                    <div key={key} className="h-16 animate-pulse border border-[#344C43]/15 bg-[#344C43]/5" />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <EmptyState
                  Icon={FileText}
                  title="No batches on the board yet"
                  description="Post your first tuition and it will appear here once an admin approves it."
                  actionLabel="Post a tuition"
                  onAction={() => router.push("/dashboard/tutor/post-tuition")}
                />
              ) : (
                <ul className="divide-y divide-[#344C43]/15">
                  {listings.slice(0, 4).map((listing) => (
                    <li key={listing._id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#1E3A2F]">{listing.title}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#344C43]/60">
                          <span>{listing.subject}</span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays aria-hidden="true" className="size-3" strokeWidth={2} />
                            {weeklyPace(listing.daysPerWeek)}
                          </span>
                          <span className="inline-flex items-center gap-1 truncate">
                            <MapPin aria-hidden="true" className="size-3" strokeWidth={2} />
                            {listing.location}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <StatusChip tone={APPROVAL_TONE[listing.approvalStatus]}>
                          {listing.approvalStatus}
                        </StatusChip>
                        <span className="font-mono text-[11px] font-bold text-[#344C43]">
                          {formatFee(listing.monthlyFee)} / mo
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/45">
                          {listing.isActive ? "Active" : "Closed"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 border-t-2 border-[#344C43] pt-3">
                <Link
                  href="/dashboard/tutor/my-tuitions"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-colors hover:text-[#B87959]"
                >
                  Open the full register
                  <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </StudioBoard>
          </div>

          {/* Applicants + mix */}
          <div className="space-y-8 lg:col-span-5">
            <StudioBoard tab="Applicant Ledger" note={`${applications.length} total`}>
              {applicants.loading && !applicants.data ? (
                <div className="space-y-3" aria-hidden="true">
                  {[0, 1, 2].map((key) => (
                    <div key={key} className="h-12 animate-pulse border border-[#344C43]/15 bg-[#344C43]/5" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <EmptyState
                  Icon={Inbox}
                  title="No applications yet"
                  description="Once a student applies to one of your batches, their request appears here."
                  actionLabel="Back to listings"
                  onAction={() => router.push("/dashboard/tutor/my-tuitions")}
                />
              ) : (
                <ul className="divide-y divide-[#344C43]/15">
                  {applications.slice(0, 4).map((application) => (
                    <li key={application._id} className="flex items-center gap-3 py-3 first:pt-0">
                      <Monogram initials={initials(application.studentName)} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#1E3A2F]">
                          {application.studentName}
                        </p>
                        <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-[#344C43]/55">
                          {application.tuitionTitle}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusChip tone={APPLICATION_TONE[application.status]}>
                          {application.status}
                        </StatusChip>
                        <span className="font-mono text-[9px] text-[#344C43]/45">
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 border-t-2 border-[#344C43] pt-3">
                <Link
                  href="/dashboard/tutor/applicants"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-colors hover:text-[#B87959]"
                >
                  Manage applicants
                  <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </StudioBoard>

            <StudioBoard tab="Application Mix" note="live counts">
              <ul className="space-y-3">
                {mix.map((row) => (
                  <li key={row.label}>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#344C43]/70">
                      <span>{row.label}</span>
                      <span className="font-bold text-[#344C43]">{row.count}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full border border-[#344C43]/20 bg-[#344C43]/5">
                      <div
                        className="h-full"
                        style={{
                          width: `${Math.round((row.count / mixTotal) * 100)}%`,
                          backgroundColor: row.tone,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-[#344C43]/20 pt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/50">
                Application trends over time arrive with the payments and analytics phase.
              </p>
            </StudioBoard>
          </div>
        </div>

        <Colophon backHref="/" backLabel="Back to the studio index">
          <span>Mentor&rsquo;s Register · Studio № 3</span>
          <span>{applications.length} applications on file</span>
        </Colophon>
      </div>
    </div>
  )
}
