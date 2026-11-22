import * as React from "react"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/api-types"

export function RecentApplications({ apps }: { apps: Application[] }) {
  return (
    <>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#344C43]/55">
        Recently Applied
      </p>
      <ul className="mt-1.5 divide-y divide-[#344C43]/15 border-y border-[#344C43]/20">
        {apps.length === 0 ? (
          <li className="py-3 text-center font-mono text-[10px] italic text-[#344C43]/55">
            No applications yet — browse tuitions and post your first.
          </li>
        ) : (
          apps.map((app) => (
            <li key={app._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold tracking-tight text-[#344C43]">
                  {app.tuitionTitle}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#344C43]/50">
                  {`#AP-${app._id.slice(-4).toUpperCase()}`} · {app.subject} · {app.preferredSchedule.split("·")[0]?.trim()}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 -rotate-11 border-2 border-dashed px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
                  app.status === "accepted"
                    ? "border-[#668B78]/60 text-[#4A695C]"
                    : app.status === "pending"
                      ? "border-[#B87959]/60 text-[#B87959]"
                      : "border-[#A34343]/45 text-[#A34343]"
                )}
              >
                {app.status === "accepted" ? "ACCEPTED" : app.status === "pending" ? "PENDING" : "DECLINED"}
              </span>
            </li>
          ))
        )}
      </ul>
    </>
  )
}