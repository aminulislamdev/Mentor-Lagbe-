// Gets the JWT that the Express API verifies.
//
// BetterAuth's jwt plugin exposes GET /api/auth/token on the Next app (it
// returns { token } for the current session cookie). The jwt *client* plugin
// only offers jwks(), so this route is the way to obtain the token.
//
// The token is cached briefly because every API call needs it; a 401 forces a
// fresh one (see apiFetch in lib/api.ts).

const TOKEN_PATH = "/api/auth/token"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? ""
const TTL_MS = 5 * 60 * 1000

let cache: { token: string; at: number } | null = null

export async function getJwt(force = false): Promise<string | null> {
  // Server components cannot read the browser's session cookie, so only the
  // client may mint a token for authenticated calls.
  if (typeof window === "undefined") return null

  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.token

  try {
    const response = await fetch(`${BASE_URL}${TOKEN_PATH}`, {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      cache = null
      return null
    }

    const json = (await response.json()) as { token?: string }
    cache = json.token ? { token: json.token, at: Date.now() } : null
    return cache?.token ?? null
  } catch {
    cache = null
    return null
  }
}

export function clearJwtCache() {
  cache = null
}
