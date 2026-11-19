import Link from "next/link"
import {
  PenLine,
  BadgeCheck,
  Send,
  Sparkles,
  Bell,
  ArrowRight,
  Asterisk,
  MapPin,
  CalendarDays,
  Wallet,
  Armchair,
  Flame,
  BookOpenCheck,
  Quote,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Static almanac data ─────────────────────────────────────────────────────

const LEDGER = [
  { label: "Applications sent", value: "04", delta: "+2 this month", spark: [1, 1, 2, 2, 3, 3, 4], tone: "pine" as const },
  { label: "Offers received", value: "01", delta: "Seat 07 sealed", spark: [0, 0, 0, 0, 0, 1, 1], tone: "sage" as const },
  { label: "Awaiting review", value: "02", delta: "Avg. reply 4.2 days", spark: [0, 0, 1, 1, 2, 2, 2], tone: "terra" as const },
  { label: "Scholar plan", value: "FREE", delta: "Pin yours for $10", spark: null, tone: "plan" as const },
]

const APPLICATIONS = [
  { ref: "#AP-1042", title: "HSC Physics — Dr. Nasrin Islam", meta: "Fri & Sat · 6:00 PM · Dhaka", status: "ACCEPTED" as const },
  { ref: "#AP-1038", title: "Higher Maths — Mr. Tanvir (BUET'28)", meta: "Admission prep · Tue & Thu · 5:00 PM", status: "PENDING" as const },
]

const RHYTHM = [
  { day: "Mon", minutes: 0, kind: "rest" as const },
  { day: "Tue", minutes: 30, kind: "practice" as const },
  { day: "Wed", minutes: 0, kind: "today" as const },
  { day: "Thu", minutes: 25, kind: "practice" as const },
  { day: "Fri", minutes: 90, kind: "batch" as const },
  { day: "Sat", minutes: 90, kind: "batch" as const },
  { day: "Sun", minutes: 15, kind: "practice" as const },
]

const TIMELINE: Array<{
  day: string
  time: string
  title: string
  detail: string
  Icon: typeof PenLine
  tone: "sage" | "terra" | "pine"
}> = [
  { day: "Today", time: "6:12 AM", title: "Sealed Chapter 4 — Integration by Parts", detail: "12 margin notes filed to your Physics dossier.", Icon: PenLine, tone: "sage" },
  { day: "Yesterday", time: "9:40 PM", title: "Dr. Nasrin accepted your application", detail: "HSC Physics — Seat 07 is yours. Batch letter sent to your inbox.", Icon: BadgeCheck, tone: "sage" },
  { day: "17 Nov", time: "4:03 PM", title: "Higher Maths application submitted", detail: "Mr. Tanvir (BUET'28) — awaiting review. A 2-line note lifts acceptance odds.", Icon: Send, tone: "terra" },
  { day: "12 Nov", time: "11:28 AM", title: "Profile sketch reached 92%", detail: "Two fields short of Verified Scholar trust score.", Icon: Sparkles, tone: "pine" },
  { day: "08 Nov", time: "7:00 PM", title: "Batch reminder — ICT Practical", detail: "Thursday 6 PM with Ms. Rumana. Seat 09 held, lab notebook required.", Icon: Bell, tone: "terra" },
]

const INSIGHTS = [
  "Applications carrying a two-line note get accepted 3× more often — ink one before you hit send.",
  "Physics is your sharpest ink — 92nd percentile against the Dhaka HSC cohort this term.",
]

const FUNNEL = [
  { label: "Sent", count: "4", width: "100%", tone: "#344C43" },
  { label: "Viewed", count: "3", width: "72%", tone: "#668B78" },
  { label: "Accepted", count: "1", width: "31%", tone: "#B87959" },
]

const SLIPS = [
  {
    hue: "#668B78",
    tag: "Chemistry",
    title: "Functional Groups, Finally Make Sense",
    tutor: "Ms. Sadia Hossain · Dhaka Medical '29",
    meta: "Sun · 4:00 PM · Online cohort",
    fee: "৳3,800 / mo",
    seats: "4 seats left",
  },
  {
    hue: "#344C43",
    tag: "Higher Maths",
    title: "Admission Marathon — Problem Sets 07 to 12",
    tutor: "Mr. Tanvir Alam · BUET '28, 10 yrs",
    meta: "Tue & Thu · 5:00 PM · BUET Road",
    fee: "৳5,200 / mo",
    seats: "2 seats left",
  },
  {
    hue: "#B87959",
    tag: "ICT",
    title: "Practical Sprint — Number Systems Under Time",
    tutor: "Ms. Rumana Karim · Dhaka College",
    meta: "Thu · 6:30 PM · Lab-based, 6 seats",
    fee: "৳3,200 / mo",
    seats: "3 seats left",
  },
  {
    hue: "#4A695C",
    tag: "English",
    title: "Comprehension for Boards — the Unseen Passage",
    tutor: "Mr. Arif Hossain · Jahangirnagar U.",
    meta: "Sat · 9:00 AM · Online cohort",
    fee: "৳2,800 / mo",
    seats: "6 seats left",
  },
]

const BARCODE = [2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2]

// ─── Scoped almanac styles ───────────────────────────────────────────────────

const almanacStyles = `
  .almanac-serif { font-family: Georgia, 'Times New Roman', Times, serif; }

  .almanac-root ::selection { background: #B87959; color: #EFE7DC; }

  @keyframes almanac-rise {
    from { transform: translateY(18px); }
    to   { transform: translateY(0); }
  }
  .almanac-rise { animation: almanac-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }

  @keyframes almanac-stamp-in {
    0%   { transform: rotate(-16deg) scale(1.5); }
    60%  { transform: rotate(-11deg) scale(0.94); }
    100% { transform: rotate(-12deg) scale(1); }
  }
  .almanac-stamp { animation: almanac-stamp-in 0.5s cubic-bezier(0.2, 1.4, 0.35, 1) both; animation-delay: 0.25s; }

  @keyframes almanac-offer-pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.12); }
  }
  .almanac-offer-pulse { transform-origin: center; transform-box: fill-box; animation: almanac-offer-pulse 2.6s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .almanac-rise, .almanac-stamp, .almanac-offer-pulse { animation: none !important; }
  }
`

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sparkPoints(values: number[], w = 84, h = 24): string {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - 2 - ((v - min) / range) * (h - 4)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
}

function SectionHeading({
  index,
  title,
  note,
}: {
  index: string
  title: React.ReactNode
  note?: string
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-[#344C43] pt-4">
      <div className="flex items-baseline gap-3">
        <span aria-hidden="true" className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#B87959]">
          {index}
        </span>
        <h2 className="almanac-serif text-2xl font-black tracking-tight text-[#344C43] sm:text-3xl">
          {title}
        </h2>
      </div>
      {note && (
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#344C43]/55 sm:text-[10px]">
          {note}
        </p>
      )}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  return (
    <div className="almanac-root relative text-[#344C43]">
      <style>{almanacStyles}</style>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        {/* ══ MASTHEAD — the front page ══════════════════════════════════ */}
        <header className="grid gap-8 border-b border-[#344C43]/25 pb-6 pt-2 sm:pt-4 lg:grid-cols-12 lg:gap-10 lg:pb-8">
          {/* Greeting block */}
          <div className="flex flex-col justify-center lg:col-span-8">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#344C43]/60 sm:text-[10px]">
              <span>Wednesday · 18 November 2026</span>
              <span aria-hidden="true" className="h-px w-6 bg-[#B87959]" />
              <span>The Scholar&rsquo;s Almanac · Vol. I · No. 046</span>
            </div>

            <h1 className="almanac-rise almanac-serif mt-4 font-black leading-[0.95] tracking-[-0.03em] text-[#344C43]" style={{ "--rise-delay": "0s", fontSize: "clamp(2.6rem, 6.8vw, 5rem)" } as React.CSSProperties}>
              Good evening,
              <span className="relative mt-1 block w-fit italic text-[#344C43]">
                Tasnim.
                {/* Hand-drawn ink squiggle */}
                <svg aria-hidden="true" viewBox="0 0 220 14" className="absolute -bottom-3 left-0 w-[78%] overflow-visible text-[#B87959]" fill="none">
                  <path d="M2 9C38 3.5 72 3 108 8C144 13 178 10.5 218 5.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1 7" opacity="0.9" />
                </svg>
              </span>
            </h1>

            <p className="almanac-rise mt-6 max-w-[52ch] text-sm leading-relaxed text-[#344C43]/80 sm:text-[15px]" style={{ "--rise-delay": "0.1s" } as React.CSSProperties}>
              Your Physics batch convenes on Friday at six — Seat 07, front
              bench. Two applications sit awaiting review, and your margin
              notes are the talk of the reading room. Here&rsquo;s the morning
              ledger, freshly inked.
            </p>

            <div className="almanac-rise mt-5 flex flex-wrap items-center gap-4" style={{ "--rise-delay": "0.18s" } as React.CSSProperties}>
              <span className="inline-flex items-center gap-2 border border-[#344C43]/30 bg-[#EFE7DC] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#344C43]">
                <MapPin className="size-3 text-[#B87959]" strokeWidth={2} />
                HSC &rsquo;26 · Dhaka
              </span>
              <span className="inline-flex items-center gap-2 border border-[#668B78]/40 bg-[#668B78]/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#344C43]">
                <BookOpenCheck className="size-3 text-[#668B78]" strokeWidth={2} />
                Physics &rsquo;26 Batch — Enrolled
              </span>
              <Link href="/pricing" className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B87959] underline decoration-[#B87959]/40 underline-offset-4 transition-colors hover:text-[#96603F] sm:text-[10px]">
                Free plan · Go Pro →
              </Link>
            </div>
          </div>

          {/* ADMIT ONE ticket stub */}
          <div className="flex items-center justify-start lg:col-span-4 lg:justify-end">
            <figure
              className="almanac-rise relative w-full max-w-[21rem] -rotate-[1.4deg] border border-[#243630] bg-[#344C43] text-[#EFE7DC] shadow-[8px_10px_0_rgba(52,76,67,0.25)] transition-transform duration-300 hover:-rotate-[0.4deg]"
              style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
              aria-label="Admit one ticket stub — HSC Physics, seat 07"
            >
              {/* Perforation notches */}
              <span aria-hidden="true" className="absolute -left-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#F2ECDF]" />
              <span aria-hidden="true" className="absolute -right-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#F2ECDF]" />

              <div className="flex items-stretch">
                {/* Date block */}
                <div className="flex flex-col items-center justify-center border-r border-dashed border-[#EFE7DC]/25 px-5 py-5 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C98B6D]">Admit</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFE7DC]/60">One</span>
                  <span className="almanac-serif mt-2 text-6xl font-black leading-none text-[#EFE7DC]">18</span>
                  <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#EFE7DC]/80">Nov</span>
                </div>

                {/* Ticket body */}
                <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C98B6D]">The Evening Batch</p>
                    <p className="almanac-serif mt-1.5 text-lg font-black leading-tight text-[#EFE7DC]">
                      HSC Physics<br />with Dr. Nasrin
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#EFE7DC]/60">
                      Fri &amp; Sat · 6 PM<br />Seat 07 · Front bench
                    </div>
                    {/* Fake barcode */}
                    <div aria-hidden="true" className="flex h-9 items-stretch gap-[2px]">
                      {BARCODE.map((w, i) => (
                        <span key={i} className="bg-[#EFE7DC]/85" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                  </div>
                  <p className="border-t border-[#EFE7DC]/15 pt-2 font-mono text-[9px] uppercase tracking-[0.32em] text-[#EFE7DC]/40">
                    ML-2026-1042 · Non-transferable
                  </p>
                </div>
              </div>
            </figure>
          </div>
        </header>

        {/* ══ 01 — THE LEDGER (numbers, not cards) ═══════════════════════ */}
        <section aria-labelledby="ledger-heading" className="py-5 sm:py-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="ledger-heading" className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">
              01 — This Month, in Ink
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#344C43]/50 sm:text-[10px]">
              The Ledger · Nov &rsquo;26
            </p>
          </div>
          <div className="mt-2.5 grid grid-cols-2 divide-x divide-[#344C43]/15 border-y border-[#344C43]/25 md:grid-cols-4">
            {LEDGER.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5 px-4 py-4 first:pl-0 md:px-6 md:py-5 md:first:pl-2">
                <p className="font-mono text-[10px] uppercase leading-snug tracking-[0.22em] text-[#344C43]/55">
                  {item.label}
                </p>
                <div className="flex items-end justify-between gap-3">
                  <span className="almanac-serif text-4xl font-black leading-none tracking-tight text-[#344C43] md:text-5xl">
                    {item.value}
                  </span>
                  {item.spark && (
                    <svg width="84" height="24" viewBox="0 0 84 24" aria-hidden="true" className="shrink-0">
                      <polyline
                        points={sparkPoints(item.spark)}
                        fill="none"
                        stroke={item.tone === "sage" ? "#668B78" : item.tone === "terra" ? "#B87959" : "#344C43"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="84" cy="2" r="2.4" fill="#B87959" />
                    </svg>
                  )}
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#B87959]">
                  {item.tone === "plan" ? (
                    <Link href="/pricing" className="underline decoration-[#B87959]/40 underline-offset-2 hover:text-[#96603F]">
                      {item.delta} →
                    </Link>
                  ) : (
                    item.delta
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 02 + 03 — THE ROAD & THE MARGIN ════════════════════════════ */}
        <div className="grid gap-8 pb-8 lg:grid-cols-12 lg:gap-10">
          {/* 02 — The road to your seat (application journey) */}
          <section aria-labelledby="road-heading" className="lg:col-span-7">
            <SectionHeading
              index="02"
              title={<>The Road to <span className="italic text-[#668B78]">Your Seat</span></>}
              note="#AP-1042 · Physics"
            />

            {/* Journey arc — hand-inked S-curve */}
            <svg viewBox="0 0 560 168" className="mt-2 w-full" role="img" aria-label="Application journey: Applied 4 Nov, Reviewed 9 Nov, Offer received 14 Nov, seat seals pending">
              {/* Dotted track */}
              <path d="M12 112 C72 26 132 24 176 48 C224 74 232 122 298 124 C392 128 452 100 548 50"
                fill="none" stroke="#344C43" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 8" />
              {/* Completed stretch — sage ink */}
              <path d="M12 112 C72 26 132 24 176 48 C224 74 232 122 298 124"
                fill="none" stroke="#668B78" strokeWidth="3" strokeLinecap="round" />

              {/* Milestone 1 — Applied */}
              <g transform="translate(12,112)">
                <circle r="13" fill="#668B78" stroke="#F2ECDF" strokeWidth="2.5" />
                <path d="M-5 0.5 L -1.5 4 L 5.5 -4.5" fill="none" stroke="#EFE7DC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              {/* Milestone 2 — Reviewed */}
              <g transform="translate(176,48)">
                <circle r="13" fill="#668B78" stroke="#F2ECDF" strokeWidth="2.5" />
                <path d="M-5 0.5 L -1.5 4 L 5.5 -4.5" fill="none" stroke="#EFE7DC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              {/* Milestone 3 — Offer (current) */}
              <g transform="translate(298,124)" className="almanac-offer-pulse">
                <circle r="19" fill="none" stroke="#B87959" strokeWidth="1.6" strokeOpacity="0.65" />
                <circle r="12.5" fill="#B87959" stroke="#F2ECDF" strokeWidth="2.5" />
                <circle r="3.2" fill="#EFE7DC" />
              </g>
              {/* Milestone 4 — Seat sealed (pending) */}
              <g transform="translate(548,50)">
                <circle r="12" fill="#F2ECDF" stroke="#344C43" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="3 3.5" />
                <circle r="2.6" fill="#344C43" fillOpacity="0.4" />
              </g>

              {/* Station labels */}
              <text x="12" y="140" textAnchor="start" fill="#344C43" fillOpacity="0.85" fontSize="9" letterSpacing="1.4" className="font-mono">APPLIED</text>
              <text x="12" y="151" textAnchor="start" fill="#344C43" fillOpacity="0.45" fontSize="9" letterSpacing="1.2" className="font-mono">04 NOV</text>

              <text x="176" y="20" textAnchor="middle" fill="#344C43" fillOpacity="0.85" fontSize="9" letterSpacing="1.4" className="font-mono">REVIEWED</text>
              <text x="176" y="31" textAnchor="middle" fill="#344C43" fillOpacity="0.45" fontSize="9" letterSpacing="1.2" className="font-mono">09 NOV</text>

              <text x="298" y="152" textAnchor="middle" fill="#B87959" fontSize="9" letterSpacing="1.4" className="font-mono" fontWeight="700">OFFER</text>
              <text x="298" y="162" textAnchor="middle" fill="#B87959" fillOpacity="0.75" fontSize="9" letterSpacing="1.2" className="font-mono">14 NOV</text>

              <text x="548" y="26" textAnchor="end" fill="#344C43" fillOpacity="0.45" fontSize="9" letterSpacing="1.4" className="font-mono">SEALED</text>
              <text x="548" y="15" textAnchor="end" fill="#344C43" fillOpacity="0.3" fontSize="9" letterSpacing="1.2" className="font-mono">AWAITING</text>
            </svg>

            {/* Application ribbons — recently applied */}
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#344C43]/55">
              Recently Applied
            </p>
            <ul className="mt-1.5 divide-y divide-[#344C43]/15 border-y border-[#344C43]/20">
              {APPLICATIONS.map((app) => (
                <li key={app.ref} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold tracking-tight text-[#344C43]">
                      {app.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/50">
                      {app.ref} · {app.meta}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 -rotate-2 border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em]",
                      app.status === "ACCEPTED"
                        ? "border-[#668B78]/60 text-[#4A695C]"
                        : "border-[#B87959]/60 text-[#B87959]"
                    )}
                  >
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 03 — The margin (inked insights + funnel) */}
          <section aria-labelledby="margin-heading" className="lg:col-span-5">
            <SectionHeading
              index="03"
              title={<>The <span className="italic text-[#B87959]">Margin</span></>}
              note="Inked by your coach"
            />

            <div className="mt-4 space-y-4">
              {INSIGHTS.map((note, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 border-[#B87959]/50 pl-3">
                  <Quote aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B87959]/70" strokeWidth={2} />
                  <p className="almanac-serif text-[13px] italic leading-snug text-[#344C43]/90">
                    {note}
                  </p>
                </div>
              ))}
            </div>

            {/* Funnel — sent / viewed / accepted */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#344C43]/55">
                The Funnel — Where Ink Becomes Offers
              </p>
              <div className="space-y-1.5">
                {FUNNEL.map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#344C43]/60">
                      {row.label}
                    </span>
                    <div className="h-5 flex-1 bg-[#344C43]/8">
                      <div
                        className="flex h-full items-center justify-end pr-1.5"
                        style={{ width: row.width, backgroundColor: row.tone }}
                      >
                        <span className="font-mono text-[10px] font-bold text-[#EFE7DC]">{row.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak callout */}
            <div className="mt-5 flex items-center justify-between gap-4 border border-[#B87959]/40 bg-[#B87959]/8 px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <Flame aria-hidden="true" className="size-5 text-[#B87959]" strokeWidth={1.75} />
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#344C43]">12-day streak</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">Longest this term — keep the ink wet</p>
                </div>
              </div>
              <span aria-hidden="true" className="almanac-serif text-3xl font-black italic leading-none text-[#B87959]">12</span>
            </div>
          </section>
        </div>

        {/* ══ 04 + 05 — RHYTHM & STAMPS ══════════════════════════════════ */}
        <div className="grid gap-8 pb-8 lg:grid-cols-12 lg:gap-10">
          {/* 04 — This week's rhythm */}
          <section aria-labelledby="rhythm-heading" className="lg:col-span-5">
            <SectionHeading
              index="04"
              title={<>This Week&rsquo;s <span className="italic text-[#668B78]">Rhythm</span></>}
              note="238 / 270 min"
            />
            <div className="mt-5 grid grid-cols-7 items-end gap-1.5 sm:gap-2.5" role="img" aria-label="Minutes studied per day, Monday through Sunday: 0, 30, 0 today, 25, 90, 90, 15">
              {RHYTHM.map((d) => {
                const pct = Math.round((d.minutes / 90) * 100)
                return (
                  <div key={d.day} className="flex flex-col items-center gap-2">
                    {d.minutes > 0 && (
                      <span className="font-mono text-[9px] font-bold tracking-wider text-[#344C43]/70">
                        {d.minutes}m
                      </span>
                    )}
                    <div className="flex h-36 w-full items-end border border-[#344C43]/20 bg-[#EFE7DC]/70 p-[3px] sm:h-44">
                      <div
                        className="w-full transition-all"
                        style={{
                          height: `${Math.max(pct, d.minutes > 0 ? 8 : 0)}%`,
                          backgroundColor:
                            d.kind === "batch" ? "#B87959" : d.kind === "practice" ? "#344C43" : "transparent",
                        }}
                      />
                    </div>
                    <span className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.22em]",
                      d.kind === "today" ? "font-bold text-[#B87959]" : "text-[#344C43]/60"
                    )}>
                      {d.day}
                    </span>
                    {d.kind === "today" && (
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#B87959]" />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/55">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 bg-[#B87959]" /> Batch days</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 bg-[#344C43]" /> Practice</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-full border border-[#B87959]" /> Today</span>
            </div>
          </section>

          {/* 05 — Recent stamps (timeline) */}
          <section aria-labelledby="stamps-heading" className="lg:col-span-7">
            <SectionHeading
              index="05"
              title={<>Recent <span className="italic text-[#B87959]">Stamps</span></>}
              note="Fresh ink — this week"
            />
            <ol className="relative mt-4 border-l-2 border-dashed border-[#344C43]/30 pl-6 sm:pl-8">
              {TIMELINE.map((item, i) => (
                <li key={i} className="relative pb-4 last:pb-0">
                  {/* Stamp bullet */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-[31px] top-0.5 flex size-6 items-center justify-center rounded-full border-2 sm:-left-[41px] sm:size-7",
                      item.tone === "sage" && "border-[#668B78] bg-[#F2ECDF] text-[#4A695C]",
                      item.tone === "terra" && "border-[#B87959] bg-[#F2ECDF] text-[#B87959]",
                      item.tone === "pine" && "border-[#344C43] bg-[#F2ECDF] text-[#344C43]"
                    )}
                  >
                    <item.Icon className="size-3 sm:size-3.5" strokeWidth={2} />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-[#B87959]">
                      {item.day} · {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold leading-snug tracking-tight text-[#344C43]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 max-w-[60ch] text-[11px] leading-snug text-[#344C43]/65">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ══ 06 — ON YOUR RADAR (library catalogue slips) ═══════════════ */}
        <section aria-labelledby="radar-heading" className="pb-8">
          <SectionHeading
            index="06"
            title={<>On Your <span className="italic text-[#668B78]">Radar</span></>}
            note="Hand-picked from the catalogue"
          />
          <div className="-mx-1 mt-5 overflow-x-auto pb-3 [scrollbar-width:thin]" tabIndex={0} role="region" aria-label="Recommended tuitions, scroll horizontally">
            <ul className="flex w-max snap-x snap-mandatory gap-4 px-1">
              {SLIPS.map((slip, i) => (
                <li
                  key={i}
                  className="group relative w-64 shrink-0 snap-start border border-[#344C43]/30 bg-[#EFE7DC] p-4 shadow-[3px_4px_0_rgba(52,76,67,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[0.35deg] hover:shadow-[6px_9px_0_rgba(52,76,67,0.18)] sm:w-72"
                >
                  {/* Punch hole */}
                  <span aria-hidden="true" className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 rounded-full border border-[#344C43]/30 bg-[#F2ECDF]" />
                  <div className="pl-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#EFE7DC]"
                        style={{ backgroundColor: slip.hue }}
                      >
                        {slip.tag}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/45">
                        SLIP 0{i + 1} · ML-26
                      </span>
                    </div>

                    <h3 className="almanac-serif mt-2.5 min-h-[3.4rem] text-[15px] font-black leading-snug tracking-tight text-[#344C43]">
                      {slip.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-[#344C43]/55">
                      {slip.tutor}
                    </p>

                    <dl className="mt-3 space-y-1 border-t border-[#344C43]/20 pt-2 font-mono text-[10px] text-[#344C43]/70">
                      <div className="flex items-center gap-1.5"><CalendarDays className="size-3 text-[#668B78]" strokeWidth={2} />{slip.meta}</div>
                      <div className="flex items-center gap-1.5"><Wallet className="size-3 text-[#668B78]" strokeWidth={2} />{slip.fee}</div>
                      <div className="flex items-center gap-1.5"><Armchair className="size-3 text-[#668B78]" strokeWidth={2} />{slip.seats}</div>
                    </dl>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#344C43]/20 pt-2">
                      <span aria-hidden="true" className="almanac-stamp inline-block -rotate-12 border-2 border-[#B87959]/60 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#B87959]">
                        {slip.seats}
                      </span>
                      <Link
                        href="#"
                        className="group/link inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#344C43] transition-colors hover:text-[#B87959]"
                      >
                        Inspect &amp; apply
                        <ArrowRight aria-hidden="true" className="size-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ══ Colophon ════════════════════════════════════════════════════ */}
        <footer className="flex flex-col items-start justify-between gap-3 border-t-2 border-[#344C43] py-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.26em] text-[#344C43]/60 sm:flex-row sm:items-center sm:text-[10px]">
          <p className="flex flex-wrap items-center">
            {["Your seat is held", "Your notes are synced", "Your coach reads every line"].map((feat) => (
              <span key={feat} className="mr-4 inline-flex items-center gap-1.5">
                <Asterisk aria-hidden="true" className="size-3 text-[#B87959]" strokeWidth={2.5} />
                {feat}
              </span>
            ))}
          </p>
          <Link href="/pricing" className="group inline-flex items-center gap-1.5 font-bold text-[#B87959] transition-colors hover:text-[#96603F]">
            Scholar Pro pins your queue — $10
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </footer>
      </div>
    </div>
  )
}
