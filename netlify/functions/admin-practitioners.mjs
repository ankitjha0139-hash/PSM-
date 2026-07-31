// CRUD for the practitioners table, admin-only. GET is intentionally NOT
// gated (the public directory could read straight from Supabase with the
// anon key instead — see src/hooks/usePractitioners.js — this function
// exists for the write paths); kept here anyway so the admin dashboard
// has one consistent endpoint for list+write.
import { requireAdmin } from './lib/adminAuth.mjs'
import { getSupabaseAdmin } from './lib/supabaseAdmin.mjs'

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async (req) => {
  const unauthorized = requireAdmin(req)
  if (unauthorized) return unauthorized

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('practitioners').select('*').order('display_order')
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null)
    if (!body?.name) return new Response(JSON.stringify({ error: 'name is required' }), { status: 400 })
    const row = { ...body, id: body.id || slugify(body.name) }
    const { data, error } = await supabase.from('practitioners').insert(row).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'PUT') {
    if (!id) return new Response(JSON.stringify({ error: 'id query param is required' }), { status: 400 })
    const body = await req.json().catch(() => null)
    if (!body) return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
    const { id: _ignored, ...fields } = body
    const { data, error } = await supabase
      .from('practitioners')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'DELETE') {
    if (!id) return new Response(JSON.stringify({ error: 'id query param is required' }), { status: 400 })
    const { error } = await supabase.from('practitioners').delete().eq('id', id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(null, { status: 204 })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
}

export const config = {
  path: '/api/admin/practitioners',
}
