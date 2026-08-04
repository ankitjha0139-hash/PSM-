// Admin-triggered bulk import: reads the Practitioners tab of a Google
// Sheet (published to web as CSV — see .env.example) and upserts rows
// into Supabase. Only flat fields are sourced from the sheet; nested
// fields (journey/session_types/testimonials) are intentionally left
// untouched here so a re-sync never wipes out what's been added by hand
// in the admin UI afterward — see PractitionerAdminPanel.jsx.
import { requireAdmin } from './lib/adminAuth.mjs'
import { getSupabaseAdmin } from './lib/supabaseAdmin.mjs'
import { fetchSheetRecords, slugify } from './lib/csv.mjs'

const REQUIRED_FOR_NEW = ['role', 'credibility', 'matches_role', 'bio']

function toRow(record) {
  const name = record.name?.trim()
  if (!name) return null

  const row = { id: record.id?.trim() || slugify(name), name }
  if (record.photo) row.photo = record.photo.trim()
  if (record.video_url) row.video_url = record.video_url.trim()
  if (record.role) row.role = record.role.trim()
  if (record.credibility) row.credibility = record.credibility.trim()
  if (record.matches_role) row.matches_role = record.matches_role.trim()
  if (record.rating) row.rating = Number(record.rating)
  if (record.sessions_completed) row.sessions_completed = Number(record.sessions_completed) || 0
  if (record.bio) row.bio = record.bio.trim()
  if (record.languages) {
    row.languages = record.languages.split('|').map((s) => s.trim()).filter(Boolean)
  }
  if (record.topics) {
    row.topics = record.topics.split('|').map((s) => s.trim()).filter(Boolean)
  }
  if (record.display_order) row.display_order = Number(record.display_order) || 0
  return row
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  const unauthorized = requireAdmin(req)
  if (unauthorized) return unauthorized

  const sheetUrl = process.env.PRACTITIONERS_SHEET_CSV_URL
  if (!sheetUrl) {
    return new Response(
      JSON.stringify({ error: 'PRACTITIONERS_SHEET_CSV_URL is not set on this Netlify site.' }),
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

  const { data: existing, error: existingError } = await supabase.from('practitioners').select('id')
  if (existingError) {
    return new Response(JSON.stringify({ error: existingError.message }), { status: 500 })
  }
  const existingIds = new Set((existing || []).map((r) => r.id))

  const results = []
  for (const [index, record] of records.entries()) {
    const sheetRow = index + 2 // +1 for 0-index, +1 for the header row
    const row = toRow(record)
    if (!row) {
      results.push({ row: sheetRow, error: 'Missing name' })
      continue
    }
    if (!existingIds.has(row.id)) {
      const missing = REQUIRED_FOR_NEW.filter((f) => !row[f])
      if (missing.length) {
        results.push({ row: sheetRow, id: row.id, error: `New practitioner missing: ${missing.join(', ')}` })
        continue
      }
    }
    const { error } = await supabase.from('practitioners').upsert(row, { onConflict: 'id' })
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
  path: '/api/admin/sync-practitioners',
}
