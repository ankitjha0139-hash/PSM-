import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

// Public read of the practitioners table — RLS allows anon SELECT (see
// supabase/practitioners.sql), so this talks to Supabase directly with
// the anon key, no Netlify Function needed for reads. Module-level cache,
// same pattern as useCareerPaths — shared across every screen in one
// page session, resets on full reload.

// DB columns are snake_case; PractitionerCard/PractitionerProfile/
// MySessions/App.jsx's role-matching all still expect the camelCase shape
// the old static src/data/practitioners.js file used — mapping here means
// none of those components needed to change when the data moved to Supabase.
function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo,
    videoUrl: row.video_url,
    role: row.role,
    credibility: row.credibility,
    matchesRole: row.matches_role,
    rating: row.rating,
    sessionsCompleted: row.sessions_completed,
    bio: row.bio,
    languages: row.languages || [],
    journey: row.journey || [],
    topics: row.topics || [],
    testimonials: row.testimonials || [],
    sessionTypes: row.session_types || [],
  }
}

let cache = null
let inFlight = null

function fetchPractitioners() {
  if (cache) return Promise.resolve(cache)
  if (!inFlight) {
    inFlight = supabase
      .from('practitioners')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) throw error
        const mapped = data.map(fromRow)
        cache = mapped
        return mapped
      })
      .finally(() => {
        inFlight = null
      })
  }
  return inFlight
}

export function usePractitioners() {
  const [data, setData] = useState(cache)
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false

    fetchPractitioners()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
