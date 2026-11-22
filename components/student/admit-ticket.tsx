"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, BookOpenCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const BARCODE = [3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1]

export function AdmitTicket({ isPro }: { isPro: boolean }) {
  return (
    <div className="flex items-center justify-start lg:col-span-4 lg:justify-end">
      <figure
        className="almanac-rise relative w-full max-w-[21rem] -rotate-[1.4deg] border border-[#243630] bg-[#344C43] text-[#EFE7DC] shadow-[8px_10px_0_rgba(52,76,67,0.25)] transition-transform duration-300 hover:-rotate-[0.4deg]"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
        aria-label="Admit one ticket stub — HSC Physics, seat 07"
      >
        <span aria-hidden="true" className="absolute -left-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#F2ECDF]" />
        <span aria-hidden="true" className="absolute -right-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#F2ECDF]" />

        <div className="flex flex-col items-center justify-center border-r border-dashed border-[#EFE7DC]/25 px-5 py-5 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C98B6D]">Admit</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFE7DC]/60">One</span>
          <span className="almanac-serif mt-2 text-6xl font-black leading-none text-[#EFE7DC]">18</span>
          <span className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#EFE7DC]/80">Nov</span>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C98B6D]">The Evening Batch</p>
            <p className="almanac-serif mt-1.5 text-lg font-black leading-tight text-[#EFE7DC]">
              HSC Physics<br />with Dr. Nasrin
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#EFE7DC]/60">
              Fri &amp; Sat · 6 PM<br />Seat 07 · Front bench
            </div>
            <div aria-hidden="true" className="flex h-9 items-stretch gap-[2px]">
              {BARCODE.map((w, i) => (
                <span key={i} className="bg-[#EFE7DC]/85" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
          <p className="border-t border-[#EFE7DC]/15 pt-2 font-mono text-[9px] uppercase tracking-[0.32em] text-[#EFE7DC]/40">
            ML-2026-1042 · Non-transferable
          </p>
        </div>
      </figure>
    </div>
  )
}