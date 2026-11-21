"use client"

import Link from "next/link"
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  GraduationCap,
  BadgeCheck,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock3,
  UserRound,
  NotebookPen,
  Sparkles,
  Crown,
  ChevronRight,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useApi } from "@/lib/hooks/use-api"
import { IndexPanel, Colophon } from "@/components/dashboard/shared"
import type { AdminStats } from "@/lib/api-types"

// ─── Scoped terminal styles ──────────────────────────────────────────────────

const terminalStyles = `
  .terminal-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .terminal-root ::selection { background: #C9A25E; color: #10181A; }

  @keyframes terminal-rise {
    from { transform: translateY(16px); }
    to   { transform: translateY(0); }
  }
  .terminal-rise { animation: terminal-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes terminal-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .terminal-ticker { animation: terminal-ticker 42s linear infinite; }

  @media (prefers-reduced-motion: reduce) {
    .terminal-rise, .terminal-ticker { animation: none !important; }
  }
`

// ─── Ticker tape items ───────────────────────────────────────────────────────

const TICKER = [
  "STRIPE ● OPERATIONAL",
  "BOARD SYNCED 60s AGO",
]

// ─── Registration chart data (decorative — no time-series API yet) ────────

const REGISTRATION_GROWTH = [
  { m: "May", students: 620, tutors: 96 },
  { m: "Jun", students: 705, tutors: 104 },
  { m: "Jul", students: 790, tutors: 121 },
  { m: "Aug", students: 880, tutors: 132 },
  { m: "Sep", students: 1040, tutors: 158 },
  { m: "Oct", students: 1230, tutors: 187 },
  { m: "Nov", students: 1395, tutors: 210 },
]

const MONTHLY_REVENUE = [
  { m: "Jun", usd: 4120 },
  { m: "Jul", usd: 4890 },
  { m: "Aug", usd: 5310 },
  { m: "Sep", usd: 6840 },
  { m: "Oct", usd: 7910 },
  { m: "Nov", usd: 10420 },
]

const PENDING_QUEUE = [
  { ref: "ML-1027", title: "HSC Chemistry — Reaction Mechanisms", tutor: "Dr. Nasrin Islam", subject: "Chemistry", fee: "৳3,900", submitted: "08:12" },
  { ref: "ML-1028", title: "Admission Physics — Wave Optics Sprint", tutor: "Mr. Tanvir Alam", subject: "Physics", fee: "৳4,900", submitted: "09:47" },
  { ref: "ML-1029", title: "O-Level Biology — Cell Division Mastery", tutor: "Ms. Sadia Hossain", subject: "Biology", fee: "৳3,400", submitted: "11:20" },
  { ref: "ML-1030", title: "IELTS Writing Task 2 — Band 8 Lab", tutor: "Mr. Nafis Kamal", subject: "IELTS", fee: "৳5,500", submitted: "13:05" },
]

const RECENTLY_APPROVED = [
  { ref: "ML-1024", title: "Chemistry — Functional Groups, Finally", tutor: "Ms. Sadia Hossain", when: "Today, 10:12" },
  { ref: "ML-1021", title: "HSC Physics — The Integration Finals", tutor: "Dr. Nasrin Islam", when: "Yesterday, 17:40" },
  { ref: "ML-1018", title: "Higher Maths — Admission Marathon", tutor: "Mr. Tanvir Alam", when: "15 Nov, 12:30" },
]

const RECENTLY_REJECTED = [
  { ref: "ML-1012", title: "Physics — Vectors Bootcamp (outcome claims)", tutor: "Dr. Nasrin Islam", when: "Yesterday, 09:15", reason: "Outcome guarantee — off-brief" },
  { ref: "ML-1009", title: "Maths — 100% Board Success Batch", tutor: "Mr. Arif Hossain", when: "13 Nov, 15:02", reason: "Outcome guarantee — off-brief" },
]

const ACTIVITY_FEED = [
  { day: "Today", time: "14:22", text: "Pro subscription — Tutor Pro", detail: "Dr. Nasrin Islam · ML-2042 · $15.00", Icon: Crown, tone: "gold" as const },
  { day: "Today", time: "13:05", text: "Tuition submitted for review", detail: "Mr. Nafis Kamal · IELTS · ML-1030", Icon: NotebookPen, tone: "terra" as const },
  { day: "Today", time: "11:31", text: "New tutor registered", detail: "Dr. Farhana Yasmin · SSMC · verified seal pending", Icon: GraduationCap, tone: "sage" as const },
  { day: "Today", time: "10:48", text: "Pro subscription — Student Pro", detail: "Tasnim Rahman · ML-2041 · $10.00", Icon: Sparkles, tone: "terra" as const },
  { day: "Today", time: "09:12", text: "Tuition approved · live on index", detail: "Chemistry — Functional Groups · ML-1024", Icon: BadgeCheck, tone: "sage" as const },
  { day: "Yesterday", time: "18:40", text: "New student registered", detail: "Rafia Sultana · Comilla Board · HSC '26", Icon: UserRound, tone: "paper" as const },
  { day: "Yesterday", time: "16:18", text: "Pro subscription — Tutor Pro", detail: "Mr. Tanvir Alam · ML-2038 · $15.00", Icon: Crown, tone: "gold" as const },
  { day: "Yesterday", time: "12:30", text: "Tuition approved · live on index", detail: "Higher Maths — Admission Marathon · ML-1018", Icon: BadgeCheck, tone: "sage" as const },
]

const RECENT_PAYMENTS = [
  { name: "Dr. Nasrin Islam", plan: "Tutor Pro", amount: "$15.00", method: "Visa •• 2042", when: "Today, 14:22" },
  { name: "Tasnim Rahman", plan: "Student Pro", amount: "$10.00", method: "bKash → Stripe", when: "Today, 10:48" },
  { name: "Mr. Tanvir Alam", plan: "Tutor Pro", amount: "$15.00", method: "Visa •• 7710", when: "Yesterday, 16:18" },
  { name: "Sumaiya Akter", plan: "Student Pro", amount: "$10.00", method: "Visa •• 1198", when: "15 Nov, 08:31" },
]

// ─── Custom SVG primitives ───────────────────────────────────────────────────

function RegistrationChart() {
  const W = 560
  const H = 190
  const PAD_L = 30
  const PAD_B = 24
  const PAD_T = 12
  const max = 1450
  const x = (i: number) => PAD_L + (i * (W - PAD_L - 8)) / (REGISTRATION_GROWTH.length - 1)
  const y = (v: number) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B)
  const line = (key: "students" | "tutors") =>
    REGISTRATION_GROWTH.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ")
  const area = (key: "students" | "tutors") =>
    `${line(key)} L${x(REGISTRATION_GROWTH.length - 1).toFixed(1)},${(H - PAD_B).toFixed(1)} L${x(0).toFixed(1)},${(H - PAD_B).toFixed(1)} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="New registrations per month, May to November. Students: 620, 705, 790, 880, 1040, 1230, 1395. Tutors: 96, 104, 121, 132, 158, 187, 210. Both series trending upward.">
      {[0, 500, 1000, 1450].map((v) => (
        <g key={v}>
          <line x1={PAD_L} y1={y(v)} x2={W - 4} y2={y(v)} stroke="#10181A" strokeOpacity="0.12" strokeDasharray="2 5" />
          <text x={PAD_L - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#10181A" fillOpacity="0.55" className="font-mono">{v}</text>
        </g>
      ))}
      <path d={area("students")} fill="#668B78" fillOpacity="0.22" />
      <path d={line("students")} fill="none" stroke="#4A695C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d={line("tutors")} fill="none" stroke="#B87959" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 3" />
      {REGISTRATION_GROWTH.map((d, i) => (
        <text key={d.m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#10181A" fillOpacity={i === REGISTRATION_GROWTH.length - 1 ? 0.9 : 0.5} fontWeight={i === REGISTRATION_GROWTH.length - 1 ? 700 : 400} className="font-mono">{d.m}</text>
      ))}
    </svg>
  )
}

function RevenueBars() {
  const W = 520
  const H = 170
  const PAD_B = 22
  const PAD_T = 14
  const max = Math.max(...MONTHLY_REVENUE.map((d) => d.usd))
  const bw = 40
  const gap = (W - MONTHLY_REVENUE.length * bw) / (MONTHLY_REVENUE.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label="Monthly Stripe revenue, June to November: 4,120; 4,890; 5,310; 6,840; 7,910; 10,420 US dollars. November is the strongest month on record.">
      {MONTHLY_REVENUE.map((d, i) => {
        const h = (d.usd / max) * (H - PAD_T - PAD_B)
        const x = gap + i * (bw + gap)
        const y = H - PAD_B - h
        const last = i === MONTHLY_REVENUE.length - 1
        return (
          <g key={d.m}>
            <rect x={x} y={y} width={bw} height={h} rx="1.5" fill={last ? "#B87959" : "#10181A"} fillOpacity={last ? 1 : 0.82} />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="9" fontWeight={last ? 800 : 500} fill={last ? "#B87959" : "#10181A"} fillOpacity={last ? 1 : 0.6} className="font-mono">
              {(d.usd / 1000).toFixed(1)}K
            </text>
            <text x={x + bw / 2} y={H - 5} textAnchor="middle" fontSize="9" fill="#10181A" fillOpacity="0.55" className="font-mono">{d.m}</text>
          </g>
        )
      })}
    </svg>
  )
}

function DistributionDonut({ split, totalUsers }: { split: Array<{ label: string; value: number; pct: number; tone: string }>; totalUsers: number }) {
  const R = 52
  const C = 2 * Math.PI * R

  // Precompute accumulated dash offsets before render (pure, no mutation)
  const arcs = split.reduce<Array<{ seg: (typeof split)[number]; dash: number; offset: number }>>(
    (acc, seg) => {
      const dash = (seg.pct / 100) * C
      const offset = acc.length === 0 ? 0 : acc[acc.length - 1].offset + acc[acc.length - 1].dash
      return [...acc, { seg, dash, offset }]
    },
    []
  )

  return (
    <svg viewBox="0 0 150 150" className="size-full" role="img" aria-label="Student vs tutor distribution: students 80.9%, tutors 13.1%, admins 0.05%, others 6%.">
      <circle cx="75" cy="75" r={R} fill="none" stroke="#10181A" strokeOpacity="0.08" strokeWidth="22" />
      {arcs.filter(({ seg }) => seg.pct > 0.5).map(({ seg, dash, offset }) => (
        <circle
          key={seg.label}
          cx="75"
          cy="75"
          r={R}
          fill="none"
          stroke={seg.tone}
          strokeWidth="22"
          strokeDasharray={`${dash} ${C - dash}`}
          strokeDashoffset={-offset}
          transform="rotate(-90 75 75)"
        />
      ))}
      <text x="75" y="70" textAnchor="middle" fontSize="19" fontWeight="800" fill="#10181A" className="font-mono">{totalUsers.toLocaleString()}</text>
      <text x="75" y="88" textAnchor="middle" fontSize="6" fill="#10181A" fillOpacity="0.6" className="font-mono" letterSpacing="1.5">TOTAL USERS</text>
    </svg>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const stats = useApi<AdminStats>("/api/dashboard/stats")

  const summary = stats.data
  const loading = stats.loading
  const error = stats.error

  const retry = () => stats.refetch()

  const totalUsers = summary?.totalUsers ?? 0
  const totalStudents = summary?.totalStudents ?? 0
  const totalTutors = summary?.totalTutors ?? 0
  const totalTuitions = summary?.totalTuitions ?? 0
  const pendingTuitions = summary?.pendingTuitions ?? 0
  const approvedTuitions = summary?.approvedTuitions ?? 0

  const ADMIN_KPIS = [
    { label: "Total Users", value: loading ? "—" : totalUsers.toLocaleString(), delta: "+4.6%", dir: "up" as const, note: "vs. Oct ’26" },
    { label: "Total Students", value: loading ? "—" : totalStudents.toLocaleString(), delta: "+5.1%", dir: "up" as const, note: "80.9% of base" },
    { label: "Total Tutors", value: loading ? "—" : totalTutors.toLocaleString(), delta: "+2.7%", dir: "up" as const, note: "13.1% of base" },
    { label: "Pending Approvals", value: loading ? "—" : pendingTuitions, delta: "-3", dir: "down" as const, note: "board queue" },
    { label: "Approved Tuitions", value: loading ? "—" : approvedTuitions, delta: "+12", dir: "up" as const, note: "live on index" },
    { label: "Stripe Revenue", value: "$48,214", delta: "+9.2%", dir: "up" as const, note: "USD · all-time" },
  ]

  const STUDENT_TUTOR_SPLIT_DYNAMIC = [
    { label: "Students", value: totalStudents, pct: totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 1000) / 10 : 80.9, tone: "#668B78" },
    { label: "Tutors", value: totalTutors, pct: totalUsers > 0 ? Math.round((totalTutors / totalUsers) * 1000) / 10 : 13.1, tone: "#B87959" },
    { label: "Admins", value: 7, pct: 0.05, tone: "#C9A25E" },
    { label: "Others", value: Math.max(0, totalUsers - totalStudents - totalTutors - 7), pct: totalUsers > 0 ? Math.round(((totalUsers - totalStudents - totalTutors - 7) / totalUsers) * 1000) / 10 : 6.0, tone: "#8A8F87" },
  ]

  const APPROVAL_MIX_DYNAMIC = [
    { label: "Approved", value: approvedTuitions, pct: totalTuitions > 0 ? Math.round((approvedTuitions / totalTuitions) * 1000) / 10 : 91.2, tone: "#668B78" },
    { label: "Pending", value: pendingTuitions, pct: totalTuitions > 0 ? Math.round((pendingTuitions / totalTuitions) * 1000) / 10 : 2.6, tone: "#B87959" },
    { label: "Rejected", value: Math.max(0, totalTuitions - approvedTuitions - pendingTuitions), pct: totalTuitions > 0 ? Math.round(((totalTuitions - approvedTuitions - pendingTuitions) / totalTuitions) * 1000) / 10 : 6.2, tone: "#A34343" },
  ]

  return (
    <div className="terminal-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{terminalStyles}</style>

      {/* ══ TICKER TAPE — live board strip ═══════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-[#D8C9A3]/25 bg-[#10181A] py-1.5" aria-hidden="true">
        <div className="terminal-ticker flex w-max whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className="size-1 bg-[#B87959]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ══ COMMAND CENTER MASTHEAD ═══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 75% -10%, rgba(216,201,163,0.14) 0%, transparent 55%), radial-gradient(rgba(237,232,218,0.045) 1px, transparent 1.4px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#D8C9A3]/14" />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — Platform Command Center ]
              </p>
              <h1
                className="terminal-rise terminal-serif mt-3 font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}
              >
                Platform
                <span className="block">
                  <span className="italic text-[#C9A25E]">Command Center.</span>
                  <span aria-hidden="true" className="text-[#B87959]">.</span>
                </span>
              </h1>
              <p className="terminal-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/72" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                The whole exchange floor on one desk — every registration, every
                board decision, every Stripe settlement, in real time. Review
                the queue, audit the ledger, then approve with one keystroke.
              </p>
              {/* Admin identity */}
              <div className="terminal-rise mt-4 flex flex-wrap items-center gap-3" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
                <span className="inline-flex items-center gap-2 border border-[#C9A25E]/45 bg-[#C9A25E]/10 px-3 py-1.5">
                  <ShieldCheck aria-hidden="true" className="size-4 text-[#C9A25E]" strokeWidth={2} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#EDE8DA]">
                    Arif Chowdhury · <span className="text-[#C9A25E]">Trust Office — Admin</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 border border-[#F2EDDF]/15 bg-[#F2EDDF]/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#F2EDDF]/60">
                  <Clock3 aria-hidden="true" className="size-3.5 text-[#B87959]" strokeWidth={2} />
                  Reporting period — Nov ’26 · Trailing 90 days
                </span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="lg:col-span-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#F2EDDF]/40">
                Quick Keys
              </p>
              <ol className="mt-2 divide-y divide-[#F2EDDF]/10 border-y border-[#F2EDDF]/14">
                {[
                  { key: "01", label: "Manage Users", meta: `${totalUsers.toLocaleString()} accounts`, href: "/dashboard/admin/users" },
                  { key: "02", label: "Review Tuitions", meta: `${pendingTuitions} awaiting board`, href: "/dashboard/admin/tuitions" },
                  { key: "03", label: "View Transactions", meta: "$48,214 settled", href: "/dashboard/admin/transactions" },
                ].map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]"
                    >
                      <span aria-hidden="true" className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#C9A25E]/70 transition-colors group-hover:text-[#C9A25E]">
                        {item.key}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] font-semibold tracking-tight text-[#EDE8DA] transition-colors group-hover:text-white">
                        {item.label}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#F2EDDF]/45">
                        {item.meta}
                      </span>
                      <ChevronRight aria-hidden="true" className="size-4 text-[#C9A25E]/60 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#C9A25E]" strokeWidth={2} />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* ══ KPI LEDGER BAND — six ruled operations ═══════════════════════ */}
      <div className="border-b border-[#D8C9A3]/25 bg-[#10181A]" aria-label="Platform key metrics">
        {loading && !summary ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#D8C9A3]/30 border-t-[#C9A25E] animate-spin" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D8C9A3]/60">Loading ledger…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A25E]">The ledger could not be opened.</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#F2EDDF]/50">{error}</p>
              <Button
                type="button"
                onClick={retry}
                className="mt-3 h-9 rounded-sm border border-[#C9A25E]/50 bg-transparent px-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9A25E] hover:bg-[#C9A25E]/10"
              >
                <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" strokeWidth={2} />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-[#F2EDDF]/10 sm:grid-cols-3 lg:grid-cols-6">
            {ADMIN_KPIS.map((kpi) => (
              <div key={kpi.label} className="flex flex-col gap-1 px-4 py-4 text-center sm:py-5">
                <p className="font-mono text-[9px] font-bold uppercase leading-snug tracking-[0.18em] text-[#D8C9A3]/75">
                  {kpi.label}
                </p>
                <p className="terminal-serif text-2xl font-black leading-none tracking-tight text-[#F2EDDF] sm:text-3xl">
                  {kpi.value}
                </p>
                <p className="flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#F2EDDF]/50">
                  {kpi.dir === "up" ? (
                    <ArrowUpRight aria-hidden="true" className="size-3 text-[#7AA890]" strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight aria-hidden="true" className="size-3 text-[#C98B6D]" strokeWidth={2.5} />
                  )}
                  <span className={kpi.dir === "up" ? "text-[#9DBFA9]" : "text-[#E0A57E]"}>{kpi.delta}</span>
                  <span className="hidden xl:inline">· {kpi.note}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[1280px] space-y-5 px-4 pb-8 pt-6 sm:px-6 lg:px-8">

        {/* ── ROW 1: registration growth | student/tutor donut | approval mix ── */}
        <div className="grid gap-5 lg:grid-cols-12">
          <IndexPanel
            tab="Growth — Registrations"
            meta="May → Nov · cumulative signups"
            className="lg:col-span-5"
          >
            <RegistrationChart />
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#10181A]/15 pt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#10181A]/60">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[3px] w-5 bg-[#4A695C]" />Students</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-[3px] w-5 border-t-2 border-dashed border-[#B87959]" />Tutors</span>
              <span className="ml-auto">1,605 new this quarter</span>
            </div>
          </IndexPanel>

          <IndexPanel
            tab="Composition — Student / Tutor"
            meta="Share of registered base"
            className="lg:col-span-3"
          >
            <div className="flex items-center gap-4">
              <div className="size-28 shrink-0 sm:size-32">
                <DistributionDonut split={STUDENT_TUTOR_SPLIT_DYNAMIC} totalUsers={totalUsers} />
              </div>
              <ul className="min-w-0 flex-1 space-y-1.5">
                {STUDENT_TUTOR_SPLIT_DYNAMIC.map((seg) => (
                  <li key={seg.label} className="flex items-baseline justify-between gap-2 border-b border-[#10181A]/10 pb-1 last:border-b-0">
                    <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#10181A]/70">
                      <span aria-hidden="true" className="inline-block size-2" style={{ backgroundColor: seg.tone }} />
                      {seg.label}
                    </span>
                    <span className="font-mono text-[10px] font-bold tabular-nums text-[#10181A]">
                      {seg.value.toLocaleString("en-US")} <span className="font-normal text-[#10181A]/45">· {seg.pct}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </IndexPanel>

          <IndexPanel
            tab="Board — Approval Mix"
            meta="533 rulings · trailing 180 days"
            className="lg:col-span-4"
          >
            <ul className="space-y-2.5">
              {APPROVAL_MIX_DYNAMIC.map((seg) => (
                <li key={seg.label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#10181A]/70">
                      {seg.label === "Pending" ? <Clock3 aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2} /> : seg.label === "Approved" ? <BadgeCheck aria-hidden="true" className="size-3 text-[#668B78]" strokeWidth={2} /> : <XCircle aria-hidden="true" className="size-3 text-[#A34343]" strokeWidth={2} />}
                      {seg.label}
                    </span>
                    <span className="font-mono text-[9px] font-bold tabular-nums text-[#10181A]">{seg.value} <span className="font-normal text-[#10181A]/45">· {seg.pct}%</span></span>
                  </div>
                  <div className="mt-1 h-2.5 w-full bg-[#10181A]/10" role="img" aria-label={`${seg.label}: ${seg.pct} percent`}>
                    <div className="h-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.tone }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-[#10181A]/15 pt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#10181A]/55">
              Approval SLA — 2 working days · 94% inside window
            </p>
          </IndexPanel>
        </div>

        {/* ── ROW 2: revenue bars | revenue snapshot ── */}
        <div className="grid gap-5 lg:grid-cols-12">
          <IndexPanel
            tab="Stripe — Monthly Revenue"
            meta="USD · settled · last 6 months"
            className="lg:col-span-7"
          >
            <RevenueBars />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#10181A]/15 pt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#10181A]/60">
              <span>Nov ’26 — <span className="font-bold text-[#B87959]">$10,420</span> · strongest month on record</span>
              <span>QTD <span className="font-bold text-[#10181A]">$27,570</span></span>
            </div>
          </IndexPanel>

          <IndexPanel
            tab="Revenue Snapshot"
            meta="Subscriptions outstanding"
            className="lg:col-span-5"
          >
            <dl className="grid grid-cols-3 divide-x divide-[#10181A]/15 border-b border-[#10181A]/20 pb-3">
              {[
                { n: "$48,214", label: "Total Revenue", tone: "text-[#10181A]" },
                { n: "412", label: "Student Pro", tone: "text-[#4A695C]" },
                { n: "618", label: "Tutor Pro", tone: "text-[#B87959]" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 px-1 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className={cn("terminal-serif text-xl font-black leading-none tracking-tight sm:text-2xl", s.tone)}>
                    {s.n}
                  </dd>
                  <dd className="font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-[#10181A]/55">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-3 divide-y divide-[#10181A]/12">
              {RECENT_PAYMENTS.map((p) => (
                <li key={`${p.name}-${p.when}`} className="flex items-center gap-2.5 py-2">
                  <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#C9A25E]/50 bg-[#C9A25E]/15 font-mono text-[10px] font-bold text-[#7A6A35]">
                    <Receipt className="size-3.5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold leading-tight tracking-tight">{p.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/55">{p.plan} · {p.method}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-[10px] font-bold tabular-nums text-[#10181A]">{p.amount}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#10181A]/50">{p.when}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/admin/transactions"
              className="group mt-2 flex items-center justify-between border-t border-[#10181A]/20 pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#10181A] transition-colors hover:text-[#B87959]"
            >
              Open the full ledger
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </IndexPanel>
        </div>

        {/* ── ROW 3: moderation queue + activity feed ── */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Moderation */}
          <IndexPanel
            tab="The Board — Moderation Queue"
            meta={`${pendingTuitions} awaiting review · SLA 2 days`}
            className="lg:col-span-7"
          >
            {pendingTuitions === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 aria-hidden="true" className="size-9 text-[#668B78]" strokeWidth={1.5} />
                <p className="terminal-serif mt-3 text-lg font-black tracking-tight">The queue is clear.</p>
                <p className="mt-1 max-w-xs font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">
                  Every submission ruled. The board convenes again at 09:00.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[#10181A]/12">
                {PENDING_QUEUE.map((item) => (
                  <li key={item.ref} className="py-2.5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#B87959]">
                          {item.ref} <span aria-hidden="true">·</span> Submitted {item.submitted}
                        </p>
                        <p className="mt-0.5 text-[13px] font-semibold leading-snug tracking-tight">{item.title}</p>
                        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#10181A]/55">
                          {item.tutor} · {item.subject} · <span className="font-bold text-[#10181A]">{item.fee}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-sm border border-[#10181A] bg-[#10181A] px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#9DBFA9] hover:bg-[#1E2A24]"
                          aria-label={`Approve ${item.ref}`}
                        >
                          <CheckCircle2 aria-hidden="true" className="size-3.5" strokeWidth={2} />
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-sm border border-[#A34343]/50 bg-transparent px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#A34343] hover:bg-[#A34343]/10"
                          aria-label={`Reject ${item.ref}`}
                        >
                          <XCircle aria-hidden="true" className="size-3.5" strokeWidth={2} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Recently ruled */}
            <div className="mt-3 grid gap-3 border-t border-[#10181A]/20 pt-3 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#4A695C]">
                  Recently Approved
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {RECENTLY_APPROVED.map((item) => (
                    <li key={item.ref} className="flex items-start gap-1.5 text-[10px] leading-snug">
                      <BadgeCheck aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#668B78]" strokeWidth={2} />
                      <span>
                        <span className="font-semibold tracking-tight">{item.title}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/55">{item.ref} · {item.when}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#A34343]">
                  Recently Rejected
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {RECENTLY_REJECTED.map((item) => (
                    <li key={item.ref} className="flex items-start gap-1.5 text-[10px] leading-snug">
                      <XCircle aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#A34343]" strokeWidth={2} />
                      <span>
                        <span className="font-semibold tracking-tight">{item.title}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/55">{item.ref} · {item.when} · {item.reason}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </IndexPanel>

          {/* Activity feed */}
          <IndexPanel
            tab="Wire — Recent Platform Activity"
            meta="Last 24h · grouped by day"
            className="lg:col-span-5"
          >
            <ol className="relative border-l-2 border-[#C9A25E]/50 pl-5">
              {ACTIVITY_FEED.map((item, i) => {
                const tone =
                  item.tone === "sage" ? "border-[#668B78] text-[#4A695C]"
                  : item.tone === "terra" ? "border-[#B87959] text-[#B87959]"
                  : item.tone === "gold" ? "border-[#C9A25E] text-[#7A6A35]"
                  : "border-[#10181A]/35 text-[#10181A]/70"
                return (
                  <li key={i} className="relative pb-3 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-[27px] top-0.5 flex size-5 items-center justify-center rounded-full border-2 bg-[#FCFAF2]",
                        tone
                      )}
                    >
                      <item.Icon className="size-2.5" strokeWidth={2.25} />
                    </span>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#B87959]">
                      {item.day} · {item.time}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold leading-snug tracking-tight">{item.text}</p>
                    <p className="font-mono text-[9px] uppercase leading-snug tracking-[0.14em] text-[#10181A]/55">{item.detail}</p>
                  </li>
                )
              })}
            </ol>
          </IndexPanel>
        </div>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/" backLabel="Back to the Atelier" tone="ink">
          <span className="inline-flex items-center gap-1.5">
            <CircleDollarSign aria-hidden="true" className="size-4 text-[#B87959]" strokeWidth={2} />
            Ledger closes 30 Nov · The Trust Office reads every line
          </span>
        </Colophon>
      </div>
    </div>
  )
}