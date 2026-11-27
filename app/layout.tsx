import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ConditionalFooter } from "@/components/conditional-footer"
import { HtmlLangSync } from "@/components/html-lang-sync"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
})

export const metadata: Metadata = {
  title: "MentorLagbe | Smart Tuition & Mentorship Platform",
  description:
    "Connect with qualified tutors for subject-wise batches and 1-on-1 mentorship.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved/system theme before first paint: no flash, no hydration mismatch. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;el.classList.toggle('dark',d);el.style.colorScheme=d?'dark':'light';}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <HtmlLangSync />
        <Suspense fallback={<div className="h-18 border-b border-border/80 bg-background/85" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={<div className="h-18 border-b border-border/80 bg-background/85" />}>
          <ConditionalFooter />
        </Suspense>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
