import Link from "next/link"
import { ArrowRight, Asterisk } from "lucide-react"
import { ATTESTED_FEATS } from "./oaths"

export function CharterFooter() {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-[#344C43]/30 py-5 dark:border-[#EFE7DC]/15 sm:flex-row sm:items-center">
      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[#344C43]/60 dark:text-[#EFE7DC]/50 sm:text-[10px]">
        {ATTESTED_FEATS.map((feat) => (
          <span key={feat} className="mr-4 inline-flex items-center gap-1.5">
            <Asterisk className="size-3 text-[#B87959]" strokeWidth={2.5} />
            {feat}
          </span>
        ))}
      </p>
      <p className="text-sm text-[#344C43]/70 dark:text-[#EFE7DC]/65">
        Already sealed your place?{" "}
        <Link
          href="/sign-in"
          className="group inline-flex items-center gap-1 font-semibold text-[#344C43] underline decoration-[#B87959] decoration-2 underline-offset-4 transition-colors hover:text-[#668B78] dark:text-[#EFE7DC] dark:hover:text-[#9DBFA9]"
        >
          Sign In
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </p>
    </footer>
  )
}