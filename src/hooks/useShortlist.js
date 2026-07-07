import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'shortlist'

// Shortlist state, persisted to localStorage so it survives a refresh.
// Any screen calls useShortlist() and shares the same list — Phase 4 will
// swap the storage layer for Supabase without screens needing to change.
export function useShortlist() {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  return { ids, has, toggle }
}
