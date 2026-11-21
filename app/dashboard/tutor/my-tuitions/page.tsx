"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  BookOpenCheck,
  CheckCircle2,
  CircleSlash,
  FileText,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { apiFetch, ApiError } from "@/lib/api"
import { useApi } from "@/lib/hooks/use-api"
import { Kpi, StudioBoard, StudioNotice, studioStyles } from "@/components/dashboard/studio"
import { Colophon, EmptyState, StatusChip } from "@/components/dashboard/shared"
import { formatDate, formatFee, weeklyPace } from "@/lib/adapters"
import type { Tuition, TutorStats } from "@/lib/api-types"

type ApprovalFilter = "all" | "pending" | "approved" | "rejected"
type StateFilter = "all" | "active" | "closed"
type SortKey = "newest" | "fee_asc" | "fee_desc"

const APPROVAL_TONE = {
  approved: "sage",
  pending: "terracotta",
  rejected: "rose",
} as const

const FILTER_BUTTON =
  "px-3 py-1.5 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
const FIELD =
  "w-full border border-[#344C43]/30 bg-[#FCFAF2] px-3 py-2 text-sm text-[#1E3A2F] outline-none transition-colors focus:border-[#B87959] focus:ring-2 focus:ring-[#B87959]/20"

// ─── Edit dialog ─────────────────────────────────────────────────────────────

function EditDialog({
  tuition,
  onClose,
  onSaved,
}: {
  tuition: Tuition
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = React.useState({
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: String(tuition.monthlyFee),
    daysPerWeek: String(tuition.daysPerWeek),
    description: tuition.description,
  })
  const [saving, setSaving] = React.useState(false)

  const set = (field: keyof typeof form) => (value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }))

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      await apiFetch(`/api/tuitions/${tuition._id}`, {
        method: "PATCH",
        body: {
          title: form.title,
          subject: form.subject,
          classLevel: form.classLevel,
          mode: form.mode,
          location: form.location,
          monthlyFee: Number(form.monthlyFee),
          daysPerWeek: Number(form.daysPerWeek),
          description: form.description,
        },
      })
      toast.success("Listing updated")
      onSaved()
      onClose()
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not update the listing")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-listing-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#16241F]/70 p-4 backdrop-blur-sm sm:items-center"
    >
      <form
        onSubmit={save}
        className="my-8 w-full max-w-2xl border border-[#344C43]/30 bg-[#F2EDDF] shadow-[8px_10px_0_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#344C43]/25 bg-[#344C43] px-4 py-2.5">
          <h2 id="edit-listing-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#EFE7DC]">
            Amend the listing
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#EFE7DC]/70 transition-colors hover:text-[#EFE7DC]"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Title</span>
            <input className={`${FIELD} mt-1`} value={form.title} onChange={(e) => set("title")(e.target.value)} required autoFocus />
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Subject</span>
            <input className={`${FIELD} mt-1`} value={form.subject} onChange={(e) => set("subject")(e.target.value)} required />
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Class level</span>
            <input className={`${FIELD} mt-1`} value={form.classLevel} onChange={(e) => set("classLevel")(e.target.value)} required />
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Mode</span>
            <select
              className={`${FIELD} mt-1`}
              value={form.mode}
              onChange={(e) => set("mode")(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Location</span>
            <input className={`${FIELD} mt-1`} value={form.location} onChange={(e) => set("location")(e.target.value)} required />
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Monthly fee (৳)</span>
            <input
              type="number"
              min={0}
              step={100}
              className={`${FIELD} mt-1`}
              value={form.monthlyFee}
              onChange={(e) => set("monthlyFee")(e.target.value)}
              required
            />
          </label>

          <label>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Days per week</span>
            <input
              type="number"
              min={1}
              max={7}
              className={`${FIELD} mt-1`}
              value={form.daysPerWeek}
              onChange={(e) => set("daysPerWeek")(e.target.value)}
              required
            />
          </label>

          <label className="sm:col-span-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60">Description</span>
            <textarea
              rows={4}
              className={`${FIELD} mt-1 resize-none`}
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              required
            />
          </label>

          <p className="sm:col-span-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/50">
            Changes keep the current approval decision. A rejected listing needs an admin to approve it again.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#344C43]/25 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 border border-[#344C43]/40 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#344C43] transition-colors hover:bg-[#344C43]/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-10 border border-[#344C43] bg-[#344C43] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2EDDF] transition-colors hover:bg-[#2A3E36] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Delete dialog ───────────────────────────────────────────────────────────

function DeleteDialog({
  tuition,
  onClose,
  onDeleted,
}: {
  tuition: Tuition
  onClose: () => void
  onDeleted: () => void
}) {
  const [saving, setSaving] = React.useState(false)

  const remove = async () => {
    setSaving(true)
    try {
      await apiFetch(`/api/tuitions/${tuition._id}`, { method: "DELETE" })
      toast.success("Listing deleted")
      onDeleted()
      onClose()
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not delete the listing")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-listing-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#16241F]/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md border border-[#A34343]/40 bg-[#F2EDDF] shadow-[8px_10px_0_rgba(0,0,0,0.25)]">
        <div className="border-b border-[#A34343]/30 bg-[#A34343] px-4 py-2.5">
          <h2 id="delete-listing-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#FCFAF2]">
            Delete listing
          </h2>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-[#344C43]">
            <strong className="font-bold">{tuition.title}</strong> will be removed permanently.
            Applications already submitted keep their copy, but no new student can find this batch.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 border border-[#344C43]/40 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#344C43] transition-colors hover:bg-[#344C43]/5"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="h-10 border border-[#A34343] bg-[#A34343] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCFAF2] transition-colors hover:bg-[#8C3838] disabled:opacity-50"
            >
              {saving ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MyTuitionsPage() {
  const router = useRouter()
  const mine = useApi<Tuition[]>("/api/tuitions/mine")
  const stats = useApi<TutorStats>("/api/dashboard/stats")

  const [query, setQuery] = React.useState("")
  const [approval, setApproval] = React.useState<ApprovalFilter>("all")
  const [state, setState] = React.useState<StateFilter>("all")
  const [sort, setSort] = React.useState<SortKey>("newest")
  const [editing, setEditing] = React.useState<Tuition | null>(null)
  const [deleting, setDeleting] = React.useState<Tuition | null>(null)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const listings = React.useMemo(() => mine.data ?? [], [mine.data])
  const isPro = stats.data?.plan === "pro"
  const activeCount = listings.filter((listing) => listing.isActive).length
  const atFreeLimit = !isPro && activeCount >= 2

  const visible = React.useMemo(() => {
    const term = query.trim().toLowerCase()

    const filtered = listings.filter((listing) => {
      if (approval !== "all" && listing.approvalStatus !== approval) return false
      if (state === "active" && !listing.isActive) return false
      if (state === "closed" && listing.isActive) return false
      if (!term) return true
      return (
        listing.title.toLowerCase().includes(term) ||
        listing.subject.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term)
      )
    })

    return filtered.sort((a, b) => {
      if (sort === "fee_asc") return a.monthlyFee - b.monthlyFee
      if (sort === "fee_desc") return b.monthlyFee - a.monthlyFee
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [listings, approval, state, sort, query])

  const toggleActive = async (tuition: Tuition) => {
    setBusyId(tuition._id)
    try {
      await apiFetch(`/api/tuitions/${tuition._id}`, {
        method: "PATCH",
        body: { isActive: !tuition.isActive },
      })
      toast.success(tuition.isActive ? "Listing closed" : "Listing reopened")
      mine.refetch()
      stats.refetch()
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "Could not change the listing")
    } finally {
      setBusyId(null)
    }
  }

  const loading = mine.loading && !mine.data

  return (
    <div className="studio-root min-h-screen bg-[#F2EDDF] text-[#1E3A2F]">
      <style>{studioStyles}</style>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b-2 border-[#344C43] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#B87959]">
              [ The Mentor&rsquo;s Register — Listings ]
            </p>
            <h1 className="studio-serif mt-2 text-3xl font-black tracking-tight text-[#344C43] sm:text-4xl">
              Your batches, <span className="italic text-[#668B78]">on the record</span>.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#344C43]/70">
              Every listing you have posted, with its board decision and whether it is open for
              applications.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex h-11 shrink-0 items-center gap-2 border border-[#B87959]/60 bg-[#B87959] px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#1E3A2F] transition-colors hover:bg-[#C98B6D]"
          >
            <Plus aria-hidden="true" className="size-4" strokeWidth={2.5} />
            Post a Tuition
          </Link>
        </div>

        {/* Quota + errors */}
        <div className="mt-5 space-y-3">
          {atFreeLimit && (
            <StudioNotice
              tone="warning"
              title="Free plan limit reached"
              action={
                <Link
                  href="/pricing"
                  className="inline-flex h-9 items-center border border-[#B87959]/60 bg-[#B87959]/15 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#B87959] transition-colors hover:bg-[#B87959]/25"
                >
                  Upgrade
                </Link>
              }
            >
              Two active listings are the free-plan maximum. Close one or upgrade for unlimited batches.
            </StudioNotice>
          )}

          {mine.error && (
            <StudioNotice
              tone="error"
              title="The register could not be loaded"
              action={
                <button
                  type="button"
                  onClick={mine.refetch}
                  className="inline-flex h-9 items-center gap-2 border border-[#A34343] bg-[#A34343] px-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#FCFAF2]"
                >
                  <RefreshCw aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  Retry
                </button>
              }
            >
              {mine.error}
            </StudioNotice>
          )}
        </div>

        {/* KPI rail */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total Listings" value={listings.length} hint="Including drafts and closed" Icon={FileText} />
          <Kpi label="Active" value={activeCount} hint="Open for applications" Icon={BookOpenCheck} />
          <Kpi
            label="Approved"
            value={listings.filter((listing) => listing.approvalStatus === "approved").length}
            hint="Cleared by the board"
            Icon={CheckCircle2}
          />
          <Kpi
            label="Awaiting Review"
            value={listings.filter((listing) => listing.approvalStatus === "pending").length}
            hint="Pending board decision"
            Icon={CircleSlash}
          />
        </div>

        {/* Filters + list */}
        <div className="mt-8">
          <StudioBoard tab="The Listing Register" note={`${visible.length} shown`}>
            <div className="flex flex-col gap-3 border-b border-[#344C43]/20 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#344C43]/45" strokeWidth={2} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, subject, location…"
                  className="w-full border border-[#344C43]/30 bg-[#FCFAF2] py-2 pl-9 pr-3 text-xs text-[#1E3A2F] outline-none transition-colors placeholder:text-[#344C43]/40 focus:border-[#B87959] focus:ring-2 focus:ring-[#B87959]/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex border border-[#344C43]/30">
                  {(["all", "pending", "approved", "rejected"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setApproval(value)}
                      className={`${FILTER_BUTTON} border-0 capitalize ${
                        approval === value
                          ? "bg-[#344C43] text-[#EFE7DC]"
                          : "bg-[#FCFAF2] text-[#344C43]/70 hover:bg-[#344C43]/5"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <div className="flex border border-[#344C43]/30">
                  {(["all", "active", "closed"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setState(value)}
                      className={`${FILTER_BUTTON} border-0 capitalize ${
                        state === value
                          ? "bg-[#344C43] text-[#EFE7DC]"
                          : "bg-[#FCFAF2] text-[#344C43]/70 hover:bg-[#344C43]/5"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="border border-[#344C43]/30 bg-[#FCFAF2] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#344C43] outline-none focus:border-[#B87959]"
                >
                  <option value="newest">Newest</option>
                  <option value="fee_asc">Fee ↑</option>
                  <option value="fee_desc">Fee ↓</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 pt-4" aria-hidden="true">
                {[0, 1, 2].map((key) => (
                  <div key={key} className="h-20 animate-pulse border border-[#344C43]/15 bg-[#344C43]/5" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="pt-4">
                <EmptyState
                  Icon={FileText}
                  title={listings.length === 0 ? "No batches on the board yet" : "Nothing matches those filters"}
                  description={
                    listings.length === 0
                      ? "Post your first tuition and it appears here immediately, pending board approval."
                      : "Clear the filters to see every listing again."
                  }
                  actionLabel={listings.length === 0 ? "Post a tuition" : "Clear filters"}
                  onAction={() => {
                    if (listings.length === 0) {
                      router.push("/dashboard/tutor/post-tuition")
                      return
                    }
                    setQuery("")
                    setApproval("all")
                    setState("all")
                  }}
                />
              </div>
            ) : (
              <ul className="divide-y divide-[#344C43]/15">
                {visible.map((tuition) => (
                  <li key={tuition._id} className="flex flex-col gap-3 py-4 first:pt-2 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusChip tone={APPROVAL_TONE[tuition.approvalStatus]}>
                          {tuition.approvalStatus}
                        </StatusChip>
                        <StatusChip tone={tuition.isActive ? "sage" : "pine"}>
                          {tuition.isActive ? "Open" : "Closed"}
                        </StatusChip>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/45">
                          {tuition.subject} · {tuition.classLevel} · {tuition.mode}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm font-bold text-[#1E3A2F]">{tuition.title}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#344C43]/55">
                        {weeklyPace(tuition.daysPerWeek)} · {tuition.location} · listed {formatDate(tuition.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#344C43]">
                        {formatFee(tuition.monthlyFee)}
                        <span className="text-[10px] font-normal text-[#344C43]/50"> / mo</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleActive(tuition)}
                        disabled={busyId === tuition._id}
                        className="h-9 border border-[#344C43]/40 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43] transition-colors hover:bg-[#344C43]/5 disabled:opacity-50"
                      >
                        {busyId === tuition._id ? "…" : tuition.isActive ? "Close" : "Reopen"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditing(tuition)}
                        className="inline-flex h-9 items-center gap-1.5 border border-[#344C43]/40 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#344C43] transition-colors hover:bg-[#344C43]/5"
                      >
                        <PencilLine aria-hidden="true" className="size-3.5" strokeWidth={2} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleting(tuition)}
                        className="inline-flex h-9 items-center gap-1.5 border border-[#A34343]/40 px-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#A34343] transition-colors hover:bg-[#A34343]/10"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={2} />
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </StudioBoard>
        </div>

        <Colophon backHref="/dashboard/tutor" backLabel="Back to the studio">
          <span>{visible.length} of {listings.length} listings shown</span>
        </Colophon>
      </div>

      {editing && (
        <EditDialog
          key={editing._id}
          tuition={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            mine.refetch()
            stats.refetch()
          }}
        />
      )}

      {deleting && (
        <DeleteDialog
          key={deleting._id}
          tuition={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            mine.refetch()
            stats.refetch()
          }}
        />
      )}
    </div>
  )
}
