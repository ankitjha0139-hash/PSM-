import { useEffect, useState } from 'react'

// Module-level cache so every screen that calls useCareerPaths() during the
// same page session shares one fetch instead of each hitting /api/career-paths
// independently — resets only on a full page reload (the server-side function
// already has its own TTL cache, so a hard refresh naturally picks up changes).
let cache = null
let inFlight = null

function fetchCareerPaths() {
  if (cache) return Promise.resolve(cache)
  if (!inFlight) {
    inFlight = fetch('/api/career-paths')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load career data: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        cache = data
        return data
      })
      .finally(() => {
        inFlight = null
      })
  }
  return inFlight
}

export function useCareerPaths() {
  const [data, setData] = useState(cache)
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cache) return
    let cancelled = false

    fetchCareerPaths()
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
