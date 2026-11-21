import { Asterisk } from "lucide-react"
import { NIGHT_FEATS } from "./night-data"

export function NightFooter() {
  return (
    <footer className="flex flex-col items-start justify-between gap-3 border-t border-[#D9CBB5]/12 px-4 py-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.26em] text-[#EFE7DC]/45 sm:flex-row sm:items-center sm:px-8 sm:text-[10px]">
      <p>
        {NIGHT_FEATS.map((feat) => (
          <span key={feat} className="mr-4 inline-flex items-center gap-1.5">
            <Asterisk className="size-3 text-[#C98B6D]" strokeWidth={2.5} />
            {feat}
          </span>
        ))}
      </p>
      <p className="text-[#EFE7DC]/32">© MMXXVI MentorLagbe · The Night Study</p>
    </footer>
  )
}