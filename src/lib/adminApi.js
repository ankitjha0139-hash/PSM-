const TOKEN_KEY = 'lh:adminToken'

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // localStorage unavailable — the session just won't survive a reload
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // no-op
  }
}

export async function adminLogin(email, password) {
  const res = await fetch('/api/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: data.error || `Request failed (${res.status})` }
  setAdminToken(data.token)
  return { error: null }
}

// Thin wrapper around fetch for the admin-* Netlify Functions: attaches
// the bearer token, and clears it on a 401 so the dashboard falls back to
// the login screen instead of silently failing every request forever.
export async function adminFetch(path, options = {}) {
  const token = getAdminToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (res.status === 401) {
    clearAdminToken()
    throw new Error('Session expired — please sign in again.')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}
