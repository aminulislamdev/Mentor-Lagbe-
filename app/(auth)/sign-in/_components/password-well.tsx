"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { wellInput } from "./night-styles"

export function PasswordWell({
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
    <div className="relative w-full">
      <Lock
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#C98B6D]/70 sm:left-4 sm:size-4.5"
        strokeWidth={1.75}
      />
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder="Your passphrase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        className={wellInput}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[#EFE7DC]/40 transition-colors hover:text-[#EFE7DC]/80 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-[#C98B6D] sm:right-3"
      >
        {show ? <EyeOff className="size-4 sm:size-4.5" /> : <Eye className="size-4 sm:size-4.5" />}
      </button>
    </div>
  )
}