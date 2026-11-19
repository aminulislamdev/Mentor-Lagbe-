import * as React from "react"
import { cn } from "cn"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block font-mono text-[10px] uppercase tracking-widest font-medium",
        "text-[#344C43]/60 dark:text-[#E8DFD0]/50",
        "mb-1.5 select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-[#B87959]" aria-hidden="true">*</span>
      )}
    </label>
  )
}

export { Label }
