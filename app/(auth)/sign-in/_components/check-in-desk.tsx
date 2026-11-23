"use client"

import Link from "next/link"
import { ArrowRight, Globe, Mail, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { signIn } from "@/lib/auth-client"
import { wellInput } from "./night-styles"
import { PasswordWell } from "./password-well"

function CornerTick({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute size-4 border-[#C98B6D] transition-transform duration-500 sm:size-6",
        className
      )}
    />
  )
}

export function CheckInDesk({
  form,
  set,
  onSubmit,
}: {
  form: { email: string; password: string; remember: boolean }
  set: (field: keyof typeof form) => (value: string | boolean) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const handleGoogleSignIn = () => {
    signIn.social({
      provider: "google",
      callbackURL: "/auth/callback",
    })
  }

  return (
    <section
      aria-labelledby="checkin-heading"
      className="relative flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:col-span-5 lg:px-8 lg:py-16 xl:px-12"
    >
      <div className="relative mx-auto w-full max-w-md lg:mx-0">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#C98B6D] sm:text-[10px]">
          [ The Check-In Desk ]
        </p>
        <h2
          id="checkin-heading"
          className="study-serif mt-2 text-3xl font-black tracking-tight text-[#EFE7DC] sm:mt-3 sm:text-4xl lg:text-5xl"
        >
          Welcome <span className="italic text-[#C98B6D]">back.</span>
        </h2>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#EFE7DC]/45 sm:text-[10px]">
          Enter your credentials to resume your seat
        </p>

        <div className="relative mt-5 border border-[#D9CBB5]/12 bg-[#1C2B25]/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:mt-6 sm:p-6">
          <CornerTick className="left-2 top-2 border-l-2 border-t-2" />
          <CornerTick className="right-2 top-2 border-r-2 border-t-2" />
          <CornerTick className="bottom-2 left-2 border-b-2 border-l-2" />
          <CornerTick className="bottom-2 right-2 border-b-2 border-r-2" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-[#D9CBB5]/16 bg-[#EFE7DC]/4 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-[#EFE7DC] transition-all duration-200 hover:border-[#C98B6D]/45 hover:bg-[#EFE7DC]/[0.07] sm:h-12 sm:gap-3 sm:text-[10px]"
          >
            <Globe className="size-3.5 text-[#7AA890] sm:size-4" strokeWidth={1.75} />
            Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3 sm:my-5 sm:gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-[#D9CBB5]/12" />
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-[#EFE7DC]/38 sm:text-[10px]">or resume by hand</span>
            <span className="h-px flex-1 bg-[#D9CBB5]/12" />
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="email" className="text-[#EFE7DC]/60">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#C98B6D]/70 sm:left-4 sm:size-4.5" strokeWidth={1.75} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  autoComplete="email"
                  className={cn(wellInput, "h-11 pl-10 text-sm sm:h-12 sm:pl-11")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-2 sm:gap-3">
                <Label htmlFor="password" className="text-[#EFE7DC]/60">Password</Label>
                <Link href="#" className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C98B6D]/80 underline underline-offset-4 hover:text-[#E0A57E] sm:mb-1.5">
                  Forgot?
                </Link>
              </div>
              <PasswordWell id="password" value={form.password} onChange={(v) => set("password")(v)} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D9CBB5]/10 pt-3 sm:flex-nowrap sm:pt-4">
              <Checkbox
                id="remember-me"
                checked={form.remember}
                onCheckedChange={(v) => set("remember")(v === true)}
                label={<span className="text-[#EFE7DC]/70 text-xs sm:text-sm">Keep the lamp lit on this device</span>}
              />
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.24em] text-[#EFE7DC]/30 sm:inline">30 days</span>
            </div>

            <button
              type="submit"
              className="study-cta-glow group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B87959] py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#1A2823] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C98B6D] active:translate-y-0 sm:h-13 sm:gap-3 sm:py-4 sm:text-[11px]"
            >
              Return to the Study
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1.5 sm:size-4" strokeWidth={2.25} />
            </button>
          </form>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-[#EFE7DC]/35 sm:mt-4 sm:gap-2 sm:text-[9px]">
            <ShieldCheck className="size-3 shrink-0 text-[#7AA890] sm:size-3.5" strokeWidth={2} />
            Private &amp; encrypted — MentorLagbe Trust Office
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[#EFE7DC]/60 sm:mt-6 sm:text-sm lg:text-left">
          New to the atelier?{" "}
          <Link href="/sign-up" className="group inline-flex items-center gap-1 font-semibold text-[#EFE7DC] underline decoration-[#B87959] decoration-2 underline-offset-4 hover:text-[#E0A57E] sm:gap-1.5">
            Request enrollment
            <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1 sm:size-3.5" />
          </Link>
        </p>
      </div>
    </section>
  )
}