// Public read-only aggregate: which (date, time) slots are already booked
// for a given practitioner, across ALL users. The `bookings` table's RLS
// only lets a signed-in user see their own rows (supabase/bookings.sql),
// so a real availability check can't be done from the browser with the
// anon key — this uses the service role key server-side instead, and
// returns only date_key/time, never who booked or any contact details.
import { getSupabaseAdmin } from './lib/supabaseAdmin.mjs'

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const url = new URL(req.url)
  const practitionerId = url.searchParams.get('practitionerId')
  if (!practitionerId) {
    return new Response(JSON.stringify({ error: 'practitionerId query param is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err.message || err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('date_key, time')
    .eq('practitioner_id', practitionerId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/practitioner-availability',
}
