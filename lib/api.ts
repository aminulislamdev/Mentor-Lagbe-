// The single doorway to the Express API.
//
// Every call gets the envelope unwrapped, the JWT attached when needed, and one
// automatic retry after refreshing an expired token. Failures surface as
// ApiError so a page can show `error.message` directly (the server messages are
// written to be shown to a person).

import { getJwt, clearJwtCache } from "./auth-token"
import type { ApiFailure, ApiSuccess, CurrentUser, MeResponse, Pagination } from "./api-types"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class ApiError extends Error {
  status: number
  details?: Record<string, unknown>

  constructor(message: string, status: number, details?: Record<string, unknown>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  /** Send the Bearer token. Public reads do not need it. */
  auth?: boolean
}

export interface ApiResult<T> {
  data: T
  pagination?: Pagination
  message?: string
}

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = true }: RequestOptions = {}
): Promise<ApiResult<T>> {
  const send = (token: string | null) => {
    const headers: Record<string, string> = {}
    if (body !== undefined) headers["Content-Type"] = "application/json"
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    })
  }

  let token = auth ? await getJwt() : null
  let response = await send(token)

  // A rejected token is usually just stale — refresh once, then retry.
  if (response.status === 401 && auth) {
    clearJwtCache()
    token = await getJwt(true)
    response = await send(token)
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null

  if (!response.ok || !payload || payload.success === false) {
    const failure = payload as ApiFailure | null
    throw new ApiError(
      failure?.error ?? `Request failed (${response.status})`,
      response.status,
      failure ?? undefined
    )
  }

  return {
    data: payload.data,
    pagination: payload.pagination,
    message: payload.message,
  }
}

/** Convenience for reads where only the payload matters. */
export async function apiGet<T>(path: string, options?: RequestOptions): Promise<T> {
  const result = await apiFetch<T>(path, options)
  return result.data
}

/**
 * GET /api/auth/me. The one endpoint that answers { user } rather than the
 * envelope, so it is wrapped here instead of leaking that exception to pages.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (typeof window === "undefined") return null

  try {
    const token = await getJwt()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!response.ok) return null

    const json = (await response.json()) as MeResponse
    return json.user ?? null
  } catch {
    return null
  }
}

/** Uploads one image to the server, which forwards it to ImgBB. */
export async function uploadImage(file: File): Promise<string> {
  const token = await getJwt()
  if (!token) throw new ApiError("Please sign in again to upload an image", 401)

  const form = new FormData()
  form.append("image", file)

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<{ url: string }>
    | ApiFailure
    | null

  if (!response.ok || !payload || payload.success === false) {
    const failure = payload as ApiFailure | null
    throw new ApiError(failure?.error ?? "Upload failed", response.status)
  }

  return payload.data.url
}

// Stripe checkout session creation. The server will return a URL to redirect the user to.
export async function createCheckoutSession(plan: "student" | "tutor") {
  const result = await apiFetch<{ url: string }>("/api/payments/create-checkout-session", {
    method: "POST",
    body: { plan },
  });
  return result.data.url;
}