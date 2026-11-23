export function ChosenStamp() {
  return (
    <div
      aria-hidden="true"
      className="charter-stamp absolute -right-3 -top-4 z-10 sm:-right-4 sm:-top-5"
    >
      <div className="flex size-20 sm:size-24 flex-col items-center justify-center rounded-full border-[3px] border-double border-[#B87959] bg-[#EFE7DC]/90 text-[#B87959] shadow-[0_4px_14px_rgba(184,121,89,0.35)] backdrop-blur-[2px] dark:bg-[#243630]/90">
        <span className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.15em]">
          Sealed
        </span>
        <span className="charter-serif text-sm font-black uppercase leading-tight tracking-wide">
          Chosen
        </span>
        <span className="font-mono text-[10px] uppercase leading-none tracking-[0.15em] opacity-80">
          2026
        </span>
      </div>
    </div>
  )
}