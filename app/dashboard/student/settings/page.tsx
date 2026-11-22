"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Settings2, Sun, Moon, Monitor, Bell, ShieldCheck, Crown, ChevronRight,
  Check, Globe2, Presentation, CalendarDays, CheckCircle2, KeyRound, EyeOff,
  Laptop, Smartphone, CreditCard, FileText, ArrowRight, RotateCcw, Save,
  Sparkles, BadgeCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardSection } from "@/components/common/dashboard-section"
import { Panel } from "@/components/common/panel"
import { Colophon } from "@/components/dashboard/shared"

// ─── Types & Registry ────────────────────────────────────────────────────────

type SectionKey = "general" | "appearance" | "notifications" | "privacy" | "subscription"

const SECTIONS: Array<{ key: SectionKey; numeral: string; label: string; hint: string; Icon: typeof Settings2 }> = [
  { key: "general", numeral: "01", label: "General Preferences", hint: "Language, zone & mode", Icon: Settings2 },
  { key: "appearance", numeral: "02", label: "Appearance", hint: "Light, dark & system", Icon: Sun },
  { key: "notifications", numeral: "03", label: "Notifications", hint: "What reaches your desk", Icon: Bell },
  { key: "privacy", numeral: "04", label: "Privacy & Security", hint: "Visibility & the vault", Icon: ShieldCheck },
  { key: "subscription", numeral: "05", label: "Subscription", hint: "Your learning plan", Icon: Crown },
]

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
const LANGUAGES = ["English (US)", "বাংলা (Bangla)", "हिन्दी (Hindi)"] as const
const TIMEZONES = ["Dhaka — UTC+6 (Asia/Dhaka)", "Kolkata — UTC+5:30 (Asia/Kolkata)", "Singapore — UTC+8 (Asia/Singapore)"] as const
const MODES = ["Offline", "Online", "Hybrid"] as const

const NOTIF_ITEMS = [
  { id: "messages", title: "New messages", desc: "When someone reaches out to you", on: true },
  { id: "status", title: "Tuition status updates", desc: "When a tuition you applied for changes status", on: true },
  { id: "reminders", title: "Session reminders", desc: "15 minutes before a scheduled session", on: true },
  { id: "announcements", title: "Platform announcements", desc: "Policy updates and feature drops", on: false },
]

const DEFAULTS = {
  language: LANGUAGES[0],
  timezone: TIMEZONES[0],
  mode: MODES[0] as (typeof MODES)[number],
  days: new Set<string>(["Mon", "Wed", "Fri"]),
  theme: "system" as "light" | "dark" | "system",
  notifications: Object.fromEntries(NOTIF_ITEMS.map((n) => [n.id, n.on])) as Record<string, boolean>,
  profileVisibility: "Tutors only",
  emailVisibility: "Tutors only",
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

function Toggle({ checked, onChange, id, label, desc }: { checked: boolean; onChange: (v: boolean) => void; id: string; label: string; desc: string; }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#344C43]/15 py-3.5 last:border-b-0">
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-[13px] font-semibold leading-snug tracking-tight text-[#344C43]">{label}</span>
        <span className="mt-0.5 block font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-[#344C43]/55">{desc}</span>
      </label>
      <button id={id} type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
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
      <span className="mt-2.5 flex items-center justify-between gap-2">
        <span>
          <span className="flex items-center gap-1.5 text-[12px] font-bold leading-tight tracking-tight text-[#344C43]"><meta.Icon aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />{meta.title}</span>
          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#344C43]/50">{meta.sub}</span>
        </span>
        <span aria-hidden="true" className={cn("flex size-5 items-center justify-center rounded-full border transition-all", selected ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC]" : "border-[#344C43]/35 text-transparent")}><Check className="size-3" strokeWidth={3} /></span>
      </span>
    </button>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StudentSettingsPage() {
  const [active, setActive] = useState<SectionKey>("general")
  const [language, setLanguage] = useState<string>(DEFAULTS.language)
  const [timezone, setTimezone] = useState<string>(DEFAULTS.timezone)
  const [mode, setMode] = useState(DEFAULTS.mode)
  const [days, setDays] = useState<Set<string>>(new Set(DEFAULTS.days))
  const [theme, setTheme] = useState(DEFAULTS.theme)
  const [notifications, setNotifications] = useState(DEFAULTS.notifications)
  const [profileVisibility, setProfileVisibility] = useState(DEFAULTS.profileVisibility)
  const [emailVisibility, setEmailVisibility] = useState(DEFAULTS.emailVisibility)
  const [savedFlash, setSavedFlash] = useState(false)

  const dirty = useMemo(() => {
    if (language !== DEFAULTS.language) return true
    if (timezone !== DEFAULTS.timezone) return true
    if (mode !== DEFAULTS.mode) return true
    if (theme !== DEFAULTS.theme) return true
    if (profileVisibility !== DEFAULTS.profileVisibility) return true
    if (emailVisibility !== DEFAULTS.emailVisibility) return true
    if ([...days].join() !== [...DEFAULTS.days].join()) return true
    return NOTIF_ITEMS.some((n) => notifications[n.id] !== DEFAULTS.notifications[n.id])
  }, [language, timezone, mode, days, theme, notifications, profileVisibility, emailVisibility])

  const toggleDay = (d: string) => setDays((prev) => { const next = new Set(prev); if (next.has(d)) next.delete(d); else next.add(d); return next })
  const handleSave = () => { setSavedFlash(true); window.setTimeout(() => setSavedFlash(false), 2600) }
  const handleReset = () => {
    setLanguage(DEFAULTS.language); setTimezone(DEFAULTS.timezone); setMode(DEFAULTS.mode); setDays(new Set(DEFAULTS.days));
    setTheme(DEFAULTS.theme); setNotifications(DEFAULTS.notifications); setProfileVisibility(DEFAULTS.profileVisibility); setEmailVisibility(DEFAULTS.emailVisibility);
  }

  const selectWrap = (id: string, value: string, onChange: (v: string) => void, options: readonly string[], label: string) => (
    <div>
      <label htmlFor={id} className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-1.5 block">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full appearance-none rounded-sm border border-[#344C43]/25 bg-[#F2ECDF] pl-3 pr-9 text-[13px] text-[#344C43] outline-none transition-all hover:border-[#344C43]/45 focus:border-[#668B78] focus:ring-2 focus:ring-[#668B78]/20">
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
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#B87959] sm:text-[10px]">
            [ The Student Register — Workspace Configuration ]
          </p>
          <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <h1 className="settings-rise settings-serif font-black leading-[0.9] tracking-[-0.035em] text-[#344C43]" style={{ "--rise-delay": "0s", fontSize: "clamp(2.5rem, 5.8vw, 4.25rem)" } as React.CSSProperties}>
              Learning<span className="block"><span className="italic text-[#668B78]">Preferences.</span><span aria-hidden="true" className="text-[#B87959]">.</span></span>
            </h1>
            <div className="flex max-w-[40ch] flex-col items-start gap-2">
              <p className="text-sm leading-relaxed text-[#344C43]/80">The desk behind your desk — how you learn, when you study, and how you stay updated.</p>
              {dirty && !savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#B87959]/50 bg-[#B87959]/10 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#B87959]"><span aria-hidden="true" className="settings-ping size-2 rounded-full bg-[#B87959]" />Unsaved changes</span>
              ) : savedFlash ? (
                <span role="status" className="inline-flex items-center gap-2 rounded-sm border border-[#668B78]/50 bg-[#668B78]/10 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#4A695C]"><CheckCircle2 aria-hidden="true" className="size-3.5" strokeWidth={2} />Saved</span>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#344C43]/45">Everything as the board left it</span>
              )}
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-12 lg:items-start">

          {/* NAVIGATION */}
          <nav aria-label="Settings sections" className="min-w-0 lg:col-span-4 xl:col-span-3">
            <p className="px-1 font-mono text-[9px] uppercase tracking-[0.34em] text-[#344C43]/45">The Preferences Index</p>
            <ul className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {SECTIONS.map(({ key, numeral, label, hint, Icon }) => {
                const isActive = active === key
                return (
                  <li key={key} className="shrink-0 lg:shrink">
                    <button type="button" onClick={() => setActive(key)} aria-pressed={isActive} aria-current={isActive ? "true" : undefined}
                      className={cn("group flex w-full items-center gap-3 rounded-sm border border-transparent px-3 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] lg:h-auto", isActive ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[4px_4px_0_#B87959]" : "text-[#344C43]/65 hover:border-[#344C43]/25 hover:bg-[#EFE7DC]")}>
                      <span aria-hidden="true" className={cn("hidden size-9 shrink-0 flex-col items-center justify-center border sm:flex", isActive ? "border-[#C98B6D]/45 text-[#C98B6D]" : "border-[#344C43]/20 text-[#668B78]")}><Icon className="size-4" strokeWidth={1.75} /></span>
                      <span className="min-w-0">
                        <span className={cn("block whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.2em]", isActive ? "text-[#EFE7DC]" : "text-[#344C43]")}><span className="mr-1.5 text-[#B87959]">{numeral}</span>{label}</span>
                        <span className={cn("mt-0.5 hidden font-mono text-[10px] uppercase tracking-[0.18em] lg:block", isActive ? "text-[#EFE7DC]/55" : "text-[#344C43]/45")}>{hint}</span>
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
                <DashboardSection id="panel-general" numeral="01" title="General Preferences" subtitle="Desk defaults" variant="settings" />
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {selectWrap("f-language", language, setLanguage, LANGUAGES, "Language")}
                  {selectWrap("f-timezone", timezone, setTimezone, TIMEZONES, "Time Zone")}
                </div>

                <fieldset className="mt-5">
                  <legend className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-1.5">Preferred Learning Mode</legend>
                  <div role="group" aria-label="Preferred learning mode" className="grid grid-cols-3 gap-1.5">
                    {MODES.map((m) => {
                      const on = mode === m
                      return (
                        <button key={m} type="button" aria-pressed={on} onClick={() => setMode(m)}
                          className={cn("flex h-11 items-center justify-center gap-1.5 border font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]", on ? "border-[#344C43] bg-[#344C43] text-[#EFE7DC] shadow-[3px_3px_0_#B87959]" : "border-[#344C43]/25 text-[#344C43]/60 hover:border-[#344C43]/55 hover:text-[#344C43]")}>
                          <Presentation aria-hidden="true" className="size-4" strokeWidth={1.75} />{m}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-1.5">Preferred Study Days</legend>
                  <div role="group" aria-label="Days you study" className="flex flex-wrap gap-1.5">
                    {DAYS.map((d) => {
                      const on = days.has(d)
                      return (
                        <button key={d} type="button" aria-pressed={on} onClick={() => toggleDay(d)}
                          className={cn("flex h-10 w-12 items-center justify-center border font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43] sm:w-14", on ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]" : "border-[#344C43]/25 text-[#344C43]/60 hover:border-[#668B78] hover:text-[#4A695C]")}>
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </Panel>
            )}

            {active === "appearance" && (
              <Panel aria-labelledby="panel-appearance" className="sm:p-6">
                <DashboardSection id="panel-appearance" numeral="02" title="Appearance" subtitle="The studio light" variant="settings" />
                <p className="mt-4 max-w-md text-[12px] leading-relaxed text-[#344C43]/75">Pick your board. The choice syncs across the atelier.</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <ThemePreview value="light" selected={theme === "light"} onSelect={() => setTheme("light")} />
                  <ThemePreview value="dark" selected={theme === "dark"} onSelect={() => setTheme("dark")} />
                  <ThemePreview value="system" selected={theme === "system"} onSelect={() => setTheme("system")} />
                </div>
              </Panel>
            )}

            {active === "notifications" && (
              <Panel aria-labelledby="panel-notifications" className="sm:p-6">
                <DashboardSection id="panel-notifications" numeral="03" title="Notifications" subtitle="The desk bell" variant="settings" />
                <div className="mt-3">
                  {NOTIF_ITEMS.map((item) => (
                    <Toggle key={item.id} id={`notif-${item.id}`} label={item.title} desc={item.desc} checked={notifications[item.id]} onChange={(v) => setNotifications((prev) => ({ ...prev, [item.id]: v }))} />
                  ))}
                </div>
              </Panel>
            )}

            {active === "privacy" && (
              <Panel aria-labelledby="panel-privacy" className="sm:p-6">
                <DashboardSection id="panel-privacy" numeral="04" title="Privacy & Security" subtitle="The vault" variant="settings" />
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {selectWrap("f-profile-visibility", profileVisibility, setProfileVisibility, ["Tutors only", "Everyone on the index", "No one — fully private"], "Profile Visibility")}
                  {selectWrap("f-email-visibility", emailVisibility, setEmailVisibility, ["Tutors only", "Everyone", "No one"], "Email Visibility")}
                </div>

                <fieldset className="mt-5 border border-[#344C43]/20 bg-[#F2ECDF] p-4">
                  <legend className="px-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#B87959]">Password Management</legend>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.24em] text-[#344C43]"><KeyRound aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={1.75} />••••••••••••••<EyeOff aria-hidden="true" className="size-3.5 text-[#344C43]/45" strokeWidth={1.75} /></p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">Last changed 12 Oct ’26 · 2-factor seal armed</p>
                    </div>
                    <button className="inline-flex h-10 items-center gap-2 rounded-sm border border-[#344C43]/35 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43] transition-all hover:border-[#668B78] hover:text-[#4A695C]">Change Password<ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.25} /></button>
                  </div>
                </fieldset>

                <div className="mt-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#344C43]/60 mb-2">Active Sessions</p>
                  <ul className="divide-y divide-[#344C43]/15 border border-[#344C43]/20">
                    {[{ Icon: Laptop, device: "Windows · Chrome", place: "Dhaka, BD", now: true, label: "This device" }, { Icon: Smartphone, device: "iPhone 15 · Safari", place: "Dhaka, BD", now: false, label: "Tuesday, 14:20" }].map(({ Icon, device, place, now, label }) => (
                      <li key={device} className="flex items-center gap-3 px-4 py-3">
                        <Icon aria-hidden="true" className="size-5 shrink-0 text-[#668B78]" strokeWidth={1.75} />
                        <span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold tracking-tight text-[#344C43]">{device}</span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">{place}{now ? " · Active now" : ` · ${label}`}</span></span>
                        {now ? <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#668B78]/55 bg-[#668B78]/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#4A695C]"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#668B78]" />Live</span> : <button type="button" className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#A34343] underline decoration-[#A34343]/40 underline-offset-4 hover:text-[#8f3838]">Revoke</button>}
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            )}

            {active === "subscription" && (
              <Panel aria-labelledby="panel-subscription" className="sm:p-6">
                <DashboardSection id="panel-subscription" numeral="05" title="Subscription" subtitle="Your learning plan" variant="settings" />
                <div className="relative mt-5 border border-[#C98B6D]/50 bg-[#243630] p-4 text-[#F2EDDF] sm:p-5" style={{ backgroundImage: "linear-gradient(150deg, rgba(201,139,109,0.14) 0%, transparent 45%)" }}>
                  <span aria-hidden="true" className="absolute right-4 top-4 select-none text-xl leading-none text-[#C98B6D]/75">✦</span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#C98B6D]"><Crown aria-hidden="true" className="size-4" strokeWidth={1.75} />Student Pro</span>
                    <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#7AA890]/45 bg-[#668B78]/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#9DBFA9]"><span aria-hidden="true" className="size-1.5 rounded-full bg-[#7AA890]" />Active</span>
                  </div>
                  <p className="settings-serif mt-3 text-3xl font-black leading-none tracking-tight">$10<span className="text-base font-bold text-[#F2EDDF]/55"> / mo</span></p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-[#F2EDDF]/50">Membership — renews 01 Dec ’26 · Invoice ML-2042 · Stripe</p>
                  <ul className="mt-3 grid grid-cols-1 gap-1.5 border-t border-[#F2EDDF]/12 pt-3 font-mono text-[9px] uppercase leading-snug tracking-[0.16em] text-[#F2EDDF]/72 sm:grid-cols-2">
                    {["Unlimited tuition applications", "Priority messaging", "Verified student seal", "Session analytics"].map((b) => (
                      <li key={b} className="flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0 text-[#C98B6D]" strokeWidth={2} />{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-col items-start justify-between gap-4 border border-[#B87959]/50 bg-[#B87959]/10 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#B87959]"><Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />Upgrade to Pro · $10/mo</p>
                    <p className="mt-1.5 max-w-md text-[12px] leading-snug text-[#344C43]/85">Free students wait in line for applications. <strong>Upgrade to Pro</strong> — unlimited applications, priority messaging, verified seal.</p>
                  </div>
                  <Link href="/pricing" className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-sm border border-[#A6683F]/60 bg-[#B87959] px-5 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] transition-all hover:-translate-y-0.5 hover:bg-[#C98B6D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344C43]">Upgrade to Pro<ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} /></Link>
                </div>

                <fieldset className="mt-5 border border-[#344C43]/20">
                  <legend className="px-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#B87959]">Manage Subscription</legend>
                  <ul className="divide-y divide-[#344C43]/15">
                    <li className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="flex items-center gap-2.5"><CreditCard aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} /><span><span className="block text-[12px] font-semibold tracking-tight text-[#344C43]">Visa •••• 2042</span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">Billing — student@email.com</span></span></span>
                      <button type="button" className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#B87959] underline decoration-[#B87959]/40 underline-offset-4 hover:text-[#96603F]">Update</button>
                    </li>
                    <li className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="flex items-center gap-2.5"><FileText aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} /><span><span className="block text-[12px] font-semibold tracking-tight text-[#344C43]">Invoice ML-2042</span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">Oct ’26 · $10.00 · Paid</span></span></span>
                      <button type="button" className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#B87959] underline decoration-[#B87959]/40 underline-offset-4 hover:text-[#96603F]">Download</button>
                    </li>
                    <li className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="flex items-center gap-2.5"><BadgeCheck aria-hidden="true" className="size-4 text-[#668B78]" strokeWidth={2} /><span><span className="block text-[12px] font-semibold tracking-tight text-[#344C43]">Pause or cancel</span><span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#344C43]/55">Seat holds through 01 Dec ’26</span></span></span>
                      <button type="button" className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#A34343] underline decoration-[#A34343]/40 underline-offset-4 hover:text-[#8f3838]">Manage</button>
                    </li>
                  </ul>
                </fieldset>
              </Panel>
            )}

            {/* Action Bar */}
            <div className="mt-5 flex flex-col-reverse gap-2.5 border border-[#344C43]/25 bg-[#F2ECDF]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={handleReset} className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-[#344C43]/30 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#344C43]/65 transition-all hover:border-[#A34343] hover:text-[#A34343]">
                <RotateCcw aria-hidden="true" className="size-4" strokeWidth={1.75} /> Reset Preferences
              </button>
              <button type="button" onClick={handleSave} disabled={!dirty && !savedFlash}
                className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-sm border px-6 font-mono text-[9px] font-bold uppercase tracking-[0.26em] transition-all duration-200",
                  savedFlash ? "border-[#668B78] bg-[#668B78] text-[#F2ECDF]" : dirty ? "border-[#A6683F]/60 bg-[#B87959] text-[#1E3A2F] shadow-[4px_4px_0_#344C43] hover:-translate-y-0.5 hover:bg-[#C98B6D]" : "cursor-not-allowed border-[#344C43]/15 bg-[#344C43]/5 text-[#344C43]/35")}>
                {savedFlash ? <><CheckCircle2 aria-hidden="true" className="size-4" strokeWidth={2} />Saved to Your Desk</> : <><Save aria-hidden="true" className="size-4" strokeWidth={1.75} />Save Changes</>}
              </button>
            </div>

          </div>
        </div>

        <Colophon backHref="/dashboard/student" backLabel="Back to the Register">
          <span className="inline-flex items-center gap-1.5"><Globe2 aria-hidden="true" className="size-3.5 text-[#668B78]" strokeWidth={2} />Dhaka · UTC+6 — The desk never sleeps</span>
        </Colophon>
      </div>
    </div>
  )
}