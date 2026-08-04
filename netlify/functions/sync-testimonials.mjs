// Admin-triggered bulk import: reads the Testimonials tab of a Google
// Sheet (published to web as CSV — see .env.example) and upserts rows
// into Supabase. Id defaults to a slug of name+tag (not name+timestamp
// like the manual POST in admin-testimonials.mjs) so re-running the sync
// after editing the sheet updates existing rows instead of duplicating
// them.
import { requireAdmin } from './lib/adminAuth.mjs'
import { getSupabaseAdmin } from './lib/supabaseAdmin.mjs'
import { fetchSheetRecords, slugify } from './lib/csv.mjs'

function toRow(record) {
  const name = record.name?.trim()
  const quote = record.quote?.trim()
  if (!name || !quote) return null

  const tag = record.tag?.trim() || ''
  return {
    id: record.id?.trim() || slugify(`${name}-${tag || quote.slice(0, 20)}`),
    name,
    quote,
    initials: record.initials?.trim() || name[0].toUpperCase(),
    tag,
    from_situation: record.from_situation?.trim() || '',
    to_outcome: record.to_outcome?.trim() || '',
    display_order: record.display_order ? Number(record.display_order) || 0 : 0,
  }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  const unauthorized = requireAdmin(req)
  if (unauthorized) return unauthorized

  const sheetUrl = process.env.TESTIMONIALS_SHEET_CSV_URL
  if (!sheetUrl) {
    return new Response(
      JSON.stringify({ error: 'TESTIMONIALS_SHEET_CSV_URL is not set on this Netlify site.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), { status: 500 })
  }

  let records
  try {
    records = await fetchSheetRecords(sheetUrl)
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), { status: 502 })
  }

  const results = []
  for (const [index, record] of records.entries()) {
    const sheetRow = index + 2
    const row = toRow(record)
    if (!row) {
      results.push({ row: sheetRow, error: 'Missing name or quote' })
      continue
    }
    const { error } = await supabase.from('testimonials').upsert(row, { onConflict: 'id' })
    results.push({ row: sheetRow, id: row.id, error: error?.message || null })
  }

  const synced = results.filter((r) => !r.error).length
  const errors = results.filter((r) => r.error)
  return new Response(JSON.stringify({ synced, total: results.length, errors }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/admin/sync-testimonials',
}
