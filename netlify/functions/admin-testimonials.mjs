// CRUD for the testimonials table, admin-only. Same shape as
// admin-practitioners.mjs.
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
    const { data, error } = await supabase.from('testimonials').select('*').order('display_order')
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null)
    if (!body?.name || !body?.quote) {
      return new Response(JSON.stringify({ error: 'name and quote are required' }), { status: 400 })
    }
    const row = { ...body, id: body.id || `${slugify(body.name)}-${Date.now().toString(36)}` }
    const { data, error } = await supabase.from('testimonials').insert(row).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'PUT') {
    if (!id) return new Response(JSON.stringify({ error: 'id query param is required' }), { status: 400 })
    const body = await req.json().catch(() => null)
    if (!body) return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
    const { id: _ignored, ...fields } = body
    const { data, error } = await supabase.from('testimonials').update(fields).eq('id', id).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (req.method === 'DELETE') {
    if (!id) return new Response(JSON.stringify({ error: 'id query param is required' }), { status: 400 })
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(null, { status: 204 })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
}

export const config = {
  path: '/api/admin/testimonials',
}
