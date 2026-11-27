"use client"

// Shared notification state so multiple <NotificationBell> instances
// (global Navbar + dashboard Topbar) share ONE GET /api/notifications and one
// unread count. No extra deps, no localStorage, no invented data. Reuses the
// existing `apiFetch` + verified `/api/notifications` contract; backend stays
// authoritative for role filtering. Failed requests never wipe data / mark read.

import * as React from "react"
import { apiFetch } from "@/lib/api"

export interface Notification {
  _id: string
  title: string
  message: string
  targetRole: "all" | "student" | "tutor"
  isRead: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  error: string | null
}

const INITIAL: NotificationState = { notifications: [], loading: true, error: null }

let state: NotificationState = INITIAL
let inFlight: Promise<void> | null = null
const listeners = new Set<() => void>()
const pendingIds = new Set<string>()

function emit() {
  for (const l of listeners) l()
}

function setState(patch: Partial<NotificationState>) {
  state = { ...state, ...patch }
  emit()
}

async function load(force = false): Promise<void> {
  if (inFlight && !force) return inFlight

  inFlight = (async () => {
    setState({ loading: true })
    try {
      const result = await apiFetch<Notification[]>("/api/notifications")
      setState({ notifications: Array.isArray(result.data) ? result.data : [], loading: false, error: null })
    } catch {
      // keep existing data on failure; do not wipe
      setState({ loading: false, error: "Could not load notifications." })
    } finally {
      inFlight = null
      emit()
    }
  })()

  return inFlight
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => { listeners.delete(callback) }
}

function getSnapshot(): NotificationState { return state }

export function useNotifications(isAuthenticated: boolean) {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, () => INITIAL)

  React.useEffect(() => {
    if (!isAuthenticated) return
    void load()
  }, [isAuthenticated])

  const refresh = React.useCallback(async () => { await load(true) }, [])

  const markRead = React.useCallback(async (id: string): Promise<boolean> => {
    if (pendingIds.has(id)) return false // prevent duplicate
    pendingIds.add(id)
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      // refresh shared list + unread count only after success
      await load(true)
      return true
    } catch {
      return false // not marked read on failure; state preserved
    } finally {
      pendingIds.delete(id)
    }
  }, [])

  const unreadCount = snap.notifications.reduce((c, n) => (n.isRead ? c : c + 1), 0)

  return {
    notifications: snap.notifications,
    loading: isAuthenticated ? snap.loading : false,
    error: snap.error,
    unreadCount: isAuthenticated ? unreadCount : 0,
    refresh,
    markRead,
  }
}
