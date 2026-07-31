import { timingSafeEqual } from 'node:crypto'
import { createAdminToken } from './lib/adminAuth.mjs'

// Constant-time string compare so a failed login can't be timed to leak
// how many characters matched — same reasoning as verifyAdminToken.
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    return new Response(
      JSON.stringify({ error: 'ADMIN_EMAIL / ADMIN_PASSWORD are not set on this Netlify site.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const { email, password } = body
  if (!email || !password || !safeEqual(email, adminEmail) || !safeEqual(password, adminPassword)) {
    return new Response(JSON.stringify({ error: 'Incorrect email or password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let token
  try {
    token = createAdminToken()
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/admin-login',
}
