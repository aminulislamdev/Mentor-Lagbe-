import { Asterisk } from "lucide-react"

export function HangingBookmark() {
  return (
    <div
      aria-hidden="true"
      className="study-bookmark pointer-events-none absolute right-2 top-0 z-0 hidden select-none sm:block lg:right-6"
    >
      <div
        className="relative flex h-56 w-14 flex-col items-center justify-between pb-9 pt-6 lg:h-72 lg:w-[4.5rem]"
        style={{
          background: "linear-gradient(175deg, #CE9163 0%, #B87959 42%, #96603F 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          boxShadow: "0 24px 44px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(239,231,220,0.25)",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#1A2823]/70">
          ML
        </span>
        <span
          className="study-serif text-lg font-black italic leading-none text-[#EFE7DC]/90 lg:text-2xl"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          keep your place
        </span>
        <span className="flex size-5 items-center justify-center rounded-full border border-[#EFE7DC]/50 lg:size-6">
          <Asterisk className="size-3 text-[#EFE7DC]/85" strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}