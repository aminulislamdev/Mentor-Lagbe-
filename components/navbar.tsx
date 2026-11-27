"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Compass,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "@/components/notification-bell"

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const mobileMenuRef = React.useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false)
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileDropdownOpen])

  // Close mobile menu and dropdown on Esc key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close menus on browser history navigation (back/forward)
  React.useEffect(() => {
    const handlePopState = () => {
      setMobileMenuOpen(false)
      setProfileDropdownOpen(false)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const user = session?.user as
    | {
      id?: string
      name?: string
      email?: string
      image?: string
      role?: "student" | "tutor" | "admin" | string
      plan?: "free" | "pro" | string
    }
    | undefined

  const userRole = (user?.role || "student").toLowerCase()
  const isPro = user?.plan?.toLowerCase() === "pro"

  const dashboardHref =
    userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student"

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      setProfileDropdownOpen(false)
      setMobileMenuOpen(false)
      router.push("/sign-in")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "ML"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const renderRoleBadge = (isCompact = false) => {
    if (userRole === "admin") {
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-md border ${isCompact ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5"
            } bg-[#344C43] text-[#EFE7DC] border-[#B87959]/50 shadow-2xs`}
        >
          <ShieldCheck className="size-3.5 text-[#B87959]" />
          Admin
        </span>
      )
    }

    if (userRole === "tutor") {
      return (
        <span
          className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-md border ${isCompact ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5"
            } ${isPro
              ? "bg-[#B87959]/15 text-[#B87959] dark:text-[#C98B6D] border-[#B87959]/40"
              : "bg-primary/10 text-primary border-primary/25"
            }`}
        >
          {isPro ? (
            <Sparkles className="size-3.5 text-[#B87959] dark:text-[#C98B6D]" />
          ) : (
            <BookOpen className="size-3.5 text-primary" />
          )}
          {isPro ? "Tutor • Pro" : "Tutor"}
        </span>
      )
    }

    return (
      <span
        className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded-md border ${isCompact ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5"
          } ${isPro
            ? "bg-[#B87959]/15 text-[#B87959] dark:text-[#C98B6D] border-[#B87959]/40"
            : "bg-primary/10 text-primary border-primary/25"
          }`}
      >
        <GraduationCap className="size-3.5 text-primary" />
        {isPro ? "Student • Pro" : "Student"}
      </span>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Emblem */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -ml-1 transition-transform active:scale-98"
          aria-label="MentorLagbe Home"
        >
          {/* Architectural Compass & Quill Emblem */}
          <div className="relative flex size-11 sm:size-12 items-center justify-center rounded-xl bg-card border border-border shadow-2xs transition-all duration-200 group-hover:border-primary/60 group-hover:bg-primary/10">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/15 via-transparent to-accent/15 opacity-80" />
            <Compass className="relative size-6 sm:size-6 text-[#344C43] dark:text-[#EFE7DC] transition-transform duration-300 group-hover:rotate-45" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-accent ring-2 ring-background" />
          </div>

          <div className="flex flex-col">
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
              Mentor<span className="text-primary">Lagbe</span>
              <span className="text-accent ml-0.5">.</span>
            </span>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-muted-foreground -mt-0.5 font-medium">
              Academic Atelier
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-card/40 border border-border/60 shadow-2xs"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2 text-base font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-card/70"
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-1.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Theme Toggle & Authentication Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* Visual Theme Toggle */}
          <ThemeToggle />

          {/* Authentication State Render */}
          {isPending ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="size-10 rounded-xl bg-muted/60 animate-pulse border border-border" />
              <div className="h-5 w-20 rounded-md bg-muted/60 animate-pulse" />
            </div>
          ) : user ? (
            /* Authenticated Desktop Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none ${profileDropdownOpen
                    ? "bg-card border-primary/60 shadow-sm"
                    : "bg-card/80 hover:bg-card border-border hover:border-primary/40 shadow-2xs"
                  }`}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                aria-label="User account menu"
              >
                {/* User Avatar */}
                <div className="relative size-10 rounded-lg overflow-hidden bg-primary/15 border border-primary/25 flex items-center justify-center text-sm font-semibold font-mono text-primary">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </div>

                {/* Name & Role Preview */}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-sm font-semibold text-foreground max-w-35 truncate leading-tight">
                    {user.name || "Scholar"}
                  </span>
                  <div className="mt-0.5">{renderRoleBadge(true)}</div>
                </div>

                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Profile Dropdown Panel */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-2 text-foreground shadow-lg shadow-black/10 transition-all duration-150 z-50 animate-in fade-in zoom-in-95"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* User Profile Header Card */}
                  <div className="px-3 py-3 border-b border-border/80 mb-1.5 bg-background/50 rounded-xl">
                    <p className="text-base font-semibold text-foreground truncate">
                      {user.name || "Scholar"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate font-mono mt-0.5">
                      {user.email}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      {renderRoleBadge(false)}
                      <span className="text-xs sm:text-sm font-mono text-muted-foreground uppercase">
                        Plan: <strong className="text-foreground">{user.plan || "Free"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="space-y-0.5">
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm sm:text-base font-medium rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LayoutDashboard className="size-5 text-primary" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm sm:text-base font-medium rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      role="menuitem"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="size-5 text-primary" />
                      Update Profile
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="border-t border-border/80 mt-1.5 pt-1.5">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm sm:text-base font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive cursor-pointer disabled:opacity-50"
                      role="menuitem"
                    >
                      <LogOut className="size-5" />
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Desktop Actions */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-3.5 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-card/70 rounded-xl border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2.5 text-base font-semibold text-white bg-primary hover:bg-[#537363] active:scale-98 rounded-xl border border-primary/30 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden relative size-11 sm:size-10 flex items-center justify-center rounded-xl border border-border bg-card/80 text-foreground transition-all duration-200 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95"
          >
            {mobileMenuOpen ? (
              <X className="size-6 transition-transform duration-200 rotate-90 scale-100" />
            ) : (
              <Menu className="size-6 transition-transform duration-200 scale-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden border-b border-border bg-background/98 backdrop-blur-xl px-4 sm:px-6 pt-4 pb-8 shadow-xl transition-all duration-200 animate-in slide-in-from-top-2 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* User Preview for Mobile when Authenticated */}
          {user && (
            <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-sm font-semibold font-mono text-primary overflow-hidden shrink-0">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-foreground truncate">
                    {user.name || "Scholar"}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="shrink-0">{renderRoleBadge(true)}</div>
            </div>
          )}

          {/* Navigation Links List */}
          <nav className="space-y-1.5 mb-6">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all ${isActive
                      ? "bg-card text-primary font-semibold border border-primary/20"
                      : "text-foreground/80 hover:text-foreground hover:bg-card/50"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}

            {/* Authenticated Fast Links on Mobile */}
            {user && (
              <>
                <div className="my-2 border-t border-border/80" />
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-foreground hover:bg-card transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="size-6 text-primary" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-foreground hover:bg-card transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="size-6 text-primary" />
                  <span>Update Profile</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-border/80">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-destructive/20 text-destructive bg-destructive/10 hover:bg-destructive/15 font-semibold text-base transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="size-5" />
                <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center py-3.5 px-4 rounded-xl border border-border bg-card text-foreground font-semibold text-base hover:border-primary/40 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center py-3.5 px-4 rounded-xl bg-primary text-white font-semibold text-base hover:bg-[#537363] transition-colors shadow-xs"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}