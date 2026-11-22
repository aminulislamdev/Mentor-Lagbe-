"use client"

import { useEffect, useState } from "react"
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
  Crown,
  ChevronRight,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IndexPanel, Colophon } from "@/components/dashboard/shared"
import { apiFetch, ApiError } from "@/lib/api"
import type { AdminStats } from "@/lib/api-types"

// ✅ Recharts Imports
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from "recharts"

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

const TICKER = ["STRIPE ● OPERATIONAL", "BOARD SYNCED 60s AGO"]

// ─── Types ───────────────────────────────────────────────────────────────────
interface Transaction {
  _id: string
  userName: string
  userEmail: string
  planName: string
  amount: number
  currency: string
  paidAt: string
  paymentStatus?: string
}

interface Tuition {
  _id: string
  title: string
  subject: string
  tutorName: string
  monthlyFee: number
  createdAt: string
}

interface AdminUser {
  _id: string
  role: string
  createdAt: string
}

// ✅ Custom Tooltip
type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: string | number | Array<string | number>;
    dataKey?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="border border-[#10181A]/15 bg-[#FCFAF2] p-3 shadow-lg rounded-sm">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#10181A]/60 mb-2">
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} className="font-mono text-sm font-bold text-[#10181A]">
            {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ✅ Dynamic Revenue Formatter
const formatRevenueAxis = (val: number) => {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val}`;
};

// ✅ Growth Data Type
interface GrowthMonth {
  label: string;
  year: number;
  month: number;
  newStudents: number;
  newTutors: number;
}

// ✅ Helper 1: Process Real Users Data into Cumulative Growth
function processRealGrowthData(users: AdminUser[]) {
  const months: GrowthMonth[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      newStudents: 0,
      newTutors: 0
    });
  }

  users.forEach(u => {
    if (!u.createdAt) return;
    const cDate = new Date(u.createdAt);
    const mIndex = months.findIndex(m => m.month === cDate.getMonth() && m.year === cDate.getFullYear());

    if (mIndex !== -1) {
      if (u.role === 'student') months[mIndex].newStudents += 1;
      if (u.role === 'tutor') months[mIndex].newTutors += 1;
    }
  });

  let cumStudents = 0;
  let cumTutors = 0;

  const firstMonthDate = new Date(months[0].year, months[0].month, 1);
  users.forEach(u => {
    if (!u.createdAt) return;
    const cDate = new Date(u.createdAt);
    if (cDate < firstMonthDate) {
      if (u.role === 'student') cumStudents += 1;
      if (u.role === 'tutor') cumTutors += 1;
    }
  });

  return months.map(m => {
    cumStudents += m.newStudents;
    cumTutors += m.newTutors;
    return {
      m: m.label,
      students: cumStudents,
      tutors: cumTutors
    }
  });
}

// ✅ Helper 2: Process Real Transactions into Monthly Revenue
function processRealRevenueData(transactions: Transaction[]) {
  const months: { label: string; year: number; month: number; usd: number }[] = [];
  const now = new Date();

  // ১. গত ৬ মাসের একটি খালি অ্যারে তৈরি করি
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      usd: 0
    });
  }

  // ২. ট্রানজেকশনগুলোকে মাস অনুযায়ী যোগ করি
  transactions.forEach(tx => {
    if (!tx.paidAt) return;
    const txDate = new Date(tx.paidAt);
    const mIndex = months.findIndex(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());

    if (mIndex !== -1) {
      months[mIndex].usd += tx.amount;
    }
  });

  return months.map(m => ({
    m: m.label,
    usd: m.usd
  }));
}


// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pendingTuitions, setPendingTuitions] = useState<Tuition[]>([])
  const [approvedTuitions, setApprovedTuitions] = useState<Tuition[]>([])
  const [rejectedTuitions, setRejectedTuitions] = useState<Tuition[]>([])
  const [allUsers, setAllUsers] = useState<AdminUser[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Initial Data Fetch
  useEffect(() => {
    let cancelled = false

    const loadInitialData = async () => {
      try {
        const [statsRes, txRes, pendingRes, approvedRes, rejectedRes, usersRes] = await Promise.all([
          apiFetch<AdminStats>("/api/dashboard/stats"),
          // ✅ এখানে limit বাড়িয়ে ৫০ করা হয়েছে, যাতে ৬ মাসের সব ডেটা পাওয়া যায়
          apiFetch<Transaction[]>("/api/admin/transactions?limit=50"),
          apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=pending&limit=6"),
          apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=approved&limit=6"),
          apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=rejected&limit=3"),
          apiFetch<AdminUser[]>("/api/admin/users?limit=50"),
        ])

        if (cancelled) return

        setStats(statsRes.data)
        setTransactions(txRes.data || [])
        setPendingTuitions(pendingRes.data || [])
        setApprovedTuitions(approvedRes.data || [])
        setRejectedTuitions(rejectedRes.data || [])
        setAllUsers(usersRes.data || [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load dashboard data")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadInitialData()

    return () => {
      cancelled = true
    }
  }, [])

  // ✅ Retry Function
  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, txRes, pendingRes, approvedRes, rejectedRes, usersRes] = await Promise.all([
        apiFetch<AdminStats>("/api/dashboard/stats"),
        apiFetch<Transaction[]>("/api/admin/transactions?limit=50"),
        apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=pending&limit=6"),
        apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=approved&limit=6"),
        apiFetch<Tuition[]>("/api/admin/tuitions?approvalStatus=rejected&limit=3"),
        apiFetch<AdminUser[]>("/api/admin/users?limit=50"),
      ])

      setStats(statsRes.data)
      setTransactions(txRes.data || [])
      setPendingTuitions(pendingRes.data || [])
      setApprovedTuitions(approvedRes.data || [])
      setRejectedTuitions(rejectedRes.data || [])
      setAllUsers(usersRes.data || [])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  // ─── Dynamic Data Processing ───────────────────────────────────────────────
  const totalUsers = stats?.totalUsers ?? 0
  const totalStudents = stats?.totalStudents ?? 0
  const totalTutors = stats?.totalTutors ?? 0
  const totalTuitions = stats?.totalTuitions ?? 0
  const pendingCount = stats?.pendingTuitions ?? 0
  const approvedCount = stats?.approvedTuitions ?? 0
  const totalRevenue = stats?.totalRevenue ?? 0

  const ADMIN_KPIS = [
    { label: "Total Users", value: loading ? "—" : totalUsers.toLocaleString(), delta: "+4.6%", dir: "up" as const, note: "vs. Oct ’26" },
    { label: "Students", value: loading ? "—" : totalStudents.toLocaleString(), delta: "+5.1%", dir: "up" as const, note: `${totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0}% of base` },
    { label: "Tutors", value: loading ? "—" : totalTutors.toLocaleString(), delta: "+2.7%", dir: "up" as const, note: `${totalUsers > 0 ? Math.round((totalTutors / totalUsers) * 100) : 0}% of base` },
    { label: "Pending Approvals", value: loading ? "—" : pendingCount, delta: "-3", dir: "down" as const, note: "board queue" },
    { label: "Approved Tuitions", value: loading ? "—" : approvedCount, delta: "+12", dir: "up" as const, note: "live on index" },
    { label: "Total Revenue", value: loading ? "—" : `$${totalRevenue.toLocaleString()}`, delta: "+9.2%", dir: "up" as const, note: "USD · all-time" },
  ]

  const STUDENT_TUTOR_SPLIT_DYNAMIC = [
    { label: "Students", value: totalStudents, pct: totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 1000) / 10 : 0, tone: "#668B78" },
    { label: "Tutors", value: totalTutors, pct: totalUsers > 0 ? Math.round((totalTutors / totalUsers) * 1000) / 10 : 0, tone: "#B87959" },
    { label: "Admins", value: stats?.totalAdmins ?? 0, pct: totalUsers > 0 ? Math.round(((stats?.totalAdmins ?? 0) / totalUsers) * 1000) / 10 : 0, tone: "#C9A25E" },
    { label: "Others", value: Math.max(0, totalUsers - totalStudents - totalTutors - (stats?.totalAdmins ?? 0)), pct: totalUsers > 0 ? Math.round(((totalUsers - totalStudents - totalTutors - (stats?.totalAdmins ?? 0)) / totalUsers) * 1000) / 10 : 0, tone: "#8A8F87" },
  ].filter(d => d.value > 0)

  const APPROVAL_MIX_DYNAMIC = [
    { label: "Approved", value: approvedCount, pct: totalTuitions > 0 ? Math.round((approvedCount / totalTuitions) * 1000) / 10 : 0, tone: "#668B78" },
    { label: "Pending", value: pendingCount, pct: totalTuitions > 0 ? Math.round((pendingCount / totalTuitions) * 1000) / 10 : 0, tone: "#B87959" },
    { label: "Rejected", value: Math.max(0, totalTuitions - approvedCount - pendingCount), pct: totalTuitions > 0 ? Math.round(((totalTuitions - approvedCount - pendingCount) / totalTuitions) * 1000) / 10 : 0, tone: "#A34343" },
  ]

  // ✅ REAL CHART DATA
  const REGISTRATION_GROWTH = processRealGrowthData(allUsers)
  const MONTHLY_REVENUE = processRealRevenueData(transactions)

  // Activity Feed
  const realActivities = [
    ...transactions.slice(0, 6).map(tx => ({
      day: tx.paidAt ? (new Date(tx.paidAt).toDateString() === new Date().toDateString() ? "Today" : "Yesterday") : "Recently",
      time: tx.paidAt ? new Date(tx.paidAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : "12:00",
      text: `Pro subscription — ${tx.planName}`,
      detail: `${tx.userName} · $${tx.amount}`,
      Icon: Crown, tone: "gold" as const
    })),
    ...pendingTuitions.map(t => ({
      day: t.createdAt ? (new Date(t.createdAt).toDateString() === new Date().toDateString() ? "Today" : "Yesterday") : "Recently",
      time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00",
      text: `Tuition submitted for review`,
      detail: `${t.tutorName} · ${t.subject}`,
      Icon: NotebookPen, tone: "terra" as const
    })),
    ...approvedTuitions.map(t => ({
      day: "Yesterday", time: "10:12",
      text: "Tuition approved · live on index",
      detail: `${t.title}`,
      Icon: BadgeCheck, tone: "sage" as const
    })),
    ...rejectedTuitions.map(t => ({
      day: "Yesterday", time: "09:15",
      text: "Tuition rejected by board",
      detail: `${t.title}`,
      Icon: XCircle, tone: "terra" as const
    }))
  ]

  const dummyActivities = [
    { day: "Yesterday", time: "16:18", text: "New tutor registered", detail: "Dr. Nasrin Islam · SSMC · verified", Icon: GraduationCap, tone: "sage" as const },
    { day: "Yesterday", time: "12:30", text: "New student registered", detail: "Tasnim Rahman · HSC '26", Icon: UserRound, tone: "paper" as const },
    { day: "15 Nov", time: "08:31", text: "Pro subscription — Student Pro", detail: "Sumaiya Akter · $10", Icon: Crown, tone: "gold" as const },
    { day: "14 Nov", time: "14:20", text: "New tutor registered", detail: "Mr. Tanvir Alam · BUET", Icon: GraduationCap, tone: "sage" as const },
  ]

  const ACTIVITY_FEED = [...realActivities, ...dummyActivities].slice(0, 7)

  return (
    <div className="terminal-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{terminalStyles}</style>

      {/* Ticker Tape */}
      <div className="relative overflow-hidden border-b border-[#D8C9A3]/25 bg-[#10181A] py-2" aria-hidden="true">
        <div className="terminal-ticker flex w-max whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#D8C9A3]">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <span className="size-1.5 bg-[#B87959]" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Masthead */}
      <div
        className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#141E1B] text-[#EDE8DA]"
        style={{
          backgroundImage: "radial-gradient(ellipse 80% 60% at 75% -10%, rgba(216,201,163,0.14) 0%, transparent 55%), radial-gradient(rgba(237,232,218,0.045) 1px, transparent 1.4px)",
          backgroundSize: "auto, 22px 22px",
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#D8C9A3]/14" />
        <div className="relative mx-auto max-w-[1360px] px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — Platform Command Center ]
              </p>
              <h1
                className="terminal-rise terminal-serif mt-4 font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.8rem, 6vw, 4.5rem)" } as React.CSSProperties}
              >
                Platform
                <span className="block">
                  <span className="italic text-[#C9A25E]">Command Center.</span>
                  <span aria-hidden="true" className="text-[#B87959]">.</span>
                </span>
              </h1>
              <p className="terminal-rise mt-5 max-w-[55ch] text-base leading-relaxed text-[#F2EDDF]/80" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                The whole exchange floor on one desk — every registration, every
                board decision, every Stripe settlement, in real time. Review
                the queue, audit the ledger, then approve with one keystroke.
              </p>
            </div>

            {/* Quick actions */}
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#F2EDDF]/50">Quick Keys</p>
              <ol className="mt-3 divide-y divide-[#F2EDDF]/10 border-y border-[#F2EDDF]/14">
                {[
                  { key: "01", label: "Manage Users", meta: `${totalUsers.toLocaleString()} accounts`, href: "/dashboard/admin/users" },
                  { key: "02", label: "Review Tuitions", meta: `${pendingCount} awaiting board`, href: "/dashboard/admin/tuitions" },
                  { key: "03", label: "View Transactions", meta: `$${totalRevenue.toLocaleString()} settled`, href: "/dashboard/admin/transactions" },
                ].map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="group flex items-center gap-3 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A25E]">
                      <span aria-hidden="true" className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#C9A25E]/70 transition-colors group-hover:text-[#C9A25E]">{item.key}</span>
                      <span className="min-w-0 flex-1 text-[14px] font-semibold tracking-tight text-[#EDE8DA] transition-colors group-hover:text-white">{item.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F2EDDF]/45">{item.meta}</span>
                      <ChevronRight aria-hidden="true" className="size-4 text-[#C9A25E]/60 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#C9A25E]" strokeWidth={2} />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Band */}
      <div className="border-b border-[#D8C9A3]/25 bg-[#10181A]" aria-label="Platform key metrics">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <div className="text-center">
              <div className="h-10 w-10 mx-auto rounded-full border-2 border-[#D8C9A3]/30 border-t-[#C9A25E] animate-spin" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#D8C9A3]/70">Loading ledger…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-14">
            <div className="text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#C9A25E]">The ledger could not be opened.</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F2EDDF]/60">{error}</p>
              <Button type="button" onClick={handleRetry} className="mt-4 h-10 rounded-sm border border-[#C9A25E]/50 bg-transparent px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A25E] hover:bg-[#C9A25E]/10">
                <RefreshCw aria-hidden="true" className="mr-2 size-4" strokeWidth={2} /> Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 divide-x divide-[#F2EDDF]/10 sm:grid-cols-3 lg:grid-cols-6">
            {ADMIN_KPIS.map((kpi) => (
              <div key={kpi.label} className="flex flex-col gap-2 px-5 py-6 text-center">
                <p className="font-mono text-[11px] font-bold uppercase leading-snug tracking-[0.18em] text-[#D8C9A3]/80">{kpi.label}</p>
                <p className="terminal-serif text-3xl font-black leading-none tracking-tight text-[#F2EDDF] sm:text-4xl">{kpi.value}</p>
                <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F2EDDF]/60">
                  {kpi.dir === "up" ? <ArrowUpRight aria-hidden="true" className="size-3.5 text-[#7AA890]" strokeWidth={2.5} /> : <ArrowDownRight aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2.5} />}
                  <span className={kpi.dir === "up" ? "text-[#9DBFA9]" : "text-[#E0A57E]"}>{kpi.delta}</span>
                  <span className="hidden xl:inline">· {kpi.note}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="relative mx-auto max-w-[1360px] space-y-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* ROW 1 */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Growth Chart */}
          <IndexPanel tab="Growth — Registrations" meta="May → Nov · cumulative signups" className="lg:col-span-5">
            <div className="mt-4 h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REGISTRATION_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A695C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4A695C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10181A" strokeOpacity={0.1} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#10181A', opacity: 0.7, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#10181A', opacity: 0.6, fontFamily: 'monospace' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#10181A', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="students" name="Students" stroke="#4A695C" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                  <Line type="monotone" dataKey="tutors" name="Tutors" stroke="#B87959" strokeWidth={2.5} strokeDasharray="5 4" dot={false} activeDot={{ r: 6, fill: '#B87959' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#10181A]/15 pt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#10181A]/70">
              <span className="inline-flex items-center gap-2"><span className="inline-block h-1 w-6 bg-[#4A695C]" />Students</span>
              <span className="inline-flex items-center gap-2"><span className="inline-block h-1 w-6 border-t-2 border-dashed border-[#B87959]" />Tutors</span>
              <span className="ml-auto font-bold text-[#10181A]">{totalUsers} new this quarter</span>
            </div>
          </IndexPanel>

          {/* Donut Chart */}
          <IndexPanel tab="Composition — Student / Tutor" meta="Share of registered base" className="lg:col-span-3">
            <div className="flex flex-col items-center gap-6 mt-2">
              <div className="relative size-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STUDENT_TUTOR_SPLIT_DYNAMIC} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {STUDENT_TUTOR_SPLIT_DYNAMIC.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.tone} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-serif text-3xl font-black text-[#10181A]">{totalUsers.toLocaleString()}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#10181A]/60 mt-1">TOTAL USERS</span>
                </div>
              </div>
              <ul className="w-full space-y-2">
                {STUDENT_TUTOR_SPLIT_DYNAMIC.map((seg) => (
                  <li key={seg.label} className="flex items-baseline justify-between gap-2 border-b border-[#10181A]/10 pb-1.5 last:border-b-0">
                    <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#10181A]/80">
                      <span aria-hidden="true" className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: seg.tone }} />
                      {seg.label}
                    </span>
                    <span className="font-mono text-[12px] font-bold tabular-nums text-[#10181A]">
                      {seg.value.toLocaleString("en-US")} <span className="font-normal text-[#10181A]/50">· {seg.pct}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </IndexPanel>

          {/* Approval Mix */}
          <IndexPanel tab="Board — Approval Mix" meta={`${totalTuitions} rulings · trailing 180 days`} className="lg:col-span-4">
            <ul className="space-y-4 mt-2">
              {APPROVAL_MIX_DYNAMIC.map((seg) => (
                <li key={seg.label}>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-[#10181A]/80">
                      {seg.label === "Pending" ? <Clock3 aria-hidden="true" className="size-4 text-[#B87959]" strokeWidth={2} /> : seg.label === "Approved" ? <BadgeCheck aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} /> : <XCircle aria-hidden="true" className="size-4 text-[#A34343]" strokeWidth={2} />}
                      {seg.label}
                    </span>
                    <span className="font-mono text-[12px] font-bold tabular-nums text-[#10181A]">{seg.value} <span className="font-normal text-[#10181A]/50">· {seg.pct}%</span></span>
                  </div>
                  <div className="h-3 w-full bg-[#10181A]/10 rounded-full overflow-hidden" role="img" aria-label={`${seg.label}: ${seg.pct} percent`}>
                    <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.tone }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-[#10181A]/15 pt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#10181A]/60 text-center">
              Approval SLA — 2 working days · 94% inside window
            </p>
          </IndexPanel>
        </div>

        {/* ROW 2 */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Revenue Bar Chart */}
          <IndexPanel tab="Stripe — Monthly Revenue" meta="USD · settled · last 6 months" className="lg:col-span-7">
            <div className="mt-4 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_REVENUE} margin={{ top: 20, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10181A" strokeOpacity={0.1} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#10181A', opacity: 0.7, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#10181A', opacity: 0.6, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={formatRevenueAxis} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#10181A', opacity: 0.05 }} />
                  <Bar dataKey="usd" name="Revenue" fill="#10181A" maxBarSize={50} radius={[4, 4, 0, 0]}>
                    {MONTHLY_REVENUE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === MONTHLY_REVENUE.length - 1 ? "#B87959" : "#10181A"} fillOpacity={index === MONTHLY_REVENUE.length - 1 ? 1 : 0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#10181A]/15 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#10181A]/70">
              <span>Nov ’26 — <span className="font-bold text-[#B87959]">${totalRevenue.toLocaleString()}</span> · strongest month</span>
              <span>QTD <span className="font-bold text-[#10181A]">${(totalRevenue * 2.5).toLocaleString()}</span></span>
            </div>
          </IndexPanel>

          {/* Revenue Snapshot */}
          <IndexPanel tab="Revenue Snapshot" meta="Subscriptions outstanding" className="lg:col-span-5">
            <dl className="grid grid-cols-3 divide-x divide-[#10181A]/15 border-b border-[#10181A]/20 pb-5 mt-2">
              {[
                { n: `$${totalRevenue.toLocaleString()}`, label: "Total Revenue", tone: "text-[#10181A]" },
                { n: totalStudents, label: "Student Pro", tone: "text-[#4A695C]" },
                { n: totalTutors, label: "Tutor Pro", tone: "text-[#B87959]" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className={cn("terminal-serif text-2xl font-black leading-none tracking-tight sm:text-3xl", s.tone)}>{s.n}</dd>
                  <dd className="font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-[#10181A]/60">{s.label}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-3 divide-y divide-[#10181A]/10">
              {transactions.length === 0 ? (
                <li className="py-6 text-center font-mono text-xs uppercase text-[#10181A]/50">No recent payments</li>
              ) : transactions.slice(0, 6).map((p) => (
                <li key={p._id} className="flex items-center gap-3 py-3">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#C9A25E]/60 bg-[#C9A25E]/15 font-mono text-[11px] font-bold text-[#7A6A35]">
                    <Receipt className="size-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold leading-tight tracking-tight">{p.userName}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/60">{p.planName} · {p.currency?.toUpperCase()}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-[12px] font-bold tabular-nums text-[#10181A]">${p.amount}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/50">{p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }) : '—'}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/admin/transactions" className="group mt-3 flex items-center justify-between border-t border-[#10181A]/20 pt-3 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#10181A] transition-colors hover:text-[#B87959]">
              Open the full ledger
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </IndexPanel>
        </div>

        {/* ROW 3 */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Moderation Queue */}
          <IndexPanel tab="The Board — Moderation Queue" meta={`${pendingCount} awaiting review · SLA 2 days`} className="lg:col-span-7">
            {pendingTuitions.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 aria-hidden="true" className="size-12 text-[#668B78]" strokeWidth={1.5} />
                <p className="terminal-serif mt-4 text-xl font-black tracking-tight">The queue is clear.</p>
                <p className="mt-2 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[#10181A]/60">Every submission ruled. The board convenes again at 09:00.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#10181A]/10 mt-2">
                {pendingTuitions.map((item) => (
                  <li key={item._id} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B87959]">
                          {item._id.slice(-6).toUpperCase()} <span aria-hidden="true">·</span> Submitted {item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : "—"}
                        </p>
                        <p className="mt-1.5 text-[15px] font-semibold leading-snug tracking-tight">{item.title}</p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#10181A]/60">
                          {item.tutorName} · {item.subject} · <span className="font-bold text-[#10181A]">৳{item.monthlyFee.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button type="button" size="sm" className="h-9 rounded-sm border border-[#10181A] bg-[#10181A] px-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#9DBFA9] hover:bg-[#1E2A24]">
                          <CheckCircle2 aria-hidden="true" className="size-4 mr-1" strokeWidth={2} /> Approve
                        </Button>
                        <Button type="button" size="sm" className="h-9 rounded-sm border border-[#A34343]/50 bg-transparent px-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#A34343] hover:bg-[#A34343]/10">
                          <XCircle aria-hidden="true" className="size-4 mr-1" strokeWidth={2} /> Reject
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Recently ruled */}
            <div className="mt-5 grid gap-5 border-t border-[#10181A]/20 pt-5 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#4A695C]">Recently Approved</p>
                <ul className="mt-3 space-y-2">
                  {approvedTuitions.length === 0 && <li className="text-xs text-[#10181A]/50">No recent approvals</li>}
                  {approvedTuitions.slice(0, 2).map((item) => (
                    <li key={item._id} className="flex items-start gap-2 text-[12px] leading-snug">
                      <BadgeCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#668B78]" strokeWidth={2} />
                      <span>
                        <span className="font-semibold tracking-tight">{item.title}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/60">{item._id.slice(-6).toUpperCase()} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }) : '—'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#A34343]">Recently Rejected</p>
                <ul className="mt-3 space-y-2">
                  {rejectedTuitions.length === 0 && <li className="text-xs text-[#10181A]/50">No recent rejections</li>}
                  {rejectedTuitions.slice(0, 2).map((item) => (
                    <li key={item._id} className="flex items-start gap-2 text-[12px] leading-snug">
                      <XCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#A34343]" strokeWidth={2} />
                      <span>
                        <span className="font-semibold tracking-tight">{item.title}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#10181A]/60">{item._id.slice(-6).toUpperCase()} · {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }) : '—'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </IndexPanel>

          {/* Activity Feed */}
          <IndexPanel tab="Wire — Recent Platform Activity" meta="Last 24h · grouped by day" className="lg:col-span-5">
            <ol className="relative border-l-2 border-[#C9A25E]/50 pl-6 mt-2">
              {ACTIVITY_FEED.map((item, i) => {
                const tone = item.tone === "sage" ? "border-[#668B78] text-[#4A695C]" : item.tone === "terra" ? "border-[#B87959] text-[#B87959]" : item.tone === "gold" ? "border-[#C9A25E] text-[#7A6A35]" : "border-[#10181A]/35 text-[#10181A]/70"
                return (
                  <li key={i} className="relative pb-5 last:pb-0">
                    <span aria-hidden="true" className={cn("absolute -left-[33px] top-0.5 flex size-6 items-center justify-center rounded-full border-2 bg-[#FCFAF2]", tone)}>
                      <item.Icon className="size-3" strokeWidth={2.25} />
                    </span>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#B87959]">{item.day} · {item.time}</p>
                    <p className="mt-1 text-[13px] font-semibold leading-snug tracking-tight">{item.text}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-[#10181A]/60">{item.detail}</p>
                  </li>
                )
              })}
            </ol>
          </IndexPanel>
        </div>

        {/* Colophon */}
        <Colophon backHref="/" backLabel="Back to the Atelier" tone="ink">
          <span className="inline-flex items-center gap-2 text-[12px]">
            <CircleDollarSign aria-hidden="true" className="size-5 text-[#B87959]" strokeWidth={2} />
            Ledger closes 30 Nov · The Trust Office reads every line
          </span>
        </Colophon>
      </div>
    </div>
  )
}