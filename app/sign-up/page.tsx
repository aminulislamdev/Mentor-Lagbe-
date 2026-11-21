"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Asterisk } from "lucide-react"
import { signUp } from "@/lib/auth-client"

import { type Role } from "./components/oaths"
import { charterStyles } from "./components/charter-styles"
import { RegistrationMark } from "./components/registration-mark"
import { OathSlab } from "./components/oath-slab"
import { SealPanel } from "./components/seal-panel"
import { CharterMasthead } from "./components/charter-masthead"
import { CharterForm } from "./components/charter-form"
import { CharterFooter } from "./components/charter-footer"

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("student")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    background: "",
    agreeCharter: false,
    agreeLetter: false,
  })

  const set = (field: keyof typeof form) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ─── 1) Validation ────────────────────────────────────────
    if (!form.fullName.trim()) {
      toast.error("আপনার পুরো নাম লিখুন")
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("সঠিক ইমেইল ফরম্যাট দিন")
      return
    }
    if (form.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে")
      return
    }
    if (!form.agreeCharter) {
      toast.error("Terms ও Privacy Policy-তে সম্মতি দিন")
      return
    }

    // ─── 2) BetterAuth signup ────────────────────────────────
    const { error } = await signUp.email({
      name: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      role,
      ...(role === "tutor" && form.background.trim()
        ? { bio: form.background.trim() }
        : {}),
    })

    // ─── 3) Error handling ───────────────────────────────────
    if (error) {
      toast.error(error.message ?? "সাইন-আপ ব্যর্থ হয়েছে")
      return
    }

    // ─── 4) Success + redirect ───────────────────────────────
    toast.success("স্বাগতম! আপনার ড্যাশবোর্ডে নিয়ে যাচ্ছি…")
    router.push(role === "tutor" ? "/dashboard/tutor" : "/dashboard/student")
    router.refresh()
  }

  return (
    <div className="charter-root relative overflow-hidden bg-[#D9CBB5] text-[#344C43] transition-colors duration-300 dark:bg-[#1A2823] dark:text-[#EFE7DC]">
      <style>{charterStyles}</style>

      <div aria-hidden="true" className="charter-serif pointer-events-none absolute right-1 top-14 hidden select-none text-[7.5rem] font-black leading-none text-[#344C43]/[0.08] dark:text-[#EFE7DC]/[0.05] xl:block">
        №
      </div>

      <RegistrationMark className="left-2 top-11 hidden lg:block" />
      <RegistrationMark className="right-2 top-11 hidden lg:block" />
      <RegistrationMark className="bottom-2 left-2 hidden lg:block" />
      <RegistrationMark className="bottom-2 right-2 hidden lg:block" />

      <div className="relative border-b border-[#344C43]/30 dark:border-[#EFE7DC]/15">
        <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between gap-4 px-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#344C43]/70 dark:text-[#EFE7DC]/55 sm:px-8 sm:text-[10px]">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Asterisk className="size-3 text-[#B87959]" strokeWidth={2.5} />
            MentorLagbe · The Enrollment Charter
          </span>
          <span className="hidden md:inline">Dhaka — Est. 2026</span>
          <span className="hidden whitespace-nowrap sm:inline">Folio Nº ML-REG-001</span>
        </div>
      </div>

      <main className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
        <CharterMasthead />

        <section id="article-1" aria-labelledby="article-1-heading" className="scroll-mt-24 py-8 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">Article I</p>
              <h2 id="article-1-heading" className="charter-serif mt-1 text-3xl font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-4xl">
                Declaration of <span className="italic text-[#668B78]">Intent</span>
              </h2>
            </div>
            <p className="max-w-[32ch] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
              Choose exactly one — the rest of the charter conforms
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 md:gap-6 lg:gap-8">
            <OathSlab role="student" selected={role === "student"} onSelect={setRole} />
            <OathSlab role="tutor" selected={role === "tutor"} onSelect={setRole} />
          </div>
        </section>

        <section id="article-2" aria-labelledby="article-2-heading" className="scroll-mt-24 border-t border-[#344C43]/30 py-8 dark:border-[#EFE7DC]/15 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B87959] sm:text-[10px]">Article II</p>
              <h2 id="article-2-heading" className="charter-serif mt-1 text-3xl font-black tracking-tight text-[#344C43] dark:text-[#EFE7DC] sm:text-4xl">
                The <span className="italic text-[#668B78]">Inscription</span>
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#344C43]/55 dark:text-[#EFE7DC]/45 sm:text-[10px]">
              Now inscribing: <span className="text-[#B87959]">{role === "student" ? "The Scholar" : "The Mentor"}</span>
            </p>
          </div>

          <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-12 lg:gap-12">
            <CharterForm role={role} form={form} set={set} onSubmit={handleSubmit} />
            <div id="article-3" className="scroll-mt-24 lg:col-span-5 lg:pl-2 xl:pl-6">
              <div className="lg:sticky lg:top-24">
                <SealPanel />
              </div>
            </div>
          </div>
        </section>

        <CharterFooter />
      </main>
    </div>
  )
}