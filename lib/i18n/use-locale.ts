"use client"

import * as React from "react"
import { useUserSettings } from "@/lib/hooks/use-user-settings"
import { getDictionary, localeFromSetting, t as translate, type Locale } from "./index"
import type { TranslationKey } from "./types"

export function useLocale() {
  const { settings } = useUserSettings()
  const locale: Locale = localeFromSetting(settings?.language)
  const dict = React.useMemo(() => getDictionary(locale), [locale])

  const t = React.useCallback(
    (key: TranslationKey) => translate(dict, key),
    [dict]
  )

  return { locale, t }
}
