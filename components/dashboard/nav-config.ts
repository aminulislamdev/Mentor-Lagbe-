import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  User,
  Settings,
  NotebookPen,
  Files,
  Users,
  ShieldCheck,
  Landmark,
  Home,
  UsersRound,
} from "lucide-react"

export type DashboardRole = "student" | "tutor" | "admin"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface RoleConfig {
  /** Mono tagline under the brand mark in the sidebar */
  tagline: string
  /** Short role chip shown in the identity card */
  roleBadge: string
  /** Plan chip copy */
  plan: string
  /** Display name for the static identity card / topbar */
  userName: string
  initials: string
  /** Home route used for breadcrumb roots */
  home: string
  nav: NavItem[]
}

export const ROLE_CONFIG: Record<DashboardRole, RoleConfig> = {
  student: {
    tagline: "The Scholar's Ledger",
    roleBadge: "Scholar · HSC '26",
    plan: "Free",
    userName: "Tasnim Rahman",
    initials: "TR",
    home: "/dashboard/student",
    nav: [
      { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
      { label: "My Applications", href: "/dashboard/student/my-applications", icon: Inbox },
      { label: "Browse Tuitions", href: "/tuitions", icon: BookOpen },
      { label: "My Profile", href: "/dashboard/profile", icon: User },
      { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
    ],
  },
  tutor: {
    tagline: "The Mentor's Register",
    roleBadge: "Mentor · Verified",
    plan: "Pro",
    userName: "Dr. Nasrin Islam",
    initials: "NI",
    home: "/dashboard/tutor",
    nav: [
      { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
      { label: "Post Tuition", href: "/dashboard/tutor/post-tuition", icon: NotebookPen },
      { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: Files },
      { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
      { label: "My Profile", href: "/dashboard/profile", icon: User },
      { label: "Settings", href: "/dashboard/tutor/settings", icon: Settings },
    ],
  },
  admin: {
    tagline: "The Trust Office",
    roleBadge: "Trust Office · Admin",
    plan: "Admin",
    userName: "Arif Chowdhury",
    initials: "AC",
    home: "/dashboard/admin",
    nav: [
      { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Manage Users", href: "/dashboard/admin/users", icon: UsersRound },
      { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: ShieldCheck },
      { label: "Transactions", href: "/dashboard/admin/transactions", icon: Landmark },
      { label: "Back to Website", href: "/", icon: Home },
    ],
  },
}

export interface RouteMeta {
  title: string
  crumbs: Array<{ label: string; href?: string }>
}

/** Derives a topbar title + breadcrumb trail from the current path. */
export function getRouteMeta(pathname: string, role: DashboardRole): RouteMeta {
  const cfg = ROLE_CONFIG[role]
  // Prefer the longest matching prefix so /dashboard/student/my-applications
  // doesn't collapse into the /dashboard/student Overview entry.
  const match = [...cfg.nav]
    .filter(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]
  if (match) {
    return {
      title: match.label,
      crumbs: [{ label: "Dashboard", href: cfg.home }, { label: match.label }],
    }
  }
  const segment = pathname.split("/").filter(Boolean).pop() ?? "overview"
  const title = segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
  return { title, crumbs: [{ label: "Dashboard", href: cfg.home }, { label: title }] }
}
