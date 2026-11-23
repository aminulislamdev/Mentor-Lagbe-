import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ConditionalFooter } from "@/components/conditional-footer"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
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
