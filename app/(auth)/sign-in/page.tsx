"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoonStar } from "lucide-react"
import { signIn } from "@/lib/auth-client"

import { MOTES } from "./_components/night-data"
import { studyStyles } from "./_components/night-styles"
import { NightStudyLeft } from "./_components/night-study-left"
import { CheckInDesk } from "./_components/check-in-desk"
import { NightFooter } from "./_components/night-footer"

export default function SignInPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  })

  const set = (field: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("সঠিক ইমেইল ফরম্যাট দিন")
      return
    }
    if (form.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর")
      return
    }

    const { data, error } = await signIn.email({
      email: form.email.trim(),
      password: form.password,
      rememberMe: form.remember,
    })

    if (error) {
      toast.error("ভুল ইমেইল বা পাসওয়ার্ড")
      return
    }

    const role = (data?.user as { role?: string })?.role ?? "student"
    toast.success("ফিরে আসায় স্বাগতম")

    if (role === "admin") router.push("/dashboard/admin")
    else if (role === "tutor") router.push("/dashboard/tutor")
    else router.push("/dashboard/student")

    router.refresh()
  }

  return (
    <div
      className="study-root relative min-h-screen overflow-hidden bg-[#16241F] text-[#EFE7DC]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 55% at 72% -10%, rgba(201,139,109,0.22) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 12% 112%, rgba(102,139,120,0.16) 0%, transparent 55%), radial-gradient(rgba(217,203,181,0.05) 1px, transparent 1.4px)",
        backgroundSize: "auto, auto, 26px 26px",
      }}
    >
      <style>{studyStyles}</style>

      <div
        aria-hidden="true"
        className="study-lamp pointer-events-none absolute -top-32 right-[-15%] size-96 rounded-full sm:-top-40 sm:right-[-10%] sm:size-144"
        style={{
          background:
            "radial-gradient(circle, rgba(226,164,110,0.22) 0%, rgba(201,139,109,0.07) 38%, transparent 70%)",
        }}
      />

      {MOTES.map((m, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="study-mote pointer-events-none absolute rounded-full bg-[#E8DFD0]"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            opacity: 0,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}

      <div className="relative border-b border-[#D9CBB5]/12">
        <div className="mx-auto flex h-10 max-w-375 items-center justify-between gap-2 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EFE7DC]/55 sm:h-9 sm:gap-4 sm:px-8 sm:text-[11px] sm:tracking-[0.28em]">
          <span className="flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
            <MoonStar className="size-3 text-[#C98B6D] sm:size-3.5" strokeWidth={2} />
            MentorLagbe · The Night Study
          </span>
          <span className="hidden md:inline">Dhaka — Est. 2026</span>
          <span className="hidden whitespace-nowrap sm:inline">Folio Nº ML-REG-002</span>
        </div>
      </div>

      <main className="relative mx-auto max-w-375">
        <div className="relative grid lg:grid-cols-12">
          <NightStudyLeft />
          <CheckInDesk form={form} set={set} onSubmit={handleSubmit} />
        </div>
        <NightFooter />
      </main>
    </div>
  )
}