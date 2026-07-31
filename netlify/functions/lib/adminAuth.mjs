// Stateless admin session tokens — no session store, no Supabase Auth user
// for "admin" (the login is a single hardcoded env-var credential, not an
// account). A signed, expiring token is enough for a single-operator
// internal tool: the browser holds it in localStorage and sends it as
// `Authorization: Bearer <token>` on every admin-* function call; each
// function verifies it here before touching Supabase with the service
// role key. If this ever needs to support more than one admin, this is
// the file that gets replaced with real sessions/roles.
import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function sign(payload) {
  const secret = process.env.ADMIN_TOKEN_SECRET
  if (!secret) throw new Error('ADMIN_TOKEN_SECRET is not set on this Netlify site.')
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(authorizationHeader) {
  const token = authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice(7) : null
  if (!token) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  let expected
  try {
    expected = sign(payload)
  } catch {
    return false
  }

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && Date.now() < exp
  } catch {
    return false
  }
}

export function requireAdmin(req) {
  if (!verifyAdminToken(req.headers.get('authorization'))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return null
}
