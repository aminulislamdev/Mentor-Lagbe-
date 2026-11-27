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
import { useLocale } from "@/lib/i18n/use-locale"
import type { TranslationKey } from "@/lib/i18n/types"
import { applyTheme, useTheme } from "@/lib/theme"
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, normalizeLanguage, type UserSettings } from "@/lib/api-types"

// ─── Types & Registry ────────────────────────────────────────────────────────

type SectionKey = "general" | "appearance" | "notifications" | "privacy" | "platform"

const SECTIONS: Array<{ key: SectionKey; numeral: string; labelKey: TranslationKey; hintKey: TranslationKey; Icon: typeof Settings2 }> = [
  { key: "general", numeral: "01", labelKey: "settings.general.title", hintKey: "settings.general.hint", Icon: Settings2 },
  { key: "appearance", numeral: "02", labelKey: "settings.appearance.title", hintKey: "settings.appearance.hint", Icon: Sun },
  { key: "notifications", numeral: "03", labelKey: "settings.notifications.title", hintKey: "settings.notifications.hint", Icon: Bell },
  { key: "privacy", numeral: "04", labelKey: "settings.privacy.title", hintKey: "settings.privacy.hint", Icon: ShieldCheck },
  { key: "platform", numeral: "05", labelKey: "settings.platform.title", hintKey: "settings.platform.hint", Icon: Server },
]

const LANGUAGES = SUPPORTED_LANGUAGES
const TIMEZONES = ["Dhaka — UTC+6 (Asia/Dhaka)", "Kolkata — UTC+5:30 (Asia/Kolkata)", "Singapore — UTC+8 (Asia/Singapore)"] as const

// `backend` = maps to a real `UserSettings.notifications.*` field.
// `registration` / `system` have NO backend field: UI-only, never sent to PATCH.
const NOTIF_ITEMS: Array<{ id: string; titleKey: TranslationKey; descKey: TranslationKey; on: boolean; backend?: keyof UserSettings["notifications"] }> = [
  { id: "approval", titleKey: "settings.notifications.approvalTitle", descKey: "settings.notifications.approvalDesc", on: true, backend: "approval" },
  { id: "registration", titleKey: "settings.notifications.registrationTitle", descKey: "settings.notifications.registrationDesc", on: true },
  { id: "system", titleKey: "settings.notifications.systemTitle", descKey: "settings.notifications.systemDesc", on: true },
  { id: "announcements", titleKey: "settings.notifications.announcementsTitle", descKey: "settings.notifications.announcementsDesc", on: false, backend: "announcements" },
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
    language: normalizeLanguage(settings.language),
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

function ThemePreview({ value, selected, onSelect, title, sub, ariaLabel }: { value: "light" | "dark" | "system"; selected: boolean; onSelect: () => void; title: string; sub: string; ariaLabel: string; }) {
  const Icon = { light: Sun, dark: Moon, system: Monitor }[value]

  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={ariaLabel}
      className={cn("group relative flex flex-col border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]", selected ? "border-[#344C43] bg-[#EFE7DC] shadow-[4px_5px_0_#B87959]" : "border-[#344C43]/25 bg-[#EFE7DC]/60 hover:border-[#344C43]/55")}>
      <span aria-hidden="true" className="block overflow-hidden rounded-[4px] border border-black/20">
        {value === "light" && (<span className="block bg-[#F2ECDF] p-2"><span className="mb-1 block h-1.5 w-2/3 rounded-sm bg-[#344C43]/70" /><span className="block h-1 w-full rounded-sm bg-[#344C43]/15" /><span className="mt-1 block h-1 w-4/5 rounded-sm bg-[#344C43]/15" /><span className="mt-1.5 block h-2 w-1/3 rounded-sm bg-[#B87959]" /></span>)}
        {value === "dark" && (<span className="block bg-[#1E3A2F] p-2"><span className="mb-1 block h-1.5 w-2/3 rounded-sm bg-[#F2EDDF]/80" /><span className="block h-1 w-full rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1 block h-1 w-4/5 rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1.5 block h-2 w-1/3 rounded-sm bg-[#C98B6D]" /></span>)}
        {value === "system" && (<span className="flex"><span className="block flex-1 bg-[#F2ECDF] p-2"><span className="block h-1.5 w-full rounded-sm bg-[#344C43]/70" /><span className="mt-1 block h-1 w-full rounded-sm bg-[#344C43]/15" /><span className="mt-1.5 block h-2 w-2/3 rounded-sm bg-[#B87959]" /></span><span className="block flex-1 bg-[#1E3A2F] p-2"><span className="block h-1.5 w-full rounded-sm bg-[#F2EDDF]/80" /><span className="mt-1 block h-1 w-full rounded-sm bg-[#F2EDDF]/15" /><span className="mt-1.5 block h-2 w-2/3 rounded-sm bg-[#C98B6D]" /></span></span>)}
      </span>
      <span className="mt-3 flex items-center justify-between gap-2">
        <span>
          <span className="flex items-center gap-1.5 text-sm font-bold leading-tight tracking-tight text-[#344C43]"><Icon aria-hidden="true" className="size-4 shrink-0 text-[#668B78]" strokeWidth={2} />{title}</span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-[#344C43]/50">{sub}</span>
        </span>
        <span aria-hidden="true" className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border transition-all", selected ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC]" : "border-[#344C43]/35 text-transparent")}><Check className="size-3" strokeWidth={3} /></span>
      </span>
    </button>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  // ── Backend-backed personal settings (reusable hook) ──
  const { settings, loading, saving, error, updateSettings, clearError } = useUserSettings()
  const { t } = useLocale()
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
    setOverrides((prev) => ({
      ...prev,
      [key]: key === "language" ? normalizeLanguage(value) : value,
    }))

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
      setSaveError(t("common.saveError"))
    }
  }

  const handleReset = () => {
    // restore last loaded/saved backend values; no backend call
    setOverrides({}); setSaveError(null); clearError(); setSavedFlash(false)
    setLocalNotifications(LOCAL_NOTIF_DEFAULTS)
    setMaintenanceMode(DEFAULTS.maintenanceMode); setRegistrationOpen(DEFAULTS.registrationOpen)
  }

  const selectWrap = (id: string, value: string, onChange: (v: string) => void, options: readonly string[], label: string, optionLabels?: Record<string, string>) => (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-2 block">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={controlsDisabled} className={cn("h-12 w-full appearance-none rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] pl-3 pr-9 text-sm text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20", controlsDisabled && "cursor-not-allowed opacity-60")}>
          {options.map((o) => <option key={o} value={o}>{optionLabels?.[o] ?? o}</option>)}
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
            {t("settings.eyebrow")}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1 className="settings-rise settings-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]" style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}>
              {t("settings.titlePrefix")}<span className="block"><span className="italic text-[#668B78]">{t("settings.titleHighlight")}.</span><span aria-hidden="true" className="text-[#B87959]">.</span></span>
            </h1>
            <div className="flex max-w-[40ch] flex-col items-start gap-2">
              <p className="text-base leading-relaxed text-[#344C43]/80">{t("settings.subtitle")}</p>
              {dirty && !savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#B87959]/50 bg-[#B87959]/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#B87959]"><span aria-hidden="true" className="settings-ping size-2 rounded-full bg-[#B87959]" />{t("common.unsavedChanges")}</span>
              ) : savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#668B78]/50 bg-[#668B78]/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#4A695C]"><CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2} />{t("common.saved")}</span>
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#344C43]/45">{t("settings.everything")}</span>
              )}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">

          {/* NAVIGATION */}
          <nav aria-label={t("settings.navAria")} className="min-w-0 lg:col-span-4 xl:col-span-3">
            <p className="px-1 font-mono text-[11px] uppercase tracking-[0.34em] text-[#344C43]/45">{t("settings.indexTitle")}</p>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {SECTIONS.map(({ key, numeral, labelKey, hintKey, Icon }) => {
                const isActive = active === key
                return (
                  <li key={key} className="shrink-0 lg:shrink">
                    <button type="button" onClick={() => setActive(key)} aria-pressed={isActive} aria-current={isActive ? "true" : undefined}
                      className={cn("group flex w-full items-center gap-3 rounded-sm border border-transparent px-3 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] lg:h-auto", isActive ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[4px_4px_0_#B87959]" : "text-[#344C43]/65 hover:border-[#344C43]/25 hover:bg-[#EFE7DC]")}>
                      <span aria-hidden="true" className={cn("hidden size-9 shrink-0 flex-col items-center justify-center border sm:flex", isActive ? "border-[#C98B6D]/45 text-[#C98B6D]" : "border-[#344C43]/20 text-[#668B78]")}><Icon className="size-4" strokeWidth={1.75} /></span>
                      <span className="min-w-0">
                        <span className={cn("block whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em] lg:whitespace-normal", isActive ? "text-[#EFE7DC]" : "text-[#344C43]")}><span className="mr-1.5 text-[#B87959]">{numeral}</span>{t(labelKey)}</span>
                        <span className={cn("mt-1 hidden font-mono text-[11px] uppercase tracking-[0.18em] lg:block", isActive ? "text-[#EFE7DC]/55" : "text-[#344C43]/45")}>{t(hintKey)}</span>
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
                <DashboardSection id="panel-general" numeral="01" title={t("settings.general.title")} subtitle={t("settings.general.subtitle")} variant="settings" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {selectWrap("f-language", language, (v) => setScalar("language", v), LANGUAGES, t("settings.general.languageLabel"), LANGUAGE_LABELS)}
                  {selectWrap("f-timezone", timezone, (v) => setScalar("timezone", v), TIMEZONES, t("settings.general.timezoneLabel"))}
                </div>
              </Panel>
            )}

            {active === "appearance" && (
              <Panel aria-labelledby="panel-appearance" className="sm:p-6">
                <DashboardSection id="panel-appearance" numeral="02" title={t("settings.appearance.title")} subtitle={t("settings.appearance.subtitle")} variant="settings" />
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#344C43]/75">{t("settings.appearance.description")}</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <ThemePreview value="light" selected={themeMode === "light"} onSelect={() => applyTheme("light")} title={t("settings.appearance.light.title")} sub={t("settings.appearance.light.sub")} ariaLabel={t("settings.appearance.light.aria")} />
                  <ThemePreview value="dark" selected={themeMode === "dark"} onSelect={() => applyTheme("dark")} title={t("settings.appearance.dark.title")} sub={t("settings.appearance.dark.sub")} ariaLabel={t("settings.appearance.dark.aria")} />
                  <ThemePreview value="system" selected={themeMode === "system"} onSelect={() => applyTheme("system")} title={t("settings.appearance.system.title")} sub={t("settings.appearance.system.sub")} ariaLabel={t("settings.appearance.system.aria")} />
                </div>
              </Panel>
            )}

            {active === "notifications" && (
              <Panel aria-labelledby="panel-notifications" className="sm:p-6">
                <DashboardSection id="panel-notifications" numeral="03" title={t("settings.notifications.title")} subtitle={t("settings.notifications.subtitle")} variant="settings" />
                <div className="mt-4">
                  {NOTIF_ITEMS.map((item) => {
                    const isBackend = !!item.backend
                    const checked = isBackend ? draft.notifications[item.backend!] : (localNotifications[item.id] ?? item.on)
                    return (
                      <Toggle
                        key={item.id}
                        id={`notif-${item.id}`}
                        label={t(item.titleKey)}
                        desc={t(item.descKey)}
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
                  {t("settings.notifications.note")}
                </p>
              </Panel>
            )}

            {active === "privacy" && (
              <Panel aria-labelledby="panel-privacy" className="sm:p-6">
                <DashboardSection id="panel-privacy" numeral="04" title={t("settings.privacy.title")} subtitle={t("settings.privacy.subtitle")} variant="settings" />
                <fieldset className="mt-6 border border-[#344C43]/20 bg-[#F2ECDF] p-5">
                  <legend className="px-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#B87959]">{t("settings.privacy.passwordLegend")}</legend>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2 font-mono text-sm font-bold tracking-[0.24em] text-[#344C43]"><KeyRound aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={1.75} />••••••••••••••<EyeOff aria-hidden="true" className="size-4 text-[#344C43]/45" strokeWidth={1.75} /></p>
                      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/55">{t("settings.privacy.passwordMeta")}</p>
                    </div>
                    <button className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-[#344C43]/35 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C]">{t("settings.privacy.changePassword")}<ArrowRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.25} /></button>
                  </div>
                </fieldset>

                <div className="mt-6">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-3">{t("settings.privacy.activeSessions")}</p>
                  <ul className="divide-y divide-[#344C43]/15 border border-[#344C43]/20">
                    {[{ Icon: Laptop, device: t("settings.privacy.sessionDevice"), place: t("settings.privacy.sessionPlace"), now: true, label: t("settings.privacy.thisDevice") }].map(({ Icon, device, place, now, label }) => (
                      <li key={device} className="flex items-center gap-3 px-4 py-4">
                        <Icon aria-hidden="true" className="size-5 shrink-0 text-[#668B78]" strokeWidth={1.75} />
                        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold tracking-tight text-[#344C43]">{device}</span><span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/55">{place}{now ? ` · ${t("settings.privacy.activeNow")}` : ` · ${label}`}</span></span>
                        {now && <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#668B78]/55 bg-[#668B78]/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A695C]"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#668B78]" />{t("settings.privacy.live")}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            )}

            {/* Platform Control (Admin Only) */}
            {active === "platform" && (
              <Panel aria-labelledby="panel-platform" className="sm:p-6">
                <DashboardSection id="panel-platform" numeral="05" title={t("settings.platform.title")} subtitle={t("settings.platform.subtitle")} variant="settings" />
                <div className="mt-4">
                  <Toggle id="maintenance" label={t("settings.platform.maintenanceLabel")} desc={t("settings.platform.maintenanceDesc")} checked={maintenanceMode} onChange={setMaintenanceMode} />
                  <Toggle id="registration" label={t("settings.platform.registrationLabel")} desc={t("settings.platform.registrationDesc")} checked={registrationOpen} onChange={setRegistrationOpen} />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/55">
                  {t("settings.platform.note")}
                </p>
                <div className="mt-5 rounded-sm border border-[#B87959]/40 bg-[#B87959]/10 p-5">
                  <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-[#B87959]"><ShieldAlert className="size-4 shrink-0" /> {t("settings.platform.dangerTitle")}</p>
                  <p className="mt-2 text-sm text-[#344C43]/85">{t("settings.platform.dangerDesc")}</p>
                </div>
              </Panel>
            )}

            {/* Loading / saving / error feedback */}
            {loading && (
              <p role="status" className="mt-6 border border-[#344C43]/20 bg-[#F2ECDF]/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#344C43]/60">{t("common.loadingPreferences")}</p>
            )}
            {(saveError || error) && !saving && (
              <p role="alert" className="mt-6 border-l-2 border-[#A34343] bg-[#A34343]/8 px-4 py-3 font-mono text-sm text-[#732626]">{saveError ?? error}</p>
            )}

            {/* Action Bar */}
            <div className="mt-6 flex flex-col-reverse gap-3 border border-[#344C43]/25 bg-[#F2ECDF]/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <button type="button" onClick={handleReset} disabled={controlsDisabled} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#344C43]/30 px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#344C43]/65 transition-all hover:border-[#A34343] hover:text-[#A34343]">
                <RotateCcw aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} /> {t("common.resetPreferences")}
              </button>
              <button type="button" onClick={handleSave} disabled={!canSave} aria-busy={saving}
                className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border px-6 py-2 font-mono text-xs font-bold uppercase tracking-[0.26em] transition-all duration-200",
                  savedFlash ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]" : canSave ? "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] hover:-translate-y-0.5 hover:bg-[#C98B6D]" : "cursor-not-allowed border-[#344C43]/15 bg-[#344C43]/5 text-[#344C43]/35")}>
                {savedFlash ? <><CheckCircle2 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />{t("common.savedToDesk")}</> : saving ? <><Save aria-hidden="true" className="size-4 shrink-0 animate-pulse" strokeWidth={1.75} />{t("common.saving")}</> : <><Save aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />{t("common.save")}</>}
              </button>
            </div>

          </div>
        </div>

        <Colophon backHref="/dashboard/admin" backLabel={t("settings.backToCommandCenter")}>
          <span className="inline-flex items-center gap-1.5 text-sm"><Globe2 aria-hidden="true" className="size-4 shrink-0 text-[#668B78]" strokeWidth={2} />{t("settings.colophonText")}</span>
        </Colophon>
      </div>
    </div>
  )
}