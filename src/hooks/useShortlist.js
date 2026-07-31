import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'shortlist'

// Shortlist state, persisted to localStorage so it survives a refresh.
// One instance lives in App.jsx and gets passed to any screen that needs
// it, so Explore and CareerDetail always agree on what's saved.
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
