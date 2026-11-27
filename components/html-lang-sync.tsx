"use client"

import { useEffect } from "react"
import { useLocale } from "@/lib/i18n/use-locale"

export function HtmlLangSync() {
  const { locale } = useLocale()

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    if (locale === "bn") {
      root.style.fontFamily = "var(--font-noto-bengali), var(--font-geist-sans), sans-serif"
    } else {
      root.style.fontFamily = ""
    }
  }, [locale])

  return null
}
