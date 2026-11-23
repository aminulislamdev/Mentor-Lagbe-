"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { underlineInput } from "./ledger-row"

export function PasswordInput({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Eight characters or more"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        className={cn(underlineInput, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-2 text-[#344C43]/45 transition-colors hover:text-[#344C43] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#344C43] dark:text-[#EFE7DC]/40 dark:hover:text-[#EFE7DC] dark:focus-visible:outline-[#EFE7DC]"
      >
        {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  )
}