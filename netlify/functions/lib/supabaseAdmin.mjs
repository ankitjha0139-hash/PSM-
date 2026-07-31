import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS entirely, so it only ever runs
// server-side inside admin-* functions, gated by requireAdmin() first.
// Never import this from src/ (browser code); the anon-key client in
// src/lib/supabaseClient.js is what the frontend uses for public reads.
let client = null

export function getSupabaseAdmin() {
  if (client) return client
  const url = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set on this Netlify site.')
  }
  client = createClient(url, serviceRoleKey)
  return client
}
