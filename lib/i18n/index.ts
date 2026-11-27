import { en } from "./en"
import { bn } from "./bn"
import type { Dictionary, TranslationKey } from "./types"

export type { Dictionary, TranslationKey }
export type Locale = "en" | "bn"

export function localeFromSetting(value: unknown): Locale {
  if (value === "bn-BD") return "bn"
  if (value === "en-US") return "en"
  return "en"
}

export function getDictionary(locale: Locale): Dictionary {
  return locale === "bn" ? bn : en
}

function lookup(source: unknown, key: string): string | undefined {
  let current: unknown = source
  for (const part of key.split(".")) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof current === "string" && current.length > 0 ? current : undefined
}

export function t(dict: Dictionary, key: TranslationKey): string {
  return lookup(dict, key) ?? lookup(en, key) ?? ""
}
