"use client"

// Notification bell for the shared navbar.
//
// Fetches GET /api/notifications for the currently authenticated user,
// shows an unread badge, and offers a responsive dropdown. Clicking a
// notification calls PATCH /api/notifications/:id/read and refreshes.
// Reuses `useApi` + `apiFetch`; no new API logic is duplicated.

import * as React from "react"
import { Bell, Check, Inbox, Loader2, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { useApi } from "@/lib/hooks/use-api"
import { apiFetch } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

// Verified response shape of GET /api/notifications.
export interface Notification {
  _id: string
  title: string
  message: string
  targetRole: "all" | "student" | "tutor"
  isRead: boolean
  createdAt: string
  updatedAt: string
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export function NotificationBell() {
  const { data: session } = useSession()
  const isAuthenticated = Boolean(session?.user)

  const { data, loading, error, refetch } = useApi<Notification[]>(
    isAuthenticated ? "/api/notifications" : null
  )

  const notifications = data ?? []
  const unreadCount = notifications.reduce((count, n) => (n.isRead ? count : count + 1), 0)

  const [open, setOpen] = React.useState(false)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close when clicking outside.
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const markRead = async (notification: Notification) => {
    if (pendingId) return // prevent duplicate requests while one is pending

    setPendingId(notification._id)
    try {
      await apiFetch(`/api/notifications/${notification._id}/read`, { method: "PATCH" })
      refetch() // refresh list + unread count only after success
    } catch {
      // Do not mark read on failure; nothing is updated locally.
      toast.error("Could not update notification. Please try again.")
    } finally {
      setPendingId(null)
    }
  }

  // Notification bell is only relevant for signed-in users.
  if (!isAuthenticated) return null

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "relative inline-flex size-10 items-center justify-center rounded-xl border bg-card/80 text-foreground transition-all duration-200",
          "hover:bg-card hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          open ? "border-primary/60 bg-card shadow-sm" : "border-border"
        )}
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold leading-none text-primary-foreground shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className={cn(
            "absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-lg shadow-black/10",
            "animate-in fade-in zoom-in-95"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/80 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                {unreadCount > 9 ? "9+" : unreadCount} new
              </span>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {loading ? (
              <NotificationSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <TriangleAlert className="size-6 text-destructive" aria-hidden="true" />
                <p className="text-sm font-medium">Couldn’t load notifications</p>
                <p className="text-xs text-muted-foreground">{error}</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Inbox className="size-7 text-muted-foreground/60" aria-hidden="true" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground">You’re all caught up.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {notifications.map((n) => {
                  const isPending = pendingId === n._id
                  return (
                    <li key={n._id}>
                      <button
                        type="button"
                        onClick={() => markRead(n)}
                        disabled={isPending}
                        aria-label={`${n.isRead ? "Read" : "Unread"} notification: ${n.title}`}
                        className={cn(
                          "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                          !n.isRead && "bg-primary/[0.04]",
                          isPending && "opacity-60"
                        )}
                      >
                        {/* unread indicator */}
                        <span className="mt-1.5 flex size-2 shrink-0 items-center justify-center" aria-hidden="true">
                          <span className={cn("size-2 rounded-full", n.isRead ? "bg-transparent" : "bg-primary")} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className={cn("truncate text-sm", n.isRead ? "font-medium text-muted-foreground" : "font-semibold text-foreground")}>
                              {n.title}
                            </span>
                            {n.isRead && <Check className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                          </span>
                          <span className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{n.message}</span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            {formatDate(n.createdAt)}
                            {isPending ? " · saving…" : n.isRead ? " · read" : " · unread"}
                          </span>
                        </span>

                        {isPending && <Loader2 className="mt-1 size-3.5 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <ul className="divide-y divide-border/60" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex gap-3 px-4 py-3">
          <span className="mt-1.5 size-2 shrink-0 animate-pulse rounded-full bg-muted" />
          <span className="flex-1 space-y-2">
            <span className="block h-3.5 w-2/3 animate-pulse rounded bg-muted" />
            <span className="block h-3 w-full animate-pulse rounded bg-muted" />
            <span className="block h-2.5 w-1/3 animate-pulse rounded bg-muted" />
          </span>
        </li>
      ))}
    </ul>
  )
}
