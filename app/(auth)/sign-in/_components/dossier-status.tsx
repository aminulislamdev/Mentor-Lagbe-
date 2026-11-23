import { DOSSIER_ROWS } from "./night-data"

export function DossierStatus() {
  return (
    <dl
      className="study-rise mt-6 w-full max-w-md border border-[#D9CBB5]/12 bg-[#1E2E29]/45 backdrop-blur-[2px] sm:mt-8"
      style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#D9CBB5]/12 px-3 py-2.5 sm:gap-4 sm:px-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C98B6D] sm:text-[10px] sm:tracking-[0.28em]">
          Dossier — Standing
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-[#EFE7DC]/40 sm:text-[9px] sm:tracking-[0.24em]">
          <span className="inline-block size-1.5 rounded-full bg-[#668B78]" />
          Saved
        </span>
      </div>

      {DOSSIER_ROWS.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[5.5rem_1fr] items-baseline gap-2 border-b border-[#D9CBB5]/10 px-3 py-2 last:border-b-0 sm:grid-cols-[6.5rem_1fr] sm:gap-3 sm:px-4"
        >
          <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#EFE7DC]/42 sm:text-[10px] sm:tracking-[0.22em]">
            {row.label}
          </dt>
          <dd className="text-[11px] font-medium tracking-tight text-[#EFE7DC]/90 sm:text-[12px]">
            {row.value}
          </dd>
        </div>
      ))}

      <div className="px-3 py-3 sm:px-4" aria-hidden="true">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#EFE7DC]/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#668B78] via-[#C98B6D] to-[#B87959]"
            style={{ width: "55%" }}
          />
        </div>
        <div className="mt-1.5 flex flex-wrap justify-between gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#EFE7DC]/35 sm:text-[9px] sm:tracking-[0.22em]">
          <span>Chapter — Integration by Parts</span>
          <span>55%</span>
        </div>
      </div>
    </dl>
  )
}