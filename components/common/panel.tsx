import * as React from "react"
import { cn } from "@/lib/utils"

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: "section" | "div"
}

export function Panel({ children, className, as = "section", ...rest }: PanelProps) {
  const Tag = as
  return (
    <Tag
      className={cn(
        "border border-[#344C43]/25 bg-[#EFE7DC] p-5 shadow-[5px_6px_0_rgba(52,76,67,0.13)]",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}