"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { applyTheme, readStoredTheme, themeSubscribe, getDarkSnapshot } from "@/lib/theme"

const emptySubscribe = () => () => { }

export function ThemeToggle() {
  const isMounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)
  const isDark = React.useSyncExternalStore(themeSubscribe, getDarkSnapshot, () => false)

  React.useEffect(() => {
    // `.dark` is applied pre-paint by the inline script in app/layout; keep in sync.
    applyTheme(readStoredTheme())
  }, [])

  const toggleTheme = () => applyTheme(isDark ? "light" : "dark")

  if (!isMounted) {
    return (
      <button
        type="button"
        aria-label="Toggle visual theme"
        className="relative size-11 sm:size-10 flex items-center justify-center rounded-xl border border-border bg-card/60 text-foreground/80 opacity-60 cursor-default"
      >
        <span className="size-5 sm:size-4 block rounded-full bg-foreground/20" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative size-11 sm:size-10 flex items-center justify-center rounded-xl border border-border bg-card/80 hover:bg-card text-foreground transition-all duration-200 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-2xs active:scale-95 group cursor-pointer"
    >
      <Sun
        className={`size-5 sm:size-4 transition-all duration-300 absolute ${isDark
            ? "rotate-0 scale-100 text-[#B87959] dark:text-[#C98B6D]"
            : "-rotate-90 scale-0 opacity-0"
          }`}
      />
      <Moon
        className={`size-5 sm:size-4 transition-all duration-300 absolute ${isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 text-[#344C43] dark:text-[#EFE7DC]"
          }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
