"use client"

// One data hook for every page.
//
//   const { data, pagination, loading, error, refetch } = useApi<Tuition[]>(path)
//
// `path` is a full API path (query string included). Changing it refetches;
// `refetch()` forces a reload after a mutation.
//
// `loading` is derived, not stored: the state below is only written from the
// promise callbacks, because this Next.js version lints against calling
// setState inside an effect body.

import * as React from "react"
import { apiFetch, ApiError } from "@/lib/api"
import type { Pagination } from "@/lib/api-types"

export interface UseApiResult<T> {
  data: T | null
  pagination?: Pagination
  loading: boolean
  error: string | null
  refetch: () => void
}

interface ApiSnapshot<T> {
  key: string
  data: T | null
  pagination?: Pagination
  error: string | null
}

export function useApi<T>(path: string | null): UseApiResult<T> {
  const [nonce, setNonce] = React.useState(0)
  const [snapshot, setSnapshot] = React.useState<ApiSnapshot<T> | null>(null)

  const requestKey = path ? `${path}#${nonce}` : null

  React.useEffect(() => {
    if (!path || !requestKey) return

    let active = true

    apiFetch<T>(path)
      .then((result) => {
        if (!active) return
        setSnapshot({ key: requestKey, data: result.data, pagination: result.pagination, error: null })
      })
      .catch((cause: unknown) => {
        if (!active) return
        setSnapshot({
          key: requestKey,
          data: null,
          error:
            cause instanceof ApiError
              ? cause.message
              : "Could not reach the server. Is the API running?",
        })
      })

    return () => {
      active = false
    }
  }, [path, requestKey])

  const refetch = React.useCallback(() => setNonce((value) => value + 1), [])

  // A snapshot only counts if it belongs to the request currently on screen.
  const current = snapshot && snapshot.key === requestKey ? snapshot : null

  return {
    data: current?.data ?? null,
    pagination: current?.pagination,
    loading: Boolean(path) && current === null,
    error: current?.error ?? null,
    refetch,
  }
}

/** Delays a fast-changing value (e.g. a search box) so the API is not hit per keystroke. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
