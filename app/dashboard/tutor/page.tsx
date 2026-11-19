import Link from "next/link"
import {
  BadgeCheck,
  Crown,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
  Wallet,
  Star,
  BookOpenCheck,
  Inbox,
  Download,
  Pencil,
  Receipt,
  CheckCircle2,
  CircleDashed,
  Archive,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Colophon } from "@/components/dashboard/shared"

// ─── Static studio data ──────────────────────────────────────────────────────

const EARNINGS = [28.4, 31.2, 34.8, 36.5, 39.9, 42.6] // ৳K, Apr → Sep
const EARN_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]

const APPLICATIONS = [9, 14, 11, 19, 22, 27]

const TOPIC_COVERAGE = [
  { topic: "Integration by Parts", pct: 96 },
  { topic: "Organic — Functional Groups", pct: 88 },
  { topic: "Vectors & Kinematics", pct: 74 },
]

const LISTINGS = [
  { title: "HSC Physics — The Integration Finals", ref: "ML-1021", mode: "Fri & Sat · 6 PM · Dhanmondi", seats: "9 / 12", fee: "৳4,500", status: "enrolling" as const },
  { title: "Higher Maths — Admission Marathon", ref: "ML-1018", mode: "Tue & Thu · 5 PM · BUET Road", seats: "7 / 10", fee: "৳5,200", status: "enrolling" as const },
  { title: "Chemistry — Functional Groups, Finally", ref: "ML-1024", mode: "Sun · 4 PM · Online cohort", seats: "0 / 16", fee: "৳3,800", status: "pending" as const },
  { title: "Inorganic Foundations — Morning Cohort", ref: "ML-0994", mode: "Sat · 9 AM · Dhanmondi", seats: "14 / 14", fee: "৳4,200", status: "closed" as const },
]

const APPLICANTS = [
  { name: "Tasnim Rahman", ref: "#AP-1042", batch: "HSC Physics", when: "2m", status: "new" as const },
  { name: "Rafia Sultana", ref: "#AP-1041", batch: "HSC Physics", when: "1h", status: "new" as const },
  { name: "Mahin Chowdhury", ref: "#AP-1038", batch: "Admission Marathon", when: "3h", status: "reviewed" as const },
  { name: "Anika Islam", ref: "#AP-1027", batch: "Functional Groups", when: "Yesterday", status: "shortlisted" as const },
]

const MIX = [
  { label: "Active", count: 2, pct: 50, tone: "#668B78" },
  { label: "Pending board", count: 1, pct: 25, tone: "#B87959" },
  { label: "Closed", count: 1, pct: 25, tone: "#344C43" },
]

// ─── Scoped studio styles ────────────────────────────────────────────────────

const studioStyles = `
  .studio-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .studio-root ::selection { background: #B87959; color: #1E3A2F; }

  @keyframes studio-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .studio-rise { animation: studio-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes studio-glow-pulse {
    0%, 100% { box-shadow: 0 0 22px 0 rgba(201, 139, 109, 0.3); }
    50%      { box-shadow: 0 0 34px 4px rgba(201, 139, 109, 0.48); }
  }
  .studio-cta-glow { animation: studio-glow-pulse 4.5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .studio-rise, .studio-cta-glow { animation: none !important; }
  }
`

// ─── Folder-tab panel heading ────────────────────────────────────────────────

function StudioBoard({
  tab,
  note,
  children,
  className,
}: {
  tab: string
  note?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("relative border border-[#344C43]/25 bg-[#EFE7DC] shadow-[5px_6px_0_rgba(52,76,67,0.13)]", className)}>
      {/* Folder tab */}
      <span className="absolute -top-[13px] left-4 inline-flex h-[26px] items-center border border-[#344C43] bg-[#344C43] px-3 font-mono text-[7.5px] font-bold uppercase tracking-[0.3em] text-[#EFE7DC]">
        {tab}
      </span>
      {note && (
        <p className="absolute -top-[11px] right-4 hidden font-mono text-[7px] uppercase tracking-[0.24em] text-[#344C43]/55 sm:block">
          {note}
        </p>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  )
}

// ─── Earnings area chart (custom SVG) ────────────────────────────────────────

function EarningsChart() {
  const W = 560
  const H = 168
  const PAD_L = 34
  const PAD_B = 22
  const PAD_T = 14
  const max = 50
  const min = 20
  const x = (i: number) => PAD_L + (i * (W - PAD_L - 8)) / (EARNINGS.length - 1)
  const y = (v: number) => PAD_T + (1 - (v - min) / (max - min)) * (H - PAD_T - PAD_B)
  const line = EARNINGS.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const area = `${line} L${x(EARNINGS.length - 1).toFixed(1)},${(H - PAD_B).toFixed(1)} L${x(0).toFixed(1)},${(H - PAD_B).toFixed(1)} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Earnings per month, April to September: 28.4, 31.2, 34.8, 36.5, 39.9, 42.6 thousand taka. Steady rise, plus 18.4 percent on last term.">
      {/* Gridlines + y labels */}
      {[20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1={PAD_L} y1={y(v)} x2={W - 4} y2={y(v)} stroke="#344C43" strokeOpacity="0.12" strokeDasharray="2 5" />
          <text x={PAD_L - 6} y={y(v) + 3} textAnchor="end" fontSize="7.5" fill="#344C43" fillOpacity="0.5" className="font-mono">
            {v}K
          </text>
        </g>
      ))}
      {/* Area fill */}
      <path d={area} fill="#668B78" fillOpacity="0.18" />
      {/* Line */}
      <path d={line} fill="none" stroke="#668B78" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {EARNINGS.map((v, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(v)}
          r={i === EARNINGS.length - 1 ? 4.5 : 2.4}
          fill={i === EARNINGS.length - 1 ? "#B87959" : "#668B78"}
          stroke="#EFE7DC"
          strokeWidth="1.5"
        />
      ))}
      {/* Last value callout */}
      <text x={x(EARNINGS.length - 1)} y={y(42.6) - 8} textAnchor="middle" fontSize="9" fontWeight="700" fill="#B87959" className="font-mono">
        42.6K
      </text>
      {/* Month labels */}
      {EARN_MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="7.5" fill="#344C43" fillOpacity={i === EARNINGS.length - 1 ? 0.9 : 0.5} fontWeight={i === EARNINGS.length - 1 ? 700 : 400} className="font-mono">
          {m}
        </text>
      ))}
    </svg>
  )
}

// ─── Applications bar chart (custom SVG) ─────────────────────────────────────

function ApplicationsChart() {
  const W = 520
  const H = 132
  const PAD_B = 20
  const PAD_T = 16
  const max = Math.max(...APPLICATIONS)
  const bw = 34
  const gap = (W - APPLICATIONS.length * bw) / (APPLICATIONS.length + 1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label="Applications per month, April to September: 9, 14, 11, 19, 22, 27. Rising demand for your batches.">
      {APPLICATIONS.map((v, i) => {
        const h = ((v / max) * (H - PAD_T - PAD_B))
        const x = gap + i * (bw + gap)
        const y = H - PAD_B - h
        const last = i === APPLICATIONS.length - 1
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} fill={last ? "#B87959" : "#344C43"} fillOpacity={last ? 1 : 0.82} rx="1.5" />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="8" fontWeight="700" fill={last ? "#B87959" : "#344C43"} fillOpacity={last ? 1 : 0.6} className="font-mono">
              {v}
            </text>
            <text x={x + bw / 2} y={H - 5} textAnchor="middle" fontSize="7.5" fill="#344C43" fillOpacity="0.55" className="font-mono">
              {EARN_MONTHS[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TutorDashboardPage() {
  return (
    <div className="studio-root relative bg-[#F2ECDF] text-[#344C43]">
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
        {/* Chalk board frame line */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[#F2EDDF]/12" />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
            {/* Identity block */}
            <div className="lg:col-span-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#C98B6D]">
                [ The Mentor&rsquo;s Register — Studio № 3 · HSC Wing ]
              </p>
              <h1
                className="studio-rise studio-serif mt-3 font-black leading-[0.95] tracking-[-0.03em]"
                style={{ "--rise-delay": "0s", fontSize: "clamp(2.4rem, 5.8vw, 4.5rem)" } as React.CSSProperties}
              >
                <span className="text-[#F2EDDF]">Back at the board,</span>
                <span className="relative mt-1 block w-fit italic text-[#9DBFA9]">
                  Nasrin.
                  <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-[72%] overflow-visible text-[#C98B6D]" fill="none">
                    <path d="M2 8C36 2.5 68 2.2 102 7C136 11.8 166 8.4 198 4.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6.5" opacity="0.9" />
                  </svg>
                </span>
              </h1>

              {/* Chip row */}
              <div className="studio-rise mt-5 flex flex-wrap items-center gap-2.5" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
                <span className="inline-flex items-center gap-1.5 border border-[#7AA890]/45 bg-[#668B78]/15 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#9DBFA9]">
                  <BadgeCheck aria-hidden="true" className="size-3.5 text-[#C98B6D]" strokeWidth={2} />
                  Verified Mentor
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#C98B6D]/45 bg-[#B87959]/15 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C98B6D]">
                  <Crown aria-hidden="true" className="size-3.5" strokeWidth={2} />
                  Tutor Pro — Active
                </span>
                <span className="inline-flex items-center gap-1.5 border border-[#F2EDDF]/20 bg-[#F2EDDF]/5 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.22em] text-[#F2EDDF]/70">
                  <BookOpenCheck aria-hidden="true" className="size-3.5 text-[#9DBFA9]" strokeWidth={2} />
                  HSC Physics · 2 Batches
                </span>
              </div>

              <p className="studio-rise mt-4 max-w-[52ch] text-sm leading-relaxed text-[#F2EDDF]/70" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
                Friday&rsquo;s batch gathers at six — nine of twelve seats inked,
                two applicants fresh on your desk, and the September ledger
                settled at ৳42,600. The studio is yours; here is the board.
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
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#C98B6D] font-mono text-[9px] font-bold text-[#1E3A2F]">3</span>
                </Link>
              </div>
            </div>

            {/* Tutor Pro membership card */}
            <div className="lg:col-span-5">
              <figure
                className="studio-rise relative rotate-[-0.8deg] border border-[#C98B6D]/55 bg-[#243630]/80 p-5 shadow-[10px_12px_0_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform duration-300 hover:rotate-0 sm:p-6"
                style={{ "--rise-delay": "0.3s", backgroundImage: "linear-gradient(155deg, rgba(201,139,109,0.14) 0%, transparent 45%)" } as React.CSSProperties}
                aria-label="Tutor Pro membership — active"
              >
                {/* Foil corner */}
                <span aria-hidden="true" className="absolute right-4 top-4 font-mono text-[22px] leading-none text-[#C98B6D]/70">✦</span>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.34em] text-[#C98B6D]">
                    <Crown aria-hidden="true" className="size-4" strokeWidth={1.75} />
                    Tutor Pro
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#7AA890]/45 bg-[#668B78]/20 px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-[#9DBFA9]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#7AA890]" />
                    Active
                  </span>
                </div>

                <p className="studio-serif mt-4 text-3xl font-black leading-none tracking-tight text-[#F2EDDF]">
                  ৳15<span className="text-base font-bold text-[#F2EDDF]/55"> / mo</span>
                </p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.28em] text-[#F2EDDF]/45">
                  Mentor&rsquo;s Guild Membership
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[#F2EDDF]/12 pt-4 font-mono text-[8px] uppercase leading-snug tracking-[0.16em] text-[#F2EDDF]/70">
                  {["Unlimited batch listings", "Verified mentor seal", "Featured index ranking", "Applicant ledger + analytics"].map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0 text-[#C98B6D]" strokeWidth={2} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F2EDDF]/12 pt-3">
                  <span className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.2em] text-[#F2EDDF]/45">
                    Renews 01 Dec &rsquo;26<br />Invoice ML-2042 · Stripe
                  </span>
                  <Link
                    href="/dashboard/tutor/settings"
                    className="inline-flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#C98B6D] transition-colors hover:text-[#E0A57E]"
                  >
                    Manage
                    <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>

      {/* ══ GOLD FOIL CROSS-SELL — Scholar Pro for her students ══════════ */}
      <Link
        href="/pricing"
        className="group flex items-center justify-center gap-3 border-b border-[#8f5c23] bg-[#B87959] px-4 py-2.5 text-center transition-colors hover:bg-[#C98B6D]"
      >
        <Sparkles aria-hidden="true" className="size-4 shrink-0 text-[#1E3A2F]" strokeWidth={2} />
        <span className="font-mono text-[8px] font-bold uppercase leading-snug tracking-[0.22em] text-[#1E3A2F] sm:text-[9px]">
          Your students can pin their own queues — <span className="underline underline-offset-2">Scholar Pro, $10/mo</span> · Verified badge + priority review
        </span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[#1E3A2F] transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={2.5} />
      </Link>

      {/* ══ STUDIO BOARDS — body ═════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-[1280px] space-y-7 px-4 pb-10 pt-7 sm:px-6 lg:px-8">

        {/* ── EARNINGS + LISTING HEALTH ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Earnings panel */}
          <StudioBoard
            tab="Earnings — Term to Date"
            note="Stripe · settled 30 Sep"
            className="lg:col-span-7"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#344C43]/20 pb-3">
              <div>
                <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.3em] text-[#344C43]/55">
                  <Wallet aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />
                  This Term · 6 Months
                </p>
                <p className="studio-serif mt-1.5 text-5xl font-black leading-none tracking-tight text-[#344C43]">
                  ৳2,13,400
                </p>
              </div>
              <div className="text-right">
                <p className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#668B78]">
                  <TrendingUp aria-hidden="true" className="size-4" strokeWidth={2.25} />
                  +18.4%
                </p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.22em] text-[#344C43]/50">
                  vs. last term
                </p>
              </div>
            </div>
            <EarningsChart />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#344C43]/20 pt-3 font-mono text-[7px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/55">
              <span>Next payout — <span className="font-bold text-[#344C43]">Fri 21 Nov · ৳18,900</span> · Stripe</span>
              <span>Lifetime taught — <span className="font-bold text-[#344C43]">৳8.4L</span> · 312 scholars</span>
            </div>
          </StudioBoard>

          {/* Listing health panel */}
          <StudioBoard
            tab="Listing Health"
            note="Pro · unlimited"
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-3 divide-x divide-[#344C43]/15 border-b border-[#344C43]/20 pb-3">
              {[
                { n: "2", label: "Active", tone: "text-[#4A695C]" },
                { n: "1", label: "Pending", tone: "text-[#B87959]" },
                { n: "1", label: "Closed", tone: "text-[#344C43]/55" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className={cn("studio-serif text-5xl font-black leading-none", s.tone)}>{s.n}</span>
                  <span className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.24em] text-[#344C43]/55">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Portfolio mix stacked bar */}
            <div className="mt-4">
              <p className="mb-1.5 font-mono text-[7px] uppercase tracking-[0.28em] text-[#344C43]/55">
                Portfolio Mix
              </p>
              <div className="flex h-5 w-full overflow-hidden rounded-sm border border-[#344C43]/25" role="img" aria-label="Portfolio mix: 2 active listings (50%), 1 pending board approval (25%), 1 closed (25%)">
                {MIX.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-center"
                    style={{ width: `${m.pct}%`, backgroundColor: m.tone }}
                    title={`${m.label}: ${m.count}`}
                  >
                    <span className="font-mono text-[8px] font-bold text-[#EFE7DC]">{m.count}</span>
                  </div>
                ))}
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[6.5px] uppercase tracking-[0.18em] text-[#344C43]/60">
                {MIX.map((m) => (
                  <li key={m.label} className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="inline-block size-2.5" style={{ backgroundColor: m.tone }} />
                    {m.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro unlimited strip */}
            <p className="mt-4 flex items-center gap-2 border border-[#C98B6D]/45 bg-[#B87959]/10 px-3 py-2 font-mono text-[7px] font-bold uppercase leading-snug tracking-[0.2em] text-[#B87959]">
              <Crown aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
              Pro · Unlimited listings — no cap on your craft
            </p>
          </StudioBoard>
        </div>

        {/* ── BATCH TELEMETRY + RECENT APPLICANTS ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Telemetry */}
          <StudioBoard
            tab="Batch Telemetry"
            note="Apr → Sep"
            className="lg:col-span-7"
          >
            <div className="grid gap-6 md:grid-cols-5">
              {/* Applications per month */}
              <div className="md:col-span-3">
                <p className="flex items-center justify-between font-mono text-[7.5px] font-bold uppercase tracking-[0.26em] text-[#344C43]/60">
                  Applications / mo
                  <span className="font-normal text-[#668B78]">rising</span>
                </p>
                <ApplicationsChart />
              </div>
              {/* Topic coverage + vitals */}
              <div className="md:col-span-2 md:border-l md:border-[#344C43]/20 md:pl-5">
                <p className="font-mono text-[7.5px] font-bold uppercase tracking-[0.26em] text-[#344C43]/60">
                  Topic Mastery
                </p>
                <ul className="mt-2.5 space-y-2.5">
                  {TOPIC_COVERAGE.map((t) => (
                    <li key={t.topic}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] font-semibold leading-tight tracking-tight text-[#344C43]">
                          {t.topic}
                        </span>
                        <span className="font-mono text-[8px] font-bold text-[#4A695C]">{t.pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-[#344C43]/10" role="img" aria-label={`${t.topic}: ${t.pct} percent mastered`}>
                        <div className="h-full bg-[#668B78]" style={{ width: `${t.pct}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-[#344C43]/20 pt-3">
                  <span className="text-center">
                    <span className="flex items-center justify-center gap-1 font-mono text-[11px] font-bold text-[#344C43]"><Star aria-hidden="true" className="size-3.5 fill-[#B87959] text-[#B87959]" />4.9</span>
                    <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#344C43]/50">238 ratings</span>
                  </span>
                  <span className="text-center">
                    <span className="flex items-center justify-center gap-1 font-mono text-[11px] font-bold text-[#344C43]"><Flame aria-hidden="true" className="size-3.5 text-[#B87959]" strokeWidth={2} />34/36</span>
                    <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#344C43]/50">sessions held</span>
                  </span>
                </div>
              </div>
            </div>
          </StudioBoard>

          {/* Recent applicants */}
          <StudioBoard
            tab="Recent Applicants"
            note="Fresh ink — 24h"
            className="lg:col-span-5"
          >
            <ul className="divide-y divide-[#344C43]/15">
              {APPLICANTS.map((a) => (
                <li key={a.ref}>
                  <Link
                    href="/dashboard/tutor/applicants"
                    className="group flex items-center gap-3 py-2.5 transition-colors hover:bg-[#EFE7DC]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#668B78]"
                  >
                    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#B87959]/50 bg-[#344C43] font-mono text-[9px] font-bold text-[#EFE7DC]">
                      {a.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold leading-tight tracking-tight text-[#344C43]">
                        {a.name}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[6.5px] uppercase tracking-[0.18em] text-[#344C43]/55">
                        {a.batch} · {a.ref}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#344C43]/45">{a.when}</span>
                      <span
                        className={cn(
                          "rounded-sm border px-1.5 py-0.5 font-mono text-[6px] font-bold uppercase tracking-[0.2em]",
                          a.status === "new" && "border-[#B87959]/55 bg-[#B87959]/10 text-[#B87959]",
                          a.status === "reviewed" && "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]",
                          a.status === "shortlisted" && "border-[#344C43]/45 bg-[#344C43]/5 text-[#344C43]"
                        )}
                      >
                        {a.status}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/tutor/applicants"
              className="group mt-2 inline-flex items-center gap-1.5 border-t border-[#344C43]/20 pt-3 font-mono text-[8px] font-bold uppercase tracking-[0.24em] text-[#B87959] transition-colors hover:text-[#96603F]"
            >
              Open the applicant ledger
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </StudioBoard>
        </div>

        {/* ── LATEST LISTINGS LEDGER TABLE ── */}
        <StudioBoard tab="Latest Listings" note="ML-1021 · ML-1018 · ML-1024 · ML-0994">
          <div className="-mx-4 overflow-x-auto sm:-mx-5" tabIndex={0} role="region" aria-label="Your latest tuition listings, scroll horizontally">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-[#344C43]">
                  {["Ref", "Batch", "Mode & Schedule", "Seats", "Fee / mo", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-2 font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-[#344C43]/55 first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LISTINGS.map((l) => (
                  <tr key={l.ref} className="border-b border-[#344C43]/12 align-middle transition-colors hover:bg-[#EFE7DC]/70">
                    <td className="px-4 py-2.5 font-mono text-[9px] font-bold tracking-wider text-[#B87959] first:pl-4 sm:first:pl-5">
                      {l.ref}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] font-semibold leading-tight tracking-tight text-[#344C43]">{l.title}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[7.5px] uppercase leading-relaxed tracking-[0.14em] text-[#344C43]/65">
                      {l.mode}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] font-bold tabular-nums text-[#344C43]">{l.seats}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] font-bold tabular-nums text-[#344C43]">{l.fee}</td>
                    <td className="px-4 py-2.5 last:pr-4 sm:last:pr-5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 font-mono text-[6.5px] font-bold uppercase tracking-[0.2em]",
                          l.status === "enrolling" && "border-[#668B78]/55 bg-[#668B78]/10 text-[#4A695C]",
                          l.status === "pending" && "border-[#B87959]/55 bg-[#B87959]/10 text-[#B87959]",
                          l.status === "closed" && "border-[#344C43]/40 bg-[#344C43]/5 text-[#344C43]/55"
                        )}
                      >
                        {l.status === "enrolling" && <span aria-hidden="true" className="size-1.5 rounded-full bg-[#668B78]" />}
                        {l.status === "pending" && <CircleDashed aria-hidden="true" className="size-3" strokeWidth={2} />}
                        {l.status === "closed" && <Archive aria-hidden="true" className="size-3" strokeWidth={2} />}
                        {l.status === "enrolling" ? "Enrolling" : l.status === "pending" ? "Awaiting board" : "Closed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StudioBoard>

        {/* ── SPRINT BOARD — quick studio actions ── */}
        <section aria-labelledby="sprint-heading" className="border border-[#344C43]/25 bg-[#344C43] text-[#EFE7DC]">
          <div className="flex items-center justify-between gap-4 border-b border-[#EFE7DC]/12 px-4 py-3 sm:px-5">
            <h2 id="sprint-heading" className="font-mono text-[8px] font-bold uppercase tracking-[0.34em] text-[#C98B6D]">
              The Sprint Board — Studio Tasks
            </h2>
            <span className="hidden font-mono text-[7px] uppercase tracking-[0.24em] text-[#EFE7DC]/40 sm:inline">
              Friday, six o&rsquo;clock — doors open
            </span>
          </div>
          <ol className="grid divide-y divide-[#EFE7DC]/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-[#EFE7DC]/10">
            {[
              { key: "A", task: "Post a new tuition batch", meta: "Chemistry — Functional Groups awaits you", href: "/dashboard/tutor/post-tuition", Icon: Plus },
              { key: "B", task: "Review 3 new applicants", meta: "Physics finals — two seats to offer", href: "/dashboard/tutor/applicants", Icon: Inbox },
              { key: "C", task: "Download November ledger", meta: "Stripe payout ML-2042 · ৳18,900", href: "#", Icon: Download },
              { key: "D", task: "Touch up your verified seal", meta: "Degree scan expires Jan '27", href: "/dashboard/profile", Icon: Pencil },
            ].map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="group flex h-full items-start gap-3 px-4 py-4 transition-colors hover:bg-[#243630] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C98B6D] sm:px-5"
                >
                  <span aria-hidden="true" className="studio-serif mt-0.5 flex size-8 shrink-0 items-center justify-center border border-[#C98B6D]/45 font-serif text-base font-black italic text-[#C98B6D]">
                    {item.key}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold leading-snug tracking-tight text-[#EFE7DC] transition-colors group-hover:text-[#F2EDDF]">
                      {item.task}
                    </span>
                    <span className="mt-1 block font-mono text-[6.5px] uppercase leading-relaxed tracking-[0.16em] text-[#EFE7DC]/45">
                      {item.meta}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 font-mono text-[7px] font-bold uppercase tracking-[0.26em] text-[#C98B6D]">
                      Go
                      <ArrowRight aria-hidden="true" className="size-3 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <Colophon backHref="/" backLabel="Back to the Atelier">
          <span className="inline-flex items-center gap-1.5">
            <Receipt aria-hidden="true" className="size-3.5 text-[#B87959]" strokeWidth={2} />
            Ledger closes 21 Nov · The Trust Office reads every line
          </span>
        </Colophon>
      </div>
    </div>
  )
}
