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
        "pointer-events-none absolute size-6 border-[#C98B6D] transition-transform duration-500",
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
      className="relative flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:col-span-5 lg:px-10 lg:py-20 xl:px-14"
    >
      <div className="relative mx-auto w-full max-w-md lg:mx-0">
        <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#C98B6D] sm:text-[10px]">
          [ The Check-In Desk ]
        </p>
        <h2
          id="checkin-heading"
          className="study-serif mt-3 text-4xl font-black tracking-tight text-[#EFE7DC] sm:text-5xl"
        >
          Welcome <span className="italic text-[#C98B6D]">back.</span>
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#EFE7DC]/45 sm:text-[10px]">
          Enter your credentials to resume your seat
        </p>

        <div className="relative mt-6 border border-[#D9CBB5]/12 bg-[#1C2B25]/70 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-7">
          <CornerTick className="left-2 top-2 border-l-2 border-t-2" />
          <CornerTick className="right-2 top-2 border-r-2 border-t-2" />
          <CornerTick className="bottom-2 left-2 border-b-2 border-l-2" />
          <CornerTick className="bottom-2 right-2 border-b-2 border-r-2" />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-[#D9CBB5]/16 bg-[#EFE7DC]/[0.04] font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#EFE7DC] transition-all duration-200 hover:border-[#C98B6D]/45 hover:bg-[#EFE7DC]/[0.07]"
          >
            <Globe className="size-4 text-[#7AA890]" strokeWidth={1.75} />
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-[#D9CBB5]/12" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#EFE7DC]/38">or resume by hand</span>
            <span className="h-px flex-1 bg-[#D9CBB5]/12" />
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-[#EFE7DC]/60">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#C98B6D]/70" strokeWidth={1.75} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  autoComplete="email"
                  className={wellInput}
                />
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-3">
                <Label htmlFor="password" className="text-[#EFE7DC]/60">Password</Label>
                <Link href="#" className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#C98B6D]/80 underline underline-offset-4 hover:text-[#E0A57E]">
                  Forgot?
                </Link>
              </div>
              <PasswordWell id="password" value={form.password} onChange={(v) => set("password")(v)} />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#D9CBB5]/10 pt-4">
              <Checkbox
                id="remember-me"
                checked={form.remember}
                onCheckedChange={(v) => set("remember")(v === true)}
                label={<span className="text-[#EFE7DC]/70">Keep the lamp lit on this device</span>}
              />
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.24em] text-[#EFE7DC]/30 sm:inline">30 days</span>
            </div>

            <button
              type="submit"
              className="study-cta-glow group flex h-13 w-full items-center justify-center gap-3 rounded-md bg-[#B87959] py-4 font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-[#1A2823] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C98B6D] active:translate-y-0"
            >
              Return to the Study
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" strokeWidth={2.25} />
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#EFE7DC]/35 sm:text-[10px]">
            <ShieldCheck className="size-3.5 text-[#7AA890]" strokeWidth={2} />
            Private &amp; encrypted — MentorLagbe Trust Office
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-[#EFE7DC]/60 lg:text-left">
          New to the atelier?{" "}
          <Link href="/sign-up" className="group inline-flex items-center gap-1.5 font-semibold text-[#EFE7DC] underline decoration-[#B87959] decoration-2 underline-offset-4 hover:text-[#E0A57E]">
            Request enrollment
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </section>
  )
}