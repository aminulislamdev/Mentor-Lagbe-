import { DOSSIER_ROWS } from "./night-data"

export function DossierStatus() {
  return (
    <dl
      className="study-rise mt-8 max-w-md border border-[#D9CBB5]/12 bg-[#1E2E29]/45 backdrop-blur-[2px]"
      style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#D9CBB5]/12 px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C98B6D]">
          Dossier — Standing
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[#EFE7DC]/40">
          <span className="inline-block size-1.5 rounded-full bg-[#668B78]" />
          Saved
        </span>
      </div>

      {DOSSIER_ROWS.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 border-b border-[#D9CBB5]/10 px-4 py-2 last:border-b-0"
        >
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#EFE7DC]/42">
            {row.label}
          </dt>
          <dd className="text-[12px] font-medium tracking-tight text-[#EFE7DC]/90">
            {row.value}
          </dd>
        </div>
      ))}

      <div className="px-4 py-3" aria-hidden="true">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#EFE7DC]/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#668B78] via-[#C98B6D] to-[#B87959]"
            style={{ width: "55%" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#EFE7DC]/35">
          <span>Chapter — Integration by Parts</span>
          <span>55%</span>
        </div>
      </div>
    </dl>
  )
}