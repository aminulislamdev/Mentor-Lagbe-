"use client"

// Reusable user-settings hook.
//
// - GET  /api/auth/me        → reads `user.settings`. Reuses existing
//   `getCurrentUser` (it already attaches auth + reads `user`; note
//   `/api/auth/me` returns `{ user }`, NOT `{ success, data }`, so `apiFetch`'s
//   `.data` unwrapping can't be used for this endpoint). `getCurrentUser`
//   swallows network errors → we surface a generic `error` and never wipe
//   existing settings on a failed refresh.
// - PATCH /api/users/me      → `{ settings: {...partial} }` via existing `apiFetch`.
//
// Partial updates: only supplied keys are sent; nested `notifications` are sent
// partially + merged; backend uses `$set` dot-notation so unrelated settings are
// preserved. Local state updates only after successful save. No localStorage; no
// fake data; no `any`. React-strict-mode safe; no setState-in-effect.

import * as React from "react"
import { apiFetch, getCurrentUser, ApiError } from "@/lib/api"
import type { CurrentUser, UserSettings } from "@/lib/api-types"

type NotificationPrefs = UserSettings["notifications"]
type NotificationKey = keyof NotificationPrefs

const NOTIFICATION_KEYS: NotificationKey[] = [
  "applicant",
  "status",
  "approval",
  "announcements",
  "subscription",
]

const SCALAR_KEYS = ["language", "timezone", "mode", "days", "evenings"] as const

/** Partial settings; nested `notifications` may itself be partial. */
export type UserSettingsPatch = {
  language?: string
  timezone?: string
  mode?: string
  days?: string[]
  evenings?: boolean
  notifications?: Partial<NotificationPrefs>
}

export interface UseUserSettingsResult {
  settings: UserSettings | null
  loading: boolean
  saving: boolean
  error: string | null
  refresh: () => Promise<void>
  updateSettings: (patch: UserSettingsPatch) => Promise<UserSettings | null>
  clearError: () => void
}

function messageOf(cause: unknown, fallback: string): string {
  if (cause instanceof ApiError) return cause.message
  if (cause instanceof Error) return cause.message
  return fallback
}

// Build a request body containing ONLY supplied keys (undefined dropped).
function sanitizePatch(patch: UserSettingsPatch): UserSettingsPatch {
  const out: UserSettingsPatch = {}

  for (const key of SCALAR_KEYS) {
    const value = patch[key]
    if (value !== undefined) {
      ;(out as Record<string, unknown>)[key] =
        key === "days" && Array.isArray(value) ? [...value] : value
    }
  }

  if (patch.notifications) {
    const notifications: Partial<NotificationPrefs> = {}
    for (const key of NOTIFICATION_KEYS) {
      const value = patch.notifications[key]
      if (value !== undefined) notifications[key] = value
    }
    if (Object.keys(notifications).length > 0) out.notifications = notifications
  }

  return out
}

// Merge a partial patch onto current settings; preserve unrelated + nested keys.
function mergeSettings(current: UserSettings, patch: UserSettingsPatch): UserSettings {
  const next: UserSettings = {
    ...current,
    ...(patch.language !== undefined ? { language: patch.language } : {}),
    ...(patch.timezone !== undefined ? { timezone: patch.timezone } : {}),
    ...(patch.mode !== undefined ? { mode: patch.mode } : {}),
    ...(patch.days !== undefined ? { days: [...patch.days] } : {}),
    ...(patch.evenings !== undefined ? { evenings: patch.evenings } : {}),
    notifications: { ...current.notifications },
  }

  if (patch.notifications) {
    for (const key of NOTIFICATION_KEYS) {
      const value = patch.notifications[key]
      if (value !== undefined) next.notifications[key] = value
    }
  }

  return next
}

function readSettings(data: unknown): UserSettings | null {
  if (data && typeof data === "object" && "settings" in data) {
    return (data as { settings?: UserSettings | null }).settings ?? null
  }
  return null
}

export function useUserSettings(): UseUserSettingsResult {
  const [settings, setSettings] = React.useState<UserSettings | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [saving, setSaving] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const settingsRef = React.useRef<UserSettings | null>(null)
  const savingRef = React.useRef<boolean>(false)
  const fetchInFlight = React.useRef<boolean>(false)
  const mountedRef = React.useRef<boolean>(true)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  React.useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const applyUser = React.useCallback((user: CurrentUser | null) => {
    if (user) {
      const next = user.settings ?? null
      setSettings(next)
      settingsRef.current = next
      setError(null)
    } else {
      setError("Could not load settings.") // do not wipe existing settings
    }
  }, [])

  // initial fetch once; setState only inside promise callbacks (not effect body)
  React.useEffect(() => {
    if (fetchInFlight.current) return
    fetchInFlight.current = true

    let active = true
    getCurrentUser()
      .then((user) => {
        if (!active || !mountedRef.current) return
        applyUser(user)
      })
      .catch(() => {
        if (active && mountedRef.current) setError("Could not load settings.")
      })
      .finally(() => {
        fetchInFlight.current = false
        if (active && mountedRef.current) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [applyUser])

  const refresh = React.useCallback(async () => {
    if (fetchInFlight.current) return
    fetchInFlight.current = true
    setLoading(true)

    try {
      const user = await getCurrentUser()
      if (mountedRef.current) applyUser(user)
    } catch {
      if (mountedRef.current) setError("Could not load settings.")
    } finally {
      fetchInFlight.current = false
      if (mountedRef.current) setLoading(false)
    }
  }, [applyUser])

  const clearError = React.useCallback(() => setError(null), [])

  const updateSettings = React.useCallback(
    async (patch: UserSettingsPatch): Promise<UserSettings | null> => {
      const body = sanitizePatch(patch)
      if (Object.keys(body).length === 0) return settingsRef.current

      if (savingRef.current) {
        setError("A settings update is already in progress.")
        return settingsRef.current
      }

      savingRef.current = true
      setSaving(true)
      setError(null)

      try {
        // existing `apiFetch`: auth + JSON + 401 retry; server returns { success, data }
        const result = await apiFetch<{ settings?: UserSettings | null }>("/api/users/me", {
          method: "PATCH",
          body: { settings: body },
        })

        if (!mountedRef.current) return settingsRef.current

        const current = settingsRef.current
        const returned = readSettings(result.data)
        const next = returned ?? (current ? mergeSettings(current, patch) : current)

        setSettings(next)
        settingsRef.current = next
        setError(null)
        return next
      } catch (cause) {
        if (mountedRef.current) setError(messageOf(cause, "Could not save settings."))
        return settingsRef.current // keep existing settings on failure
      } finally {
        savingRef.current = false
        if (mountedRef.current) setSaving(false)
      }
    },
    []
  )

  return { settings, loading, saving, error, refresh, updateSettings, clearError }
}
