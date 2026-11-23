import { Feather, ShieldCheck } from "lucide-react"

export function SealPanel() {
  return (
    <aside
      className="relative rotate-[-1.25deg] rounded-sm border border-[#243630] bg-[#344C43] p-6 sm:p-8 text-[#EFE7DC] shadow-[14px_14px_0_0_rgba(52,76,67,0.22)] dark:bg-[#243630]"
      aria-label="Registry seal and folio details"
    >
      <span aria-hidden="true" className="absolute left-2 top-1.5 font-mono text-[11px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute right-2 top-1.5 font-mono text-[11px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute bottom-1.5 left-2 font-mono text-[11px] text-[#EFE7DC]/25">+</span>
      <span aria-hidden="true" className="absolute bottom-1.5 right-2 font-mono text-[11px] text-[#EFE7DC]/25">+</span>

      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#B87959] sm:text-xs">
        Article III — The Seal
      </p>

      <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="charter-seal-glow relative flex size-32 sm:size-36 shrink-0 items-center justify-center rounded-full">
          <svg
            viewBox="0 0 100 100"
            className="charter-rotate absolute inset-0 size-full text-[#C98B6D]"
            aria-hidden="true"
          >
            <defs>
              <path
                id="charter-seal-circle"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <circle cx="50" cy="50" r="49" fill="#B87959" opacity="0.16" />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#B87959"
              strokeWidth="1.4"
              strokeDasharray="2.5 2.5"
            />
            <text className="fill-current" style={{ fontSize: "8.35px", letterSpacing: "1.6px", fontFamily: "var(--font-geist-mono), monospace", textTransform: "uppercase" }}>
              <textPath href="#charter-seal-circle">
                MentorLagbe · Seal of Enrollment · Est. 2026 ·
              </textPath>
            </text>
          </svg>
          <div className="relative flex size-16 sm:size-20 flex-col items-center justify-center rounded-full bg-[#B87959] text-[#EFE7DC] shadow-inner">
            <Feather className="size-6 sm:size-7" strokeWidth={1.5} />
            <span className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.15em]">
              Sealed
            </span>
          </div>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <p className="charter-serif text-lg sm:text-xl font-bold italic leading-snug text-[#EFE7DC]">
            “Four minutes, start to sealed.”
          </p>
          <p className="mt-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#EFE7DC]/55">
            Anika R. — Scholar of Physics · Mirpur
          </p>
        </div>
      </div>

      <dl className="mt-8 divide-y divide-[#EFE7DC]/12 border-y border-[#EFE7DC]/12 font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em]">
        {[
          ["Folio Nº", "ML-2026-04817"],
          ["Cohort", "2026 · E2"],
          ["Seats remaining", "312 / 500"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[#EFE7DC]/50">{k}</dt>
            <dd className="text-[#EFE7DC]">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5" aria-hidden="true">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFE7DC]/12">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#668B78] via-[#C98B6D] to-[#B87959]"
            style={{ width: "38%" }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#EFE7DC]/40">
          <span>Ledger open</span>
          <span>Sealing soon</span>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#EFE7DC]/45 sm:justify-start sm:text-xs">
        <ShieldCheck className="size-4 text-[#668B78]" strokeWidth={2} />
        Seal authenticity verified · Trust Office
      </p>
    </aside>
  )
}