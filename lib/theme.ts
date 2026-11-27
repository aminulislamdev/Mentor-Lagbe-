"use client"

// Single source of truth for the existing `.dark` + `localStorage["theme"]`
// theme system. No provider, no second system, no backend, no `.env`.
//
// `app/layout.tsx` applies the theme before first paint. `ThemeToggle` and
// Settings `ThemePreview` both call `applyTheme`, which toggles `.dark`,
// sets `color-scheme`, persists, and notifies listeners (MutationObserver +
// `storage`). `useTheme` reads the live state via `useSyncExternalStore`.

import * as React from "react"

export type ThemeMode = "light" | "dark" | "system"

export function prefersDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system"
  const stored = window.localStorage.getItem("theme")
  if (stored === "dark" || stored === "light") return stored
  return "system"
}

export function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true
  if (mode === "light") return false
  return prefersDark()
}

/** Apply + persist a theme mode. Safe to call from anywhere. */
export function applyTheme(mode: ThemeMode): void {
  if (typeof window === "undefined") return

  // `system` = no explicit choice; rely on OS preference (clears stored value).
  if (mode === "system") window.localStorage.removeItem("theme")
  else window.localStorage.setItem("theme", mode)

  const dark = resolveDark(mode)
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
  // `storage` fires cross-tab; `MutationObserver` on `class` fires in-tab.
}

export function themeSubscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("storage", callback)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) if (m.attributeName === "class") callback()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => {
    window.removeEventListener("storage", callback)
    observer.disconnect()
  }
}

export function getDarkSnapshot(): boolean {
  if (typeof document === "undefined") return false
  return document.documentElement.classList.contains("dark")
}

export function useTheme() {
  const isDark = React.useSyncExternalStore(themeSubscribe, getDarkSnapshot, () => false)
  const mode = React.useSyncExternalStore(themeSubscribe, readStoredTheme, () => "system" as ThemeMode)
  return { isDark, mode, applyTheme }
}
