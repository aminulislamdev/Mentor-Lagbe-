"use client"

import { useMemo, useState } from "react"
import Image from "next/image" // ✅ Next.js Image ইমপোর্ট
import { toast } from "sonner"
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  GraduationCap,
  ShieldCheck,
  BadgeCheck,
  KeyRound,
  Inbox,
  BookOpenCheck,
  RefreshCw,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApi } from "@/lib/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { IndexPanel, StatusChip, Colophon } from "@/components/dashboard/shared"
import type { CurrentUser, Role, Plan } from "@/lib/api-types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// ─── User Avatar Component (Next.js Image) ───────────────────────────────────

function UserAvatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null
  name: string
  size?: "sm" | "md" | "lg" | "2xl"
  className?: string
}) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
    "2xl": 64,
  }

  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-xs",
    lg: "size-14 text-sm",
    "2xl": "size-16 text-base",
  }

  const [imgError, setImgError] = useState(false)
  const pixelSize = sizeMap[size]

  // ✅ ১. যদি image URL থাকে এবং কোনো এরর না হয়, তবে Next/Image দেখাবে
  if (src && src.trim() !== "" && !imgError) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-[#10181A]/30",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          width={pixelSize}
          height={pixelSize}
          className="object-cover h-full w-full"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  // ✅ ২. যদি ছবি না থাকে (বা লিংক ভাঙা থাকে), তবে নামের প্রথম ২টি অক্ষর দেখাবে
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-[#10181A]/30 bg-[#F1EDE2] font-mono font-bold text-[#10181A]/60",
        sizeClasses[size],
        className
      )}
    >
      {initials(name)}
    </span>
  )
}

// ─── Role & Plan metadata ────────────────────────────────────────────────────

const ROLE_META: Record<Role, { label: string; tone: "sage" | "terracotta" | "gold"; icon: typeof GraduationCap }> = {
  student: { label: "Student", tone: "sage", icon: GraduationCap },
  tutor: { label: "Tutor", tone: "terracotta", icon: BookOpenCheck },
  admin: { label: "Admin", tone: "gold", icon: ShieldCheck },
}

const ROLE_FILTERS: Array<{ key: "all" | Role; label: string }> = [
  { key: "all", label: "All" },
  { key: "student", label: "Students" },
  { key: "tutor", label: "Tutors" },
  { key: "admin", label: "Admins" },
]

const PLAN_FILTERS: Array<{ key: "all" | Plan; label: string }> = [
  { key: "all", label: "All Plans" },
  { key: "free", label: "Free" },
  { key: "pro", label: "Pro" },
]

type SortKey = "newest" | "oldest"

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
]

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all")
  const [planFilter, setPlanFilter] = useState<"all" | Plan>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [roleDialog, setRoleDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [newRole, setNewRole] = useState<Role>("student")
  const [roleChanging, setRoleChanging] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [roleChangeError, setRoleChangeError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const usersApi = useApi<CurrentUser[]>(`/api/admin/users?search=${encodeURIComponent(searchQuery)}&role=${roleFilter === "all" ? "" : roleFilter}&limit=100`)

  const allUsers = useMemo(() => usersApi.data ?? [], [usersApi.data])
  const loading = usersApi.loading && !usersApi.data
  const error = usersApi.error

  const getUserId = (u: CurrentUser | null | undefined): string => {
    if (!u) return ""
    return u.id || (u as unknown as { _id?: string })._id || ""
  }

  const visibleUsers = useMemo(() => {
    let list = allUsers.filter((u) => {
      if (planFilter !== "all" && u.plan !== planFilter) return false
      return true
    })
    if (sort === "oldest") {
      list = [...list].sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    }
    return list
  }, [allUsers, planFilter, sort])

  const selected = visibleUsers.find((u) => getUserId(u) === selectedId) ?? visibleUsers[0] ?? null

  const stats = useMemo(() => {
    const total = allUsers.length
    const students = allUsers.filter((u) => u.role === "student").length
    const tutors = allUsers.filter((u) => u.role === "tutor").length
    const admins = allUsers.filter((u) => u.role === "admin").length
    const proMembers = allUsers.filter((u) => u.plan === "pro").length
    return { total, students, tutors, admins, proMembers }
  }, [allUsers])

  const roleCounts = useMemo(() => {
    const counts = { all: allUsers.length, student: 0, tutor: 0, admin: 0 }
    for (const u of allUsers) {
      counts[u.role]++
    }
    return counts
  }, [allUsers])

  const planCounts = useMemo(() => {
    const counts = { all: allUsers.length, free: 0, pro: 0 }
    for (const u of allUsers) {
      counts[u.plan]++
    }
    return counts
  }, [allUsers])

  const handleChangeRole = async () => {
    if (!selected) return
    const id = getUserId(selected)
    setRoleChanging(true)
    setRoleChangeError(null)
    try {
      await apiFetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        body: { role: newRole },
      })
      toast.success(`Role updated to ${newRole}`)
      usersApi.refetch()
      setRoleDialog(false)
    } catch (cause) {
      setRoleChangeError(
        cause instanceof Error ? cause.message : "Failed to change role"
      )
    } finally {
      setRoleChanging(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selected) return
    const id = getUserId(selected)
    setDeleting(true)
    setDeleteError(null)
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
      toast.success("User removed successfully")
      setDeleteDialog(false)
      setSelectedId(null)
      usersApi.refetch()
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : "Failed to delete user")
    } finally {
      setDeleting(false)
    }
  }

  const openRoleDialog = () => {
    if (!selected) return
    setNewRole(selected.role)
    setRoleDialog(true)
    setRoleChangeError(null)
  }

  const openDeleteDialog = () => {
    if (!selected) return
    setDeleteDialog(true)
    setDeleteError(null)
  }

  return (
    <div className="terminal-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{`
        .terminal-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
        .terminal-root ::selection { background: #C9A25E; color: #10181A; }
      `}</style>

      {/* ══ MASTHEAD ═══════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]">
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — The Register of Souls ]
              </p>
              <h1 className="terminal-serif mt-3 text-5xl font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF] sm:text-6xl lg:text-7xl">
                People &amp; <span className="italic text-[#C9A25E]">Accounts.</span>
              </h1>
              <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-[#F2EDDF]/72">
                The complete member registry. Search, filter, and review every account on the platform.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="flex items-center justify-end">
                <div className="text-right">
                  <p className="terminal-serif text-6xl font-black leading-none tracking-tight text-[#C9A25E]">
                    {loading ? "—" : stats.total.toLocaleString()}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F2EDDF]/55">
                    Registered Members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STATS BAND ═════════════════════════════════════════════════ */}
      <div className="border-b border-[#D8C9A3]/25 bg-[#10181A]" aria-label="Registry stats">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-[#F2EDDF]/10 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Total Users", value: stats.total.toLocaleString(), tone: "text-[#F2EDDF]" },
            { label: "Students", value: stats.students.toLocaleString(), tone: "text-[#9DBFA9]" },
            { label: "Tutors", value: stats.tutors.toLocaleString(), tone: "text-[#C98B6D]" },
            { label: "Admins", value: stats.admins.toLocaleString(), tone: "text-[#C9A25E]" },
            { label: "Pro Members", value: stats.proMembers.toLocaleString(), tone: "text-[#7A6A35]" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-4 py-4 text-center sm:py-5">
              <p className="font-mono text-xs font-bold uppercase leading-snug tracking-[0.18em] text-[#D8C9A3]/75">
                {s.label}
              </p>
              <p className={`terminal-serif text-3xl font-black leading-none tracking-tight sm:text-4xl ${s.tone}`}>
                {loading ? "—" : s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[1280px] space-y-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        {/* ── Sorting desk ── */}
        <IndexPanel tab="The Sorting Desk" meta={`${visibleUsers.length} visible`}>
          <div className="flex flex-wrap items-center gap-2">
            {/* Role pills */}
            <div role="group" aria-label="Filter by role" className="flex flex-wrap gap-1.5">
              {ROLE_FILTERS.map((f) => {
                const active = roleFilter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => { setRoleFilter(f.key); setSelectedId(null) }}
                    aria-pressed={active}
                    className={cn(
                      "flex h-9 items-center gap-1.5 rounded-sm border px-3 font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all",
                      active
                        ? "border-[#10181A] bg-[#10181A] text-[#D8C9A3]"
                        : "border-[#10181A]/25 text-[#10181A]/65 hover:border-[#10181A]/55 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#C9A25E]" : "text-[#10181A]/40")}>
                      {f.key === "all" ? roleCounts.all : roleCounts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Plan toggle */}
            <div role="group" aria-label="Filter by plan" className="flex gap-1.5">
              {PLAN_FILTERS.map((f) => {
                const active = planFilter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setPlanFilter(f.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex h-9 items-center gap-1.5 rounded-sm border px-3 font-mono text-xs font-bold uppercase tracking-[0.18em] transition-all",
                      active
                        ? "border-[#C9A25E] bg-[#C9A25E]/20 text-[#7A6A35]"
                        : "border-[#10181A]/25 text-[#10181A]/65 hover:border-[#10181A]/55 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#B87959]" : "text-[#10181A]/40")}>
                      {f.key === "all" ? planCounts.all : planCounts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <label htmlFor="registry-search" className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">Search members by name or email</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45"
                strokeWidth={1.75}
              />
              <Input
                id="registry-search"
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedId(null) }}
                placeholder="Search the register…"
                className="h-9 rounded-sm border-[#10181A]/25 bg-[#FCFAF2] pl-9 text-sm placeholder:text-[#10181A]/38 focus:border-[#C9A25E] focus:ring-[#C9A25E]/20"
              />
            </label>

            {/* Sort */}
            <label htmlFor="registry-sort" className="relative shrink-0">
              <span className="sr-only">Sort members</span>
              <ArrowUpDown
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45"
                strokeWidth={1.75}
              />
              <select
                id="registry-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 appearance-none rounded-sm border border-[#10181A]/25 bg-[#FCFAF2] pl-9 pr-8 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#10181A] outline-none transition-all hover:border-[#10181A]/45 focus:border-[#C9A25E] focus:ring-2 focus:ring-[#C9A25E]/20"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/55" strokeWidth={2} />
            </label>
          </div>
        </IndexPanel>

        {/* ── Index + Dossier ── */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
          {/* Left — The Member Index */}
          <IndexPanel tab="The Member Index" meta={`${visibleUsers.length} visible`} className="lg:col-span-7">
            {loading ? (
              <div className="space-y-3" aria-hidden="true">
                {[0, 1, 2, 3].map((k) => (
                  <div key={k} className="h-16 animate-pulse border border-[#10181A]/15 bg-[#10181A]/5" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Inbox aria-hidden="true" className="size-9 text-[#C9A25E]" strokeWidth={1.5} />
                <p className="terminal-serif mt-3 text-xl font-black tracking-tight">The register could not be opened.</p>
                <p className="mt-1 max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">
                  {error}
                </p>
                <Button
                  type="button"
                  onClick={() => usersApi.refetch()}
                  className="mt-3 h-9 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#D8C9A3] hover:bg-[#1E2A24]"
                >
                  <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
                  Retry
                </Button>
              </div>
            ) : visibleUsers.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <Inbox aria-hidden="true" className="size-9 text-[#C9A25E]" strokeWidth={1.5} />
                <p className="terminal-serif mt-3 text-xl font-black tracking-tight">No members match.</p>
                <p className="mt-1 max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">
                  {searchQuery.trim() ? `Nothing in the register under "${searchQuery.trim()}".` : "No members filed under these filters."}
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-[#10181A]/12">
                {visibleUsers.map((member) => {
                  const mId = getUserId(member)
                  const sId = getUserId(selected)
                  const active = mId === sId
                  const meta = ROLE_META[member.role]
                  return (
                    <li key={mId}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(mId)}
                        aria-pressed={active}
                        className={cn(
                          "group flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A]",
                          active
                            ? "border-[#C9A25E] bg-[#C9A25E]/8"
                            : "border-transparent hover:bg-[#FCFAF2]"
                        )}
                      >
                        {/* ✅ Next.js Image ভিত্তিক Avatar */}
                        <UserAvatar
                          src={member.image}
                          name={member.name}
                          size="md"
                          className={cn(
                            active
                              ? "border-[#C9A25E]/70 ring-2 ring-[#C9A25E]/40"
                              : "group-hover:border-[#C9A25E]/50"
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate text-base font-semibold tracking-tight">{member.name}</span>
                            <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-xs uppercase tracking-[0.14em] text-[#10181A]/55">
                            {member.email}
                          </span>
                        </span>
                        
                        <span className="flex shrink-0 flex-row items-center gap-1.5">
                          <StatusChip tone={meta.tone}>{meta.label}</StatusChip>
                          <StatusChip tone={member.plan === "pro" ? "gold" : "pine"}>
                            {member.plan === "pro" ? "PRO" : "FREE"}
                          </StatusChip>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </IndexPanel>

          {/* Right — The Dossier */}
          <div className="lg:col-span-5">
            {selected && (
              <IndexPanel tab="The Dossier" meta={selected.id} className="lg:sticky lg:top-[136px]">
                {/* Identity strip */}
                <div className="flex items-center gap-4 border-b border-[#10181A]/15 pb-4">
                  {/* ✅ Next.js Image ভিত্তিক Avatar */}
                  <UserAvatar
                    src={selected.image}
                    name={selected.name}
                    size="2xl"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-xl font-black leading-tight tracking-tight">{selected.name}</span>
                      <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-[#668B78]" strokeWidth={2} />
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5">
                      <StatusChip tone={ROLE_META[selected.role].tone}>{ROLE_META[selected.role].label}</StatusChip>
                      <StatusChip tone={selected.plan === "pro" ? "gold" : "pine"}>
                        {selected.plan === "pro" ? "PRO MEMBER" : "FREE PLAN"}
                      </StatusChip>
                    </span>
                  </span>
                </div>

                {/* Ledger rows */}
                <dl className="mt-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-4 border-b border-[#10181A]/10 pb-2">
                    <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[#10181A]/55">Email</dt>
                    <dd className="truncate font-mono text-sm font-bold text-[#10181A]">{selected.email}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#10181A]/10 pb-2">
                    <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[#10181A]/55">Phone</dt>
                    <dd className="font-mono text-sm font-bold text-[#10181A]">{selected.phone || "—"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#10181A]/10 pb-2">
                    <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[#10181A]/55">Member Since</dt>
                    <dd className="font-mono text-sm font-bold text-[#10181A]">{formatDate(selected.createdAt)}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[#10181A]/55">Plan</dt>
                    <dd className="font-mono text-sm font-bold text-[#10181A]">{selected.plan.toUpperCase()}</dd>
                  </div>
                </dl>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={openRoleDialog}
                    className="h-9 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#D8C9A3] hover:bg-[#1E2A24]"
                  >
                    <KeyRound aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
                    Change Role
                  </Button>
                  <Button
                    type="button"
                    onClick={openDeleteDialog}
                    className="h-9 rounded-sm border border-[#A34343]/50 bg-transparent px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#A34343] hover:bg-[#A34343]/10"
                  >
                    <Trash2 aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
                    Remove User
                  </Button>
                </div>
              </IndexPanel>
            )}
          </div>
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/admin" backLabel="Back to Command Center" tone="ink">
          <span className="inline-flex items-center gap-1.5 text-sm">
            <ShieldCheck aria-hidden="true" className="size-4 text-[#C9A25E]" strokeWidth={2} />
            Every reassignment is inked — the ledger never forgets
          </span>
        </Colophon>
      </div>

      {/* ══ Role reassignment dialog ═══════════════════════════════════ */}
      {roleDialog && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10181A]/70 p-4"
          onClick={() => setRoleDialog(false)}
        >
          <div
            className="w-full max-w-md border border-[#D8C9A3]/30 bg-[#FCFAF2] p-6 shadow-[8px_10px_0_rgba(16,24,26,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C9A25E]">
              The Role Writ
            </p>
            <h2 className="terminal-serif mt-2 text-2xl font-black tracking-tight text-[#10181A]">
              Change Role for {selected.name}
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#10181A]/60">
              Current: {ROLE_META[selected.role].label}
            </p>

            <div className="mt-4 space-y-2">
              {(["student", "tutor", "admin"] as Role[]).map((r) => {
                const meta = ROLE_META[r]
                const Icon = meta.icon
                const isCurrent = selected.role === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewRole(r)}
                    disabled={isCurrent}
                    className={cn(
                      "flex w-full items-center gap-3 border px-4 py-3 text-left transition-all",
                      newRole === r
                        ? "border-[#C9A25E] bg-[#C9A25E]/10"
                        : "border-[#10181A]/20 hover:border-[#10181A]/40",
                      isCurrent && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
                    <span className="flex-1 text-base font-semibold tracking-tight">{meta.label}</span>
                    {isCurrent && (
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#10181A]/45">
                        Current
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {roleChangeError && (
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#A34343]">
                {roleChangeError}
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                onClick={handleChangeRole}
                disabled={roleChanging || newRole === selected.role}
                className="flex-1 h-9 rounded-sm border border-[#10181A] bg-[#10181A] px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#D8C9A3] hover:bg-[#1E2A24] disabled:opacity-50"
              >
                {roleChanging ? "Changing…" : "Confirm Change"}
              </Button>
              <Button
                type="button"
                onClick={() => setRoleDialog(false)}
                className="flex-1 h-9 rounded-sm border border-[#10181A]/30 bg-transparent px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#10181A] hover:bg-[#10181A]/5"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Delete user confirmation dialog ══════════════════════════════ */}
      {deleteDialog && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10181A]/70 p-4"
          onClick={() => setDeleteDialog(false)}
        >
          <div
            className="w-full max-w-md border border-[#A34343]/40 bg-[#FCFAF2] p-6 shadow-[8px_10px_0_rgba(16,24,26,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#A34343]">
              Remove From Register
            </p>
            <h2 className="terminal-serif mt-2 text-2xl font-black tracking-tight text-[#10181A]">
              Remove {selected.name}?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#10181A]/75">
              This will remove <strong className="text-[#10181A]">{selected.email}</strong> and any associated tuition batches and applications from the platform permanently.
            </p>

            {deleteError && (
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#A34343]">
                {deleteError}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                className="flex-1 h-9 rounded-sm border border-[#A34343] bg-[#A34343] px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FCFAF2] hover:bg-[#8F3535] disabled:opacity-50"
              >
                {deleting ? "Removing…" : "Confirm Removal"}
              </Button>
              <Button
                type="button"
                onClick={() => setDeleteDialog(false)}
                className="flex-1 h-9 rounded-sm border border-[#10181A]/30 bg-transparent px-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#10181A] hover:bg-[#10181A]/5"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}