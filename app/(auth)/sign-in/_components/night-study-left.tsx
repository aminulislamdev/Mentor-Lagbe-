import { HangingBookmark } from "./hanging-bookmark"
import { DossierStatus } from "./dossier-status"

export function NightStudyLeft() {
  return (
    <section
      aria-labelledby="night-study-heading"
      className="relative overflow-hidden border-b border-[#D9CBB5]/12 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 lg:col-span-7 lg:border-b-0 lg:border-r lg:px-12 lg:pb-16 lg:pt-16 xl:px-16"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 select-none font-mono text-[10px] uppercase tracking-[0.5em] text-[#EFE7DC]/22 xl:block"
        style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
      >
        Est. MMXXVI — The Reading Room for Returning Minds
      </span>

      <HangingBookmark />

      <div className="relative max-w-xl">
        <p
          className="study-rise font-mono text-[10px] uppercase tracking-[0.3em] text-[#C98B6D] sm:text-[11px] sm:tracking-[0.32em]"
          style={{ "--rise-delay": "0s" } as React.CSSProperties}
        >
          [ The Night Study — Returning Dossier ]
        </p>

        <h1
          id="night-study-heading"
          className="study-rise study-serif mt-4 font-black italic leading-[0.98] tracking-[-0.03em] sm:mt-5"
          style={{ "--rise-delay": "0.08s", fontSize: "clamp(2.8rem, 9.5vw, 6.75rem)" } as React.CSSProperties}
        >
          <span className="block text-[#EFE7DC]">The lamp</span>
          <span className="study-outline block">
            is still on<span className="text-[#C98B6D]" style={{ WebkitTextStroke: "0" }}>.</span>
          </span>
        </h1>

        <div
          className="study-rise mt-5 flex items-center gap-3"
          style={{ "--rise-delay": "0.16s" } as React.CSSProperties}
        >
          <svg width="40" height="16" viewBox="0 0 40 16" fill="none" aria-hidden="true" className="shrink-0 text-[#C98B6D]">
            <path d="M2 10C10 4 20 2 31 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 3.5" />
            <path d="M27 1.5 32.5 5 27 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[#EFE7DC]/50 sm:text-[12px]">
            and so are you, scholar
          </p>
        </div>

        <p
          className="study-rise mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[#EFE7DC]/75 sm:text-base"
          style={{ "--rise-delay": "0.22s" } as React.CSSProperties}
        >
          Every scholar keeps a place here. Your batch, your seat, and your
          hard-won margin notes are exactly where you left them — the
          question is only whether you picked up the pen.
        </p>

        <DossierStatus />

        <blockquote
          className="study-rise mt-8 hidden max-w-sm border-l-2 border-[#C98B6D]/45 pl-4 sm:block"
          style={{ "--rise-delay": "0.38s" } as React.CSSProperties}
        >
          <p className="study-serif text-base italic leading-snug text-[#EFE7DC]/70">
            &ldquo;The pen remembers. The page keeps. The study waits.&rdquo;
          </p>
          <cite className="mt-2 block font-mono text-[11px] uppercase not-italic tracking-[0.22em] text-[#EFE7DC]/38">
            — The House Maxim, Night Study
          </cite>
        </blockquote>
      </div>
    </section>
  )
}