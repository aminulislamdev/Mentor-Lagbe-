"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  GraduationCap,
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BadgeCheck,
  Eye,
  ChevronRight,
  KeyRound,
  Ban,
  History,
  Inbox,
  BookOpenCheck,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IndexPanel, Monogram, StatusChip, Colophon } from "@/components/dashboard/shared"

// ─── Static member registry ──────────────────────────────────────────────────

type Role = "student" | "tutor" | "admin"
type Plan = "free" | "pro"

interface Member {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  location: string
  role: Role
  plan: Plan
  joined: string
  joinedSort: number
  batches: number
  applicantsHandled?: number
  lastSeen: string
  source: string
  verified: boolean
}

const MEMBERS: Member[] = [
  { id: "U-0004211", name: "Tasnim Rahman", initials: "TR", email: "tasnim.rahman@scholarmail.com", phone: "+880 1711-405 903", location: "Dhanmondi, Dhaka", role: "student", plan: "pro", joined: "04 Nov '26", joinedSort: 20261104, batches: 1, lastSeen: "Today, 14:22", source: "Guardian referral", verified: true },
  { id: "U-0004208", name: "Dr. Nasrin Islam", initials: "NI", email: "nasrin@mentorlagbe.com", phone: "+880 1911-208 455", location: "Dhanmondi, Dhaka", role: "tutor", plan: "pro", joined: "02 Nov '26", joinedSort: 20261102, batches: 2, applicantsHandled: 84, lastSeen: "Today, 13:10", source: "MentorLagbe index", verified: true },
  { id: "U-0004204", name: "Rafia Sultana", initials: "RS", email: "rafia.sultana@scholarmail.com", phone: "+880 1819-233 674", location: "Comilla Sadar", role: "student", plan: "free", joined: "29 Oct '26", joinedSort: 20261029, batches: 2, lastSeen: "Yesterday, 18:40", source: "Tuition directory", verified: false },
  { id: "U-0004199", name: "Mr. Tanvir Alam", initials: "TA", email: "tanvir.alam@mentorlagbe.com", phone: "+880 1822-617 930", location: "BUET Road, Shahbagh", role: "tutor", plan: "pro", joined: "26 Oct '26", joinedSort: 20261026, batches: 2, applicantsHandled: 61, lastSeen: "Today, 09:05", source: "MentorLagbe index", verified: true },
  { id: "U-0004195", name: "Mahin Chowdhury", initials: "MC", email: "mahin.chowdhury@scholarmail.com", phone: "+880 1911-742 208", location: "Uttara Sector 7", role: "student", plan: "free", joined: "21 Oct '26", joinedSort: 20261021, batches: 1, lastSeen: "Today, 11:47", source: "MentorLagbe index", verified: false },
  { id: "U-0004190", name: "Arif Chowdhury", initials: "AC", email: "arif@mentorlagbe.com", phone: "+880 1733-811 425", location: "Dhanmondi, Dhaka", role: "admin", plan: "pro", joined: "14 Oct '26", joinedSort: 20261014, batches: 0, lastSeen: "Today, 14:31", source: "Internal — Trust Office", verified: true },
  { id: "U-0004188", name: "Sumaiya Akter", initials: "SA", email: "sumaiya.akter@scholarmail.com", phone: "+880 1713-509 812", location: "Mirpur 10", role: "student", plan: "pro", joined: "09 Oct '26", joinedSort: 20261009, batches: 2, lastSeen: "Yesterday, 20:15", source: "Guardian referral", verified: true },
  { id: "U-0004184", name: "Dr. Farhana Yasmin", initials: "FY", email: "farhana.yasmin@mentorlagbe.com", phone: "+880 1744-290 118", location: "Farmgate, Dhaka", role: "tutor", plan: "pro", joined: "03 Oct '26", joinedSort: 20261003, batches: 3, applicantsHandled: 128, lastSeen: "Today, 08:30", source: "MentorLagbe index", verified: true },
  { id: "U-0004180", name: "Fahim Rahman", initials: "FR", email: "fahim.rahman@scholarmail.com", phone: "+880 1755-640 119", location: "Rajshahi City", role: "student", plan: "free", joined: "28 Sep '26", joinedSort: 20260928, batches: 1, lastSeen: "2 days ago", source: "Repeater scholarship desk", verified: false },
  { id: "U-0004177", name: "Ms. Sadia Hossain", initials: "SH", email: "sadia.hossain@mentorlagbe.com", phone: "+880 1713-902 614", location: "Uttara Sector 7", role: "tutor", plan: "pro", joined: "19 Sep '26", joinedSort: 20260919, batches: 2, applicantsHandled: 45, lastSeen: "Yesterday, 17:02", source: "MentorLagbe index", verified: true },
  { id: "U-0004171", name: "Nusrat Jahan", initials: "NJ", email: "nusrat.jahan@scholarmail.com", phone: "+880 1712-660 384", location: "Mirpur 12", role: "student", plan: "free", joined: "11 Sep '26", joinedSort: 20260911, batches: 1, lastSeen: "3 days ago", source: "Tuition directory", verified: false },
  { id: "U-0004166", name: "Mr. Nafis Kamal", initials: "NK", email: "nafis.kamal@mentorlagbe.com", phone: "+880 1821-554 287", location: "Banani, Dhaka", role: "tutor", plan: "free", joined: "02 Sep '26", joinedSort: 20260902, batches: 1, applicantsHandled: 9, lastSeen: "4 days ago", source: "Tuition directory", verified: true },
]

const ROLE_META: Record<Role, { label: string; tone: "sage" | "terracotta" | "gold"; icon: typeof UserRound }> = {
  student: { label: "Student", tone: "sage", icon: GraduationCap },
  tutor: { label: "Tutor", tone: "terracotta", icon: BookOpenCheck },
  admin: { label: "Admin", tone: "gold", icon: ShieldCheck },
}

const PLAN_CHIP: Record<Plan, "pine" | "gold"> = {
  free: "pine",
  pro: "gold",
}

const REGISTRY_STATS = [
  { label: "Total Users", value: "12,847", tone: "text-[#10181A]" },
  { label: "Students", value: "10,392", tone: "text-[#4A695C]" },
  { label: "Tutors", value: "1,681", tone: "text-[#B87959]" },
  { label: "Admins", value: "7", tone: "text-[#7A6A35]" },
  { label: "Pro Members", value: "1,030", tone: "text-[#96603F]" },
]

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

const registryStyles = `
  .registry-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .registry-root ::selection { background: #C9A25E; color: #10181A; }

  @keyframes registry-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .registry-rise { animation: registry-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes registry-dialog-in {
    from { opacity: 0.4; transform: translateY(14px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .registry-dialog { animation: registry-dialog-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @media (prefers-reduced-motion: reduce) {
    .registry-rise, .registry-dialog { animation: none !important; }
  }
`

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<"all" | Role>("all")
  const [plan, setPlan] = useState<"all" | Plan>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [selectedId, setSelectedId] = useState(MEMBERS[0].id)
  const [roleDialog, setRoleDialog] = useState(false)
  const [dossierOpen, setDossierOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [members] = useState(MEMBERS)
  const [roleOverride, setRoleOverride] = useState<Record<string, Role>>({})

  const visibleMembers = useMemo(() => {
    const withOverrides = members.map((m) => ({ ...m, role: roleOverride[m.id] ?? m.role }))
    const list = withOverrides.filter((m) => {
      if (role !== "all" && m.role !== role) return false
      if (plan !== "all" && m.plan !== plan) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return [m.name, m.email, m.phone, m.id, m.location]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    return [...list].sort((a, b) =>
      sort === "newest" ? b.joinedSort - a.joinedSort : a.joinedSort - b.joinedSort
    )
  }, [members, role, plan, query, sort, roleOverride])

  const roleCounts = useMemo(() => {
    const withOverrides = members.map((m) => ({ ...m, role: roleOverride[m.id] ?? m.role }))
    return {
      all: withOverrides.length,
      student: withOverrides.filter((m) => m.role === "student").length,
      tutor: withOverrides.filter((m) => m.role === "tutor").length,
      admin: withOverrides.filter((m) => m.role === "admin").length,
    }
  }, [members, roleOverride])

  const planCounts = useMemo(
    () => ({
      all: members.length,
      free: members.filter((m) => m.plan === "free").length,
      pro: members.filter((m) => m.plan === "pro").length,
    }),
    [members]
  )

  const selected = useMemo(() => {
    const withOverrides = members.map((m) => ({ ...m, role: roleOverride[m.id] ?? m.role }))
    return withOverrides.find((m) => m.id === selectedId) ?? withOverrides[0]
  }, [members, selectedId, roleOverride])

  const selRole = ROLE_META[selected?.role ?? "student"]

  // Close the role-writ dialog on Escape and prevent body scroll while open
  useEffect(() => {
    if (!roleDialog) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setRoleDialog(false)
    }
    document.addEventListener("keydown", onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prev
    }
  }, [roleDialog])

  return (
    <div className="registry-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{registryStyles}</style>

      {/* ══ MASTHEAD ════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 78% -10%, rgba(216,201,163,0.15) 0%, transparent 55%), radial-gradient(rgba(237,232,218,0.045) 1px, transparent 1.4px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#D8C9A3]/14" />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pb-7">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ THE TRUST OFFICE — THE REGISTER OF SOULS ]
              </p>
              <h1
                className="registry-rise registry-serif mt-2.5 font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}
              >
                People &amp;
                <span className="block">
                  <span className="italic text-[#C9A25E]">Accounts.</span>
                  <span aria-hidden="true" className="text-[#B87959]">.</span>
                </span>
              </h1>
              <p className="registry-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/72" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                Every account on the exchange floor — scholars, mentors and the
                board itself. Search the register, reassign roles, and keep the
                directory honest.
              </p>
            </div>

            {/* Total members indicator */}
            <div className="lg:col-span-4">
              <p className="font-mono text-[7px] uppercase tracking-[0.32em] text-[#F2EDDF]/40">
                Registered Members
              </p>
              <p className="registry-serif mt-1 text-5xl font-black leading-none tracking-tight text-[#F2EDDF] sm:text-6xl">
                12,<span className="text-[#C9A25E]">847</span>
              </p>
              <p className="mt-1.5 font-mono text-[6.5px] uppercase leading-snug tracking-[0.2em] text-[#F2EDDF]/45">
                +486 this quarter · 96.2% verification coverage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ REGISTRY LEDGER — six ruled stats ═════════════════════════════ */}
      <div className="border-b border-[#D8C9A3]/25 bg-[#10181A]" aria-label="Registry statistics">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-[#F2EDDF]/10 sm:grid-cols-5">
          {REGISTRY_STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 px-3 py-4 text-center sm:py-5">
              <p className="font-mono text-[6px] font-bold uppercase leading-snug tracking-[0.18em] text-[#D8C9A3]/75">
                {s.label}
              </p>
              <p className="registry-serif text-2xl font-black leading-none tracking-tight text-[#F2EDDF] sm:text-3xl">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[1280px] space-y-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        {/* ── Sorting desk ── */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Role filter */}
            <div role="group" aria-label="Filter by role" className="flex gap-1.5">
              {ROLE_FILTERS.map((f) => {
                const active = role === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRole(f.key)}
                    className={cn(
                      "flex h-10 items-baseline gap-1.5 rounded-sm border px-2.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A] sm:px-3 sm:text-[8px]",
                      active
                        ? "border-[#D8C9A3] bg-[#10181A] text-[#D8C9A3]"
                        : "border-[#10181A]/30 text-[#10181A]/70 hover:border-[#10181A]/60 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                    <span className={cn("tabular-nums", active ? "text-[#C9A25E]" : "text-[#B87959]")}>
                      {f.key === "all" ? roleCounts.all : roleCounts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Plan filter */}
            <div role="group" aria-label="Filter by plan" className="flex rounded-sm border border-[#10181A]/30">
              {PLAN_FILTERS.map((f) => {
                const active = plan === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPlan(f.key)}
                    className={cn(
                      "h-10 px-3 font-mono text-[7px] font-bold uppercase tracking-[0.18em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#10181A] sm:text-[8px]",
                      active ? "bg-[#10181A] text-[#D8C9A3]" : "text-[#10181A]/60 hover:text-[#10181A]"
                    )}
                  >
                    {f.label}
                    <span className="ml-1 tabular-nums">{f.key === "all" ? planCounts.all : planCounts[f.key]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="registry-search" className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">Search members by name, email, phone, ID, or location</span>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45" strokeWidth={1.75} />
              <Input
                id="registry-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the register…"
                className="h-10 rounded-sm border-[#10181A]/30 bg-[#FCFAF2] pl-9 text-[13px] placeholder:text-[#10181A]/38 focus:border-[#C9A25E] focus:ring-[#C9A25E]/25"
              />
            </label>
            <label htmlFor="registry-sort" className="relative shrink-0">
              <span className="sr-only">Sort members</span>
              <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/45" strokeWidth={1.75} />
              <select
                id="registry-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 appearance-none rounded-sm border border-[#10181A]/30 bg-[#FCFAF2] pl-9 pr-8 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#10181A] outline-none transition-all hover:border-[#10181A]/55 focus:border-[#C9A25E] focus:ring-2 focus:ring-[#C9A25E]/25 sm:text-[9px]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/55" strokeWidth={2} />
            </label>
          </div>
        </div>

        {/* ── Index + dossier ── */}
        <div className="grid gap-5 lg:grid-cols-12 lg:items-start">

          {/* Left — The Member Index */}
          <IndexPanel
            tab="The Member Index"
            meta={`${visibleMembers.length} of ${members.length} on view`}
            className="lg:col-span-7"
          >
            {visibleMembers.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Inbox aria-hidden="true" className="size-10 text-[#C9A25E]" strokeWidth={1.5} />
                <h3 className="registry-serif mt-4 text-2xl font-black tracking-tight">
                  No souls match <span className="italic text-[#B87959]">that query.</span>
                </h3>
                <p className="mt-2 max-w-xs font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">
                  {query.trim() ? `Nothing in the register under “${query.trim()}”.` : "No members filed under these filters."}
                </p>
                <Button
                  type="button"
                  onClick={() => { setQuery(""); setRole("all"); setPlan("all") }}
                  className="mt-6 h-11 rounded-sm border border-[#10181A] bg-[#10181A] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#D8C9A3] hover:bg-[#1E2A24]"
                >
                  Clear the register
                </Button>
              </div>
            ) : (
              <ol className="divide-y divide-[#10181A]/12">
                {visibleMembers.map((m) => {
                  const active = m.id === selected.id
                  const meta = ROLE_META[m.role]
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(m.id)}
                        aria-pressed={active}
                        aria-label={`Open dossier for ${m.name}, ${m.email} — ${meta.label}, ${m.plan === "pro" ? "Pro" : "Free"} plan`}
                        className={cn(
                          "group flex w-full items-center gap-3 border-l-2 px-2 py-2.5 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C9A25E] sm:px-3",
                          active ? "border-[#C9A25E] bg-[#C9A25E]/12" : "border-transparent hover:bg-[#10181A]/5"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold transition-colors",
                            active ? "border-[#C9A25E] bg-[#10181A] text-[#D8C9A3]" : "border-[#10181A]/25 bg-[#10181A]/5 text-[#10181A] group-hover:border-[#10181A]"
                          )}
                        >
                          {m.initials}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate text-[12px] font-semibold leading-tight tracking-tight">{m.name}</span>
                            {m.verified && <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0 text-[#668B78]" strokeWidth={2} />}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#10181A]/55">
                            {m.email}
                          </span>
                          <span className="mt-0.5 hidden truncate font-mono text-[6px] uppercase tracking-[0.16em] text-[#10181A]/40 sm:block">
                            {m.phone} · {m.location} · Joined {m.joined}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <StatusChip tone={meta.tone}>{meta.label}</StatusChip>
                          <StatusChip tone={PLAN_CHIP[m.plan]}>{m.plan}</StatusChip>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </IndexPanel>

          {/* Right — The Dossier (sticky) */}
          <IndexPanel
            tab="The Dossier"
            meta={selected ? selected.id : "—"}
            className="lg:col-span-5 lg:sticky lg:top-[136px]"
          >
            {selected && (
              <div>
                {/* Identity strip */}
                <div className="flex items-center gap-4 border-b border-[#10181A]/15 pb-4">
                  <Monogram initials={selected.initials} size="2xl" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-lg font-black leading-tight tracking-tight">{selected.name}</span>
                      {selected.verified && <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-[#668B78]" strokeWidth={2} />}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5">
                      <StatusChip tone={selRole.tone}>{selRole.label}</StatusChip>
                      <StatusChip tone={PLAN_CHIP[selected.plan]}>
                        {selected.plan === "pro" ? "PRO MEMBER" : "FREE PLAN"}
                      </StatusChip>
                    </span>
                  </span>
                </div>

                {/* Ledger rows */}
                <dl className="mt-3 divide-y divide-[#10181A]/12 border-y border-[#10181A]/20 text-[11px]">
                  {[
                    { Icon: Mail, k: "Email", v: selected.email },
                    { Icon: Phone, k: "Phone", v: selected.phone },
                    { Icon: MapPin, k: "Location", v: selected.location },
                    { Icon: CalendarDays, k: "Joined", v: `${selected.joined} · via ${selected.source}` },
                    { Icon: History, k: "Last seen", v: selected.lastSeen },
                  ].map(({ Icon, k, v }) => (
                    <div key={k} className="flex items-baseline gap-2.5 py-2">
                      <Icon aria-hidden="true" className="size-3.5 shrink-0 translate-y-[2px] text-[#C9A25E]" strokeWidth={2} />
                      <dt className="w-16 shrink-0 font-mono text-[7px] uppercase tracking-[0.18em] text-[#10181A]/50">{k}</dt>
                      <dd className="truncate font-semibold leading-snug tracking-tight">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* Activity strip */}
                <div className="mt-3 flex items-center justify-between gap-3 border border-[#10181A]/20 bg-[#F2EDDF] px-3 py-2.5">
                  <span className="font-mono text-[6.5px] uppercase leading-snug tracking-[0.2em] text-[#10181A]/60">
                    {selected.role === "tutor" ? "Batches hosted" : selected.role === "student" ? "Batches enrolled" : "Moderations"}
                  </span>
                  <span className="registry-serif text-xl font-black leading-none">
                    {selected.role === "tutor" ? selected.batches : selected.role === "student" ? selected.batches : "142"}
                    <span className="text-xs font-normal text-[#10181A]/45">
                      {selected.role === "tutor" && selected.applicantsHandled !== undefined ? ` · ${selected.applicantsHandled} applicants` : ""}
                    </span>
                  </span>
                </div>

                {/* View profile (expand dossier) */}
                <button
                  type="button"
                  onClick={() => setDossierOpen((v) => !v)}
                  aria-expanded={dossierOpen}
                  aria-controls="member-dossier"
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#10181A] underline decoration-[#C9A25E] decoration-2 underline-offset-4 transition-colors hover:text-[#7A6A35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
                >
                  <Eye aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {dossierOpen ? "Hide full dossier" : "View Profile"}
                </button>

                {dossierOpen && (
                  <dl id="member-dossier" className="mt-3 grid grid-cols-1 gap-2 border border-dashed border-[#10181A]/35 bg-[#F2EDDF]/60 p-3 sm:grid-cols-2">
                    {[
                      ["Member ID", selected.id],
                      ["Account", selected.verified ? "Verified — sealed" : "Pending verification"],
                      ["Joined via", selected.source],
                      ["Renewal", selected.plan === "pro" ? "01 Dec ’26 · Stripe" : "— (Free plan)"],
                      ["Role since", selected.joined],
                      ["Session class", selected.plan === "pro" ? "Guild Member" : "Standard"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#10181A]/50">{k}</dt>
                        <dd className="mt-0.5 text-[10px] font-semibold leading-snug tracking-tight">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Administrative actions */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#10181A]/15 pt-3">
                  <Button
                    type="button"
                    onClick={() => setRoleDialog(true)}
                    className="h-11 rounded-sm border border-[#D8C9A3]/70 bg-[#10181A] px-4 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#D8C9A3] hover:bg-[#1E2A24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A]"
                  >
                    <ShieldCheck aria-hidden="true" className="size-4" strokeWidth={2} />
                    Change Role
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setManageOpen((v) => !v)}
                    aria-expanded={manageOpen}
                    aria-controls="manage-actions"
                    className="h-11 rounded-sm border border-[#10181A]/25 px-4 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#10181A]/75 hover:border-[#10181A] hover:text-[#10181A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10181A]"
                  >
                    <KeyRound aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    Manage Account
                  </Button>
                </div>

                {manageOpen && (
                  <div id="manage-actions" className="mt-3 border border-[#A34343]/35 bg-[#A34343]/5 p-3">
                    <p className="font-mono text-[7px] font-bold uppercase tracking-[0.28em] text-[#A34343]">
                      Manage Account — Elevated Actions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        { Icon: KeyRound, label: "Force password reset" },
                        { Icon: Ban, label: "Suspend account" },
                        { Icon: History, label: "Revoke all sessions" },
                      ].map(({ Icon, label }) => (
                        <button
                          key={label}
                          type="button"
                          className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-[#A34343]/35 bg-transparent px-2.5 font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#A34343] transition-colors hover:bg-[#A34343]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A34343]"
                        >
                          <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 font-mono text-[6px] uppercase leading-snug tracking-[0.18em] text-[#A34343]/70">
                      Elevated actions are logged to the Trust Office ledger
                    </p>
                  </div>
                )}
              </div>
            )}
          </IndexPanel>
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/dashboard/admin" backLabel="Back to the Command Center" tone="ink">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-4 text-[#C9A25E]" strokeWidth={2} />
            Every reassignment is inked — the ledger never forgets
          </span>
        </Colophon>
      </div>

      {/* ══ Role reassignment dialog ═══════════════════════════════════════ */}
      {roleDialog && selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Change user role"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
        >
          <div
            aria-hidden="true"
            onClick={() => setRoleDialog(false)}
            className="absolute inset-0 bg-[#10181A]/78 backdrop-blur-[3px]"
          />
          <div
            className="registry-dialog relative w-full max-w-lg border border-[#D8C9A3]/35 bg-[#141E1B] p-6 shadow-2xl"
          >
            <span aria-hidden="true" className="absolute right-4 top-4 select-none font-mono text-xl leading-none text-[#C9A25E]/75">§</span>
            <p className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#C9A25E]">
              The Role Writ
            </p>
            <h3 className="registry-serif mt-1.5 text-2xl font-black leading-tight tracking-tight text-[#F2EDDF]">
              Reassign <span className="italic text-[#C9A25E]">{selected.name}</span>
            </h3>
            <p className="mt-1.5 text-[12px] leading-snug text-[#F2EDDF]/65">
              The board rewrites roles with extreme prejudice — choose the ledger
              this soul belongs in. This writes to the register immediately.
            </p>

            <fieldset className="mt-5">
              <legend className="sr-only">Choose a new role</legend>
              <div className="space-y-2">
                {ROLE_FILTERS.filter((f) => f.key !== "all").map((f) => {
                  const meta = ROLE_META[f.key as Role]
                  const current = selected.role === f.key
                  return (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={current}
                      onClick={() => {
                        setRoleOverride((prev) => ({ ...prev, [selected.id]: f.key as Role }))
                        setRoleDialog(false)
                      }}
                      className={cn(
                        "group flex w-full items-center gap-3 border px-4 py-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]",
                        current
                          ? "border-[#C9A25E] bg-[#C9A25E]/12"
                          : "border-[#F2EDDF]/14 bg-[#F2EDDF]/4 hover:border-[#C9A25E]/50"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-sm border",
                          f.key === "student" && "border-[#668B78]/50 bg-[#668B78]/15 text-[#9DBFA9]",
                          f.key === "tutor" && "border-[#B87959]/50 bg-[#B87959]/15 text-[#C98B6D]",
                          f.key === "admin" && "border-[#C9A25E]/55 bg-[#C9A25E]/15 text-[#D8C9A3]"
                        )}
                      >
                        <meta.icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[13px] font-bold tracking-tight text-[#F2EDDF]">
                          {meta.label}
                          {current && (
                            <span className="rounded-sm border border-[#C9A25E]/55 bg-[#C9A25E]/15 px-1.5 py-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.2em] text-[#C9A25E]">
                              Current
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block font-mono text-[6.5px] uppercase leading-snug tracking-[0.16em] text-[#F2EDDF]/45">
                          {f.key === "student" && "Browses, applies, tracks applications"}
                          {f.key === "tutor" && "Posts batches, reviews applicants, earns"}
                          {f.key === "admin" && "Moderates, manages roles, audits revenue"}
                        </span>
                      </span>
                      <ChevronRight aria-hidden="true" className={cn(
                        "size-4 shrink-0 text-[#C9A25E]/45 transition-transform duration-200 group-hover:translate-x-1",
                        current && "text-[#C9A25E]"
                      )} strokeWidth={2} />
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <p className="mt-4 flex items-center gap-2 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.2em] text-[#F2EDDF]/45">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-[#C9A25E]" strokeWidth={2} />
              Role changes propagate instantly — logged to the Trust Office ledger
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRoleDialog(false)}
                className="h-11 rounded-sm px-4 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#F2EDDF]/60 hover:bg-[#F2EDDF]/8 hover:text-[#F2EDDF]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
