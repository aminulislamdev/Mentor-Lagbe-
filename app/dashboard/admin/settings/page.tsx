"use client"

import { useEffect, useRef, useState } from "react"
import {
  Settings2, Sun, Moon, Monitor, Bell, ShieldCheck, ChevronRight,
  Check, Globe2, CheckCircle2, KeyRound, EyeOff, Laptop,
  ArrowRight, RotateCcw, Save, Server, ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardSection } from "@/components/common/dashboard-section"
import { Panel } from "@/components/common/panel"
import { Colophon } from "@/components/dashboard/shared"
import { useUserSettings, type UserSettingsPatch } from "@/lib/hooks/use-user-settings"
import { applyTheme, useTheme } from "@/lib/theme"
import type { UserSettings } from "@/lib/api-types"

// ─── Types & Registry ────────────────────────────────────────────────────────

type SectionKey = "general" | "appearance" | "notifications" | "privacy" | "platform"

const SECTIONS: Array<{ key: SectionKey; numeral: string; label: string; hint: string; Icon: typeof Settings2 }> = [
  { key: "general", numeral: "01", label: "General Preferences", hint: "Language & zone", Icon: Settings2 },
  { key: "appearance", numeral: "02", label: "Appearance", hint: "Light, dark & system", Icon: Sun },
  { key: "notifications", numeral: "03", label: "Notifications", hint: "What reaches your desk", Icon: Bell },
  { key: "privacy", numeral: "04", label: "Privacy & Security", hint: "Visibility & the vault", Icon: ShieldCheck },
  { key: "platform", numeral: "05", label: "Platform Control", hint: "Master switches", Icon: Server },
]

const LANGUAGES = ["English (US)", "বাংলা (Bangla)", "हिन्दी (Hindi)"] as const
const TIMEZONES = ["Dhaka — UTC+6 (Asia/Dhaka)", "Kolkata — UTC+5:30 (Asia/Kolkata)", "Singapore — UTC+8 (Asia/Singapore)"] as const

// `backend` = maps to a real `UserSettings.notifications.*` field.
// `registration` / `system` have NO backend field: UI-only, never sent to PATCH.
const NOTIF_ITEMS: Array<{ id: string; title: string; desc: string; on: boolean; backend?: keyof UserSettings["notifications"] }> = [
  { id: "approval", title: "Board decisions", desc: "When the board approves or rejects a listing", on: true, backend: "approval" },
  { id: "registration", title: "New user registrations", desc: "When a student or tutor joins the platform", on: true },
  { id: "system", title: "System alerts", desc: "Server health, API errors & downtime warnings", on: true },
  { id: "announcements", title: "Platform announcements", desc: "Policy updates and feature drops", on: false, backend: "announcements" },
]

const DEFAULTS = {
  maintenanceMode: false,
  registrationOpen: true,
}

// Only backend-supported Admin notification keys (subset; never send unsupported).
const BACKEND_NOTIF_KEYS = ["approval", "announcements"] as const

// UI-only prefs for unsupported Admin notifications (not persisted, not sent).
const LOCAL_NOTIF_DEFAULTS: Record<string, boolean> = Object.fromEntries(
  NOTIF_ITEMS.filter((n) => !n.backend).map((n) => [n.id, n.on])
)

// Clearly-defined UI fallback used ONLY when backend returns no `settings`.
const FALLBACK_USER_SETTINGS: UserSettings = {
  language: LANGUAGES[0],
  timezone: TIMEZONES[0],
  mode: "Offline",
  days: ["Fri", "Sat"],
  evenings: true,
  notifications: { applicant: true, status: true, approval: true, announcements: false, subscription: true },
}

function normalizeSettings(settings: UserSettings | null | undefined): UserSettings {
  if (!settings) return FALLBACK_USER_SETTINGS
  return {
    language: settings.language ?? FALLBACK_USER_SETTINGS.language,
    timezone: settings.timezone ?? FALLBACK_USER_SETTINGS.timezone,
    mode: settings.mode ?? FALLBACK_USER_SETTINGS.mode,
    days: Array.isArray(settings.days) ? [...settings.days] : [...FALLBACK_USER_SETTINGS.days],
    evenings: settings.evenings ?? FALLBACK_USER_SETTINGS.evenings,
    notifications: { ...FALLBACK_USER_SETTINGS.notifications, ...(settings.notifications ?? {}) },
  }
}

// Compare only backend-supported Admin fields.
function settingsEqual(a: UserSettings, b: UserSettings): boolean {
  return (
    a.language === b.language &&
    a.timezone === b.timezone &&
    BACKEND_NOTIF_KEYS.every((k) => a.notifications[k] === b.notifications[k])
  )
}

// Build a partial patch with ONLY changed, backend-supported fields.
function buildPatch(draft: UserSettings, baseline: UserSettings): UserSettingsPatch {
  const patch: UserSettingsPatch = {}
  if (draft.language !== baseline.language) patch.language = draft.language
  if (draft.timezone !== baseline.timezone) patch.timezone = draft.timezone

  const notifications: Partial<UserSettings["notifications"]> = {}
  for (const key of BACKEND_NOTIF_KEYS) {
    if (draft.notifications[key] !== baseline.notifications[key]) notifications[key] = draft.notifications[key]
  }
  if (Object.keys(notifications).length > 0) patch.notifications = notifications

  return patch
}

const settingsStyles = `
  .settings-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
  .settings-root ::selection { background: #B87959; color: #EFE7DC; }
  @keyframes settings-rise { from { transform: translateY(16px); } to { transform: translateY(0); } }
  .settings-rise { animation: settings-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--rise-delay, 0s); }
  @keyframes settings-ping { 0% { box-shadow: 0 0 0 0 rgba(184, 121, 89, 0.55); } 75% { box-shadow: 0 0 0 6px rgba(184, 121, 89, 0); } 100% { box-shadow: 0 0 0 0 rgba(184, 121, 89, 0); } }
  .settings-ping { animation: settings-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
  @media (prefers-reduced-motion: reduce) { .settings-rise, .settings-ping { animation: none !important; } }
`

// ─── Components ──────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, id, label, desc, disabled }: { checked: boolean; onChange: (v: boolean) => void; id: string; label: string; desc: string; disabled?: boolean; }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#344C43]/15 py-3.5 last:border-b-0">
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-sm font-semibold leading-snug tracking-tight text-[#344C43]">{label}</span>
        <span className="mt-1 block font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/55">{desc}</span>
      </label>
      <button id={id} type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]", checked ? "border-[#4A695C] bg-[#668B78]" : "border-[#344C43]/35 bg-[#344C43]/10")}>
        <span aria-hidden="true" className={cn("absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-[#EFE7DC] shadow transition-all duration-200", checked ? "left-6" : "left-1")} />
      </button>
    </div>
  )
}

function ThemePreview({ value, selected, onSelect }: { value: "light" | "dark" | "system"; selected: boolean; onSelect: () => void; }) {
  const meta = {
    light: { Icon: Sun, title: "Daylight Ledger", sub: "Warm oatmeal paper" },
    dark: { Icon: Moon, title: "Chalkboard Night", sub: "Deep pine board" },
    system: { Icon: Monitor, title: "Follow The Room", sub: "Syncs with your device" },
  }[value]

  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={`Use ${meta.title} theme`}
      className={cn("group relative flex flex-col border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]", selected ? "border-[#344C43] bg-[#EFE7DC] shadow-[4px_5px_0_#B87959]" : "border-[#344C43]/25 bg-[#EFE7DC]/60 hover:border-[#344C43]/55")}>
      <span aria-hidden="true" className="block overflow-hidden rounded-[4px] border border-black/20">
        {value === "light" && (<span className="block bg-[#F2ECDF] p-2"><span className="mb-1 block h-1.5 w-2/3 rounded-sm bg-[#344C43]/70" /><span className="block h-1 w-full rounded-sm bg-[#344C43]/15" /><span className="mt-1 block h-1 w-4/5 rounded-sm bg-[#344C43]/15" /><span className="mt-1.5 block h-2 w-1/3 rounded-sm bg-[#B87959]" /></span>)}
        {value === "dark" && (<span className="block bg-[#1E3A2F] p-2"><span className="mb-1 block h-1.5 w-2/3 rounded-sm bg-[#F2EDDF]/80" /><span className="block h-1 w-full rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1 block h-1 w-4/5 rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1.5 block h-2 w-1/3 rounded-sm bg-[#C98B6D]" /></span>)}
        {value === "system" && (<span className="flex"><span className="block flex-1 bg-[#F2ECDF] p-2"><span className="block h-1.5 w-full rounded-sm bg-[#344C43]/70" /><span className="mt-1 block h-1 w-full rounded-sm bg-[#344C43]/15" /><span className="mt-1.5 block h-2 w-2/3 rounded-sm bg-[#B87959]" /></span><span className="block flex-1 bg-[#1E3A2F] p-2"><span className="block h-1.5 w-full rounded-sm bg-[#F2EDDF]/80" /><span className="mt-1 block h-1 w-full rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1.5 block h-2 w-2/3 rounded-sm bg-[#C98B6D]" /></span></span>)}
      </span>
      <span className="mt-3 flex items-center justify-between gap-2">
        <span>
          <span className="flex items-center gap-1.5 text-sm font-bold leading-tight tracking-tight text-[#344C43]"><meta.Icon aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} />{meta.title}</span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-[#344C43]/50">{meta.sub}</span>
        </span>
        <span aria-hidden="true" className={cn("flex size-5 items-center justify-center rounded-full border transition-all", selected ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC]" : "border-[#344C43]/35 text-transparent")}><Check className="size-3" strokeWidth={3} /></span>
      </span>
    </button>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  // ── Backend-backed personal settings (reusable hook) ──
  const { settings, loading, saving, error, updateSettings, clearError } = useUserSettings()
  const { mode: themeMode } = useTheme()

  const baseline = normalizeSettings(settings)

  // local draft for backend-supported fields (no PATCH per click)
  const [overrides, setOverrides] = useState<UserSettingsPatch>({})
  // UI-only notifications with NO backend field (not persisted, not sent)
  const [localNotifications, setLocalNotifications] = useState<Record<string, boolean>>(LOCAL_NOTIF_DEFAULTS)

  // unsupported/admin-specific local state (NOT sent to /api/users/me; NOT a verified admin API)
  const [active, setActive] = useState<SectionKey>("general")
  const [maintenanceMode, setMaintenanceMode] = useState(DEFAULTS.maintenanceMode)
  const [registrationOpen, setRegistrationOpen] = useState(DEFAULTS.registrationOpen)

  const [savedFlash, setSavedFlash] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const savedTimer = useRef<number | null>(null)

  useEffect(() => () => { if (savedTimer.current !== null) window.clearTimeout(savedTimer.current) }, [])

  const draft: UserSettings = {
    ...baseline,
    ...(overrides.language !== undefined ? { language: overrides.language } : {}),
    ...(overrides.timezone !== undefined ? { timezone: overrides.timezone } : {}),
    notifications: { ...baseline.notifications, ...(overrides.notifications ?? {}) },
  }

  const { language, timezone } = draft

  // dirty = backend draft differs from saved baseline; blocked while loading/saving
  const dirty = !settingsEqual(draft, baseline)
  const controlsDisabled = loading || saving
  const canSave = dirty && !controlsDisabled

  const setScalar = <K extends "language" | "timezone">(key: K, value: string) =>
    setOverrides((prev) => ({ ...prev, [key]: value }))

  const setBackendNotification = (key: keyof UserSettings["notifications"], v: boolean) =>
    setOverrides((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: v } }))

  const handleSave = async () => {
    if (!canSave) return
    setSaveError(null); clearError()

    const patch = buildPatch(draft, baseline)
    if (Object.keys(patch).length === 0) return

    const next = await updateSettings(patch)
    const saved = Boolean(next) && !settingsEqual(normalizeSettings(next), baseline)

    if (saved) {
      setOverrides({})
      setSavedFlash(true)
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current)
      savedTimer.current = window.setTimeout(() => setSavedFlash(false), 2600)
    } else {
      setSaveError("Could not save settings. Your changes are preserved.")
    }
  }

  const handleReset = () => {
    // restore last loaded/saved backend values; no backend call
    setOverrides({}); setSaveError(null); clearError(); setSavedFlash(false)
    setLocalNotifications(LOCAL_NOTIF_DEFAULTS)
    setMaintenanceMode(DEFAULTS.maintenanceMode); setRegistrationOpen(DEFAULTS.registrationOpen)
  }

  const selectWrap = (id: string, value: string, onChange: (v: string) => void, options: readonly string[], label: string) => (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-2 block">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={controlsDisabled} className={cn("h-12 w-full appearance-none rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] pl-3 pr-9 text-sm text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20", controlsDisabled && "cursor-not-allowed opacity-60")}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronRight aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 rotate-90 text-[#344C43]/55" strokeWidth={2} />
      </div>
    </div>
  )

  return (
    <div className="settings-root relative text-[#344C43]">
      <style>{settingsStyles}</style>
      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8">

        {/* MASTHEAD */}
        <header className="border-b-2 border-[#344C43] pb-5 sm:pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#B87959] sm:text-xs">
            [ Platform Command — Workspace Configuration ]
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1 className="settings-rise settings-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]" style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}>
              Admin<span className="block"><span className="italic text-[#668B78]">Preferences.</span><span aria-hidden="true" className="text-[#B87959]">.</span></span>
            </h1>
            <div className="flex max-w-[40ch] flex-col items-start gap-2">
              <p className="text-base leading-relaxed text-[#344C43]/80">The master control panel for the platform.</p>
              {dirty && !savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#B87959]/50 bg-[#B87959]/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#B87959]"><span aria-hidden="true" className="settings-ping size-2 rounded-full bg-[#B87959]" />Unsaved changes</span>
              ) : savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#668B78]/50 bg-[#668B78]/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#4A695C]"><CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2} />Saved</span>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#344C43]/45">Everything as the board left it</span>
              )}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">

          {/* NAVIGATION */}
          <nav aria-label="Settings sections" className="min-w-0 lg:col-span-4 xl:col-span-3">
            <p className="px-1 font-mono text-[11px] uppercase tracking-[0.34em] text-[#344C43]/45">The Preferences Index</p>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {SECTIONS.map(({ key, numeral, label, hint, Icon }) => {
                const isActive = active === key
                return (
                  <li key={key} className="shrink-0 lg:shrink">
                    <button type="button" onClick={() => setActive(key)} aria-pressed={isActive} aria-current={isActive ? "true" : undefined}
                      className={cn("group flex w-full items-center gap-3 rounded-sm border border-transparent px-3 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] lg:h-auto", isActive ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[4px_4px_0_#B87959]" : "text-[#344C43]/65 hover:border-[#344C43]/25 hover:bg-[#EFE7DC]")}>
                      <span aria-hidden="true" className={cn("hidden size-9 shrink-0 flex-col items-center justify-center border sm:flex", isActive ? "border-[#C98B6D]/45 text-[#C98B6D]" : "border-[#344C43]/20 text-[#668B78]")}><Icon className="size-4" strokeWidth={1.75} /></span>
                      <span className="min-w-0">
                        <span className={cn("block whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em]", isActive ? "text-[#EFE7DC]" : "text-[#344C43]")}><span className="mr-1.5 text-[#B87959]">{numeral}</span>{label}</span>
                        <span className={cn("mt-1 hidden font-mono text-[11px] uppercase tracking-[0.18em] lg:block", isActive ? "text-[#EFE7DC]/55" : "text-[#344C43]/45")}>{hint}</span>
                      </span>
                      <ChevronRight aria-hidden="true" className={cn("ml-auto hidden size-4 shrink-0 transition-transform duration-200 lg:block", isActive ? "translate-x-0.5 text-[#C98B6D]" : "text-[#344C43]/30 group-hover:translate-x-0.5")} strokeWidth={2} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* PANEL */}
          <div className="min-w-0 lg:col-span-8 xl:col-span-9">

            {active === "general" && (
              <Panel aria-labelledby="panel-general" className="sm:p-6">
                <DashboardSection id="panel-general" numeral="01" title="General Preferences" subtitle="Admin defaults" variant="settings" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {selectWrap("f-language", language, (v) => setScalar("language", v), LANGUAGES, "Language")}
                  {selectWrap("f-timezone", timezone, (v) => setScalar("timezone", v), TIMEZONES, "Time Zone")}
                </div>
              </Panel>
            )}

            {active === "appearance" && (
              <Panel aria-labelledby="panel-appearance" className="sm:p-6">
                <DashboardSection id="panel-appearance" numeral="02" title="Appearance" subtitle="The studio light" variant="settings" />
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#344C43]/75">Pick your board. The choice syncs across the atelier.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <ThemePreview value="light" selected={themeMode === "light"} onSelect={() => applyTheme("light")} />
                  <ThemePreview value="dark" selected={themeMode === "dark"} onSelect={() => applyTheme("dark")} />
                  <ThemePreview value="system" selected={themeMode === "system"} onSelect={() => applyTheme("system")} />
                </div>
              </Panel>
            )}

            {active === "notifications" && (
              <Panel aria-labelledby="panel-notifications" className="sm:p-6">
                <DashboardSection id="panel-notifications" numeral="03" title="Notifications" subtitle="The desk bell" variant="settings" />
                <div className="mt-4">
                  {NOTIF_ITEMS.map((item) => {
                    const isBackend = !!item.backend
                    const checked = isBackend ? draft.notifications[item.backend!] : (localNotifications[item.id] ?? item.on)
                    return (
                      <Toggle
                        key={item.id}
                        id={`notif-${item.id}`}
                        label={item.title}
                        desc={item.desc}
                        checked={checked}
                        disabled={controlsDisabled && isBackend}
                        onChange={(v) => {
                          if (item.backend) setBackendNotification(item.backend, v)
                          else setLocalNotifications((prev) => ({ ...prev, [item.id]: v }))
                        }}
                      />
                    )
                  })}
                </div>
                <p className="mt-3 border-t border-[#344C43]/15 pt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/55">
                  Backend-persisted: Board decisions + Announcements. “New user registrations” and “System alerts” are UI-only and are not saved to the database.
                </p>
              </Panel>
            )}

            {active === "privacy" && (
              <Panel aria-labelledby="panel-privacy" className="sm:p-6">
                <DashboardSection id="panel-privacy" numeral="04" title="Privacy & Security" subtitle="The vault" variant="settings" />
                <fieldset className="mt-6 border border-[#344C43]/20 bg-[#F2ECDF] p-5">
                  <legend className="px-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#B87959]">Password Management</legend>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.24em] text-[#344C43]"><KeyRound aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={1.75} />••••••••••••••<EyeOff aria-hidden="true" className="size-4 text-[#344C43]/45" strokeWidth={1.75} /></p>
                      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/55">Last changed 12 Oct ’26 · 2-factor seal armed</p>
                    </div>
                    <button className="inline-flex h-11 items-center gap-2 rounded-sm border border-[#344C43]/35 px-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C]">Change Password<ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.25} /></button>
                  </div>
                </fieldset>

                <div className="mt-6">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-3">Active Sessions</p>
                  <ul className="divide-y divide-[#344C43]/15 border border-[#344C43]/20">
                    {[{ Icon: Laptop, device: "Windows · Chrome", place: "Dhaka, BD", now: true, label: "This device" }].map(({ Icon, device, place, now, label }) => (
                      <li key={device} className="flex items-center gap-3 px-4 py-4">
                        <Icon aria-hidden="true" className="size-5 shrink-0 text-[#668B78]" strokeWidth={1.75} />
                        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold tracking-tight text-[#344C43]">{device}</span><span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/55">{place}{now ? " · Active now" : ` · ${label}`}</span></span>
                        {now && <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#668B78]/55 bg-[#668B78]/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A695C]"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#668B78]" />Live</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            )}

            {/* Platform Control (Admin Only) */}
            {active === "platform" && (
              <Panel aria-labelledby="panel-platform" className="sm:p-6">
                <DashboardSection id="panel-platform" numeral="05" title="Platform Control" subtitle="Master switches" variant="settings" />
                <div className="mt-4">
                  <Toggle id="maintenance" label="Maintenance Mode" desc="Put the entire platform into read-only mode for updates" checked={maintenanceMode} onChange={setMaintenanceMode} />
                  <Toggle id="registration" label="Registration Open" desc="Allow new students and tutors to sign up" checked={registrationOpen} onChange={setRegistrationOpen} />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/55">
                  Not persisted: no verified Admin API / database field for Maintenance Mode or Registration Open. Local UI only; not sent to `/api/users/me` and not saved.
                </p>
                <div className="mt-5 rounded-sm border border-[#B87959]/40 bg-[#B87959]/10 p-5">
                  <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#B87959]"><ShieldAlert className="size-4" /> Danger Zone</p>
                  <p className="mt-2 text-sm text-[#344C43]/85">These actions will affect all users on the platform immediately.</p>
                </div>
              </Panel>
            )}

            {/* Loading / saving / error feedback */}
            {loading && (
              <p role="status" className="mt-6 border border-[#344C43]/20 bg-[#F2ECDF]/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/60">Loading saved preferences…</p>
            )}
            {(saveError || error) && !saving && (
              <p role="alert" className="mt-6 border-l-2 border-[#A34343] bg-[#A34343]/8 px-4 py-3 font-mono text-sm text-[#732626]">{saveError ?? error}</p>
            )}

            {/* Action Bar */}
            <div className="mt-6 flex flex-col-reverse gap-3 border border-[#344C43]/25 bg-[#F2ECDF]/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <button type="button" onClick={handleReset} disabled={controlsDisabled} className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-[#344C43]/30 px-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#344C43]/65 transition-all hover:border-[#A34343] hover:text-[#A34343]">
                <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} /> Reset Preferences
              </button>
              <button type="button" onClick={handleSave} disabled={!canSave} aria-busy={saving}
                className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-sm border px-6 font-mono text-xs font-bold uppercase tracking-[0.26em] transition-all duration-200",
                  savedFlash ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]" : canSave ? "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] hover:-translate-y-0.5 hover:bg-[#C98B6D]" : "cursor-not-allowed border-[#344C43]/15 bg-[#344C43]/5 text-[#344C43]/35")}>
                {savedFlash ? <><CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2} />Saved to Your Desk</> : saving ? <><Save aria-hidden="true" className="size-4 animate-pulse" strokeWidth={1.75} />Saving...</> : <><Save aria-hidden="true" className="size-4" strokeWidth={1.75} />Save Changes</>}
              </button>
            </div>

          </div>
        </div>

        <Colophon backHref="/dashboard/admin" backLabel="Back to Command Center">
          <span className="inline-flex items-center gap-1.5 text-sm"><Globe2 aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} />Dhaka · UTC+6 — The desk never sleeps</span>
        </Colophon>
      </div>
    </div>
  )
}