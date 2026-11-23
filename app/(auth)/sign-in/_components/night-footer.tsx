import { Asterisk } from "lucide-react"
import { NIGHT_FEATS } from "./night-data"

export function NightFooter() {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-[#D9CBB5]/12 px-4 py-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[#EFE7DC]/45 sm:flex-row sm:items-center sm:px-8 sm:text-[12px] sm:tracking-[0.26em]">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {NIGHT_FEATS.map((feat) => (
          <span key={feat} className="inline-flex items-center gap-2">
            <Asterisk className="size-3.5 text-[#C98B6D] sm:size-4" strokeWidth={2.5} />
            {feat}
          </span>
        ))}
      </p>
      <p className="text-[#EFE7DC]/35">
        © MMXXVI MentorLagbe · The Night Study
      </p>
    </footer>
  )
}