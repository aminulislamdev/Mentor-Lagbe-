
import { CONTENTS, METRICS } from "./oaths"

export function CharterMasthead() {
  return (
    <header className="grid gap-8 border-b border-[#344C43]/30 py-8 dark:border-[#EFE7DC]/15 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-14">
      <div className="relative lg:col-span-8">
        <p
          className="charter-rise font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]"
          style={{ "--rise-delay": "0s" } as React.CSSProperties}
        >
          [ Enrollment Charter · Vol. I · MMXXVI ]
        </p>

        <h1
          className="charter-rise charter-serif mt-4 font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#344C43] dark:text-[#EFE7DC]"
          style={{ "--rise-delay": "0.08s", fontSize: "clamp(3.4rem, 11vw, 8.25rem)" } as React.CSSProperties}
        >
          Dear Future
          <span className="charter-outline block">
            Master<span style={{ WebkitTextStroke: "0", color: "#B87959" }}>.</span>
          </span>
        </h1>

        <div
          className="charter-rise mt-5 flex items-center gap-3 sm:mt-6"
          style={{ "--rise-delay": "0.16s" } as React.CSSProperties}
        >
          <svg width="44" height="20" viewBox="0 0 44 20" fill="none" aria-hidden="true" className="shrink-0 text-[#B87959]">
            <path d="M2 14C12 6 22 4 34 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.5 4" />
            <path d="M30 3.5 35.5 8 29.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="max-w-[26ch] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-[#344C43]/65 dark:text-[#EFE7DC]/55">
            yes, you — the quiet one in the back row
          </p>
        </div>

        <p
          className="charter-rise mt-5 max-w-md text-sm leading-relaxed text-[#344C43]/80 dark:text-[#EFE7DC]/70 sm:text-[15px]"
          style={{ "--rise-delay": "0.22s" } as React.CSSProperties}
        >
          The ledger is open. MentorLagbe is the enrollment charter for a
          deliberate community of scholars and the mentors who shape them —
          choose your oath, inscribe yourself, and seal your place in the
          2026 cohort.
        </p>
      </div>

      <nav
        aria-label="Charter contents"
        className="charter-rise flex flex-col justify-center lg:col-span-4"
        style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#344C43]/55 dark:text-[#EFE7DC]/45">
          Contents
        </p>
        <ol className="mt-3 border-t border-[#344C43]/25 dark:border-[#EFE7DC]/15">
          {CONTENTS.map((item) => (
            <li key={item.numeral}>
              <a
                href={item.href}
                className="group flex items-baseline gap-2 whitespace-nowrap border-b border-[#344C43]/25 py-2.5 transition-colors dark:border-[#EFE7DC]/15 hover:bg-[#EFE7DC]/50 dark:hover:bg-[#EFE7DC]/5"
              >
                <span className="charter-serif w-6 shrink-0 text-base font-black italic text-[#B87959]">
                  {item.numeral}
                </span>
                <span className="text-[11px] font-semibold tracking-tight text-[#344C43] transition-transform duration-200 group-hover:translate-x-1 dark:text-[#EFE7DC] xl:text-[12px]">
                  {item.title}
                </span>
                <span aria-hidden="true" className="mx-0.5 min-w-2 flex-1 -translate-y-0.75 border-b border-dotted border-[#344C43]/40 dark:border-[#EFE7DC]/30" />
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[#344C43]/50 transition-colors group-hover:text-[#B87959] dark:text-[#EFE7DC]/40">
                  {item.note}
                </span>
              </a>
            </li>
          ))}
        </ol>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-[#344C43]/20 border-y border-[#344C43]/25 py-3 text-center dark:divide-[#EFE7DC]/15 dark:border-[#EFE7DC]/15">
          {METRICS.map((m) => (
            <div key={m.label} className="px-2">
              <dt className="sr-only">{m.label}</dt>
              <dd className="charter-serif text-lg font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-xl">
                {m.value}
              </dd>
              <dd className="mt-0.5 font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
                {m.label}
              </dd>
            </div>
          ))}
        </dl>
      </nav>
    </header>
  )
}