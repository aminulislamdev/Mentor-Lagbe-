import { Asterisk } from "lucide-react"

export function HangingBookmark() {
  return (
    <div
      aria-hidden="true"
      className="study-bookmark pointer-events-none absolute right-2 top-0 z-0 hidden select-none sm:block md:right-4 lg:right-6"
    >
      <div
        className="relative flex h-48 w-12 flex-col items-center justify-between pb-8 pt-5 md:h-56 md:w-14 md:pb-9 md:pt-6 lg:h-72 lg:w-18"
        style={{
          background: "linear-gradient(175deg, #CE9163 0%, #B87959 42%, #96603F 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          boxShadow: "0 24px 44px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(239,231,220,0.25)",
        }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#1A2823]/70 md:text-[10px] md:tracking-[0.34em]">
          ML
        </span>
        <span
          className="study-serif text-base font-black italic leading-none text-[#EFE7DC]/90 md:text-lg lg:text-2xl"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          keep your place
        </span>
        <span className="flex size-4 items-center justify-center rounded-full border border-[#EFE7DC]/50 md:size-5 lg:size-6">
          <Asterisk className="size-2.5 text-[#EFE7DC]/85 md:size-3" strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}