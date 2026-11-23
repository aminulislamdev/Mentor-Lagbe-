"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      router.replace("/sign-in")
      return
    }

    const role = (session.user as { role?: string }).role || "student"

    if (role === "admin") router.replace("/dashboard/admin")
    else if (role === "tutor") router.replace("/dashboard/tutor")
    else router.replace("/dashboard/student")
  }, [session, isPending, router])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#D9CBB5] px-4 text-center text-[#344C43]">
      <Loader2 className="mb-4 size-8 animate-spin text-[#668B78] sm:size-10" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs">
        Authenticating your account...
      </p>
    </div>
  )
}