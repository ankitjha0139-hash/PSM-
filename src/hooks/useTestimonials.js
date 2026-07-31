import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

// Public read of the testimonials table — same pattern as
// usePractitioners.js (RLS allows anon SELECT, no function needed).
let cache = null
let inFlight = null

function fetchTestimonials() {
  if (cache) return Promise.resolve(cache)
  if (!inFlight) {
    inFlight = supabase
      .from('testimonials')
      .select('*')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) throw error
        cache = data
        return data
      })
      .finally(() => {
        inFlight = null
      })
  }
  return inFlight
}

export function useTestimonials() {
  const [data, setData] = useState(cache)
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false

    fetchTestimonials()
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
