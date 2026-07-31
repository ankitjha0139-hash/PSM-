import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { isMockUser, MOCK_PROFILE } from '../lib/mockAuth.js'

// Loads the signed-in user's row from the `profiles` table (see
// supabase/profiles.sql) and exposes a save() that upserts it.

// PostgREST's "the table genuinely doesn't exist yet" signal — distinct
// from auth/network errors, which should still surface for real. Only
// this specific case gets the dev-mode local fallback below, so Profile
// is testable before supabase/profiles.sql has been run.
function isMissingTableError(error) {
  return error?.code === 'PGRST205' || /Could not find the table/i.test(error?.message || '')
}

const mockKey = (userId) => `mockProfile:${userId}`

function loadMock(userId) {
  try {
    return JSON.parse(localStorage.getItem(mockKey(userId)))
  } catch {
    return null
  }
}

function saveMock(userId, row) {
  localStorage.setItem(mockKey(userId), JSON.stringify(row))
  return row
}

export function useProfile(user) {
  // The demo account's profile is hardcoded data, edited in memory only
  // (save() below never touches Supabase for it) — it never has a real
  // row to fetch, by design.
  const [profile, setProfile] = useState(() => (isMockUser(user) ? MOCK_PROFILE : null))
  const [loading, setLoading] = useState(!isMockUser(user))
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      setLoadError(null)
      return
    }
    if (isMockUser(user)) {
      setProfile(MOCK_PROFILE)
      setLoading(false)
      setLoadError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error && import.meta.env.DEV && isMissingTableError(error)) {
          console.warn('[useProfile] profiles table not found — using a local mock for dev. Run supabase/profiles.sql to use the real table.')
          setProfile(loadMock(user.id))
          setLoadError(null)
        } else {
          setProfile(data)
          setLoadError(error ? error.message : null)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const save = useCallback(
    async (fields) => {
      if (isMockUser(user)) {
        setProfile((prev) => ({ ...prev, ...fields }))
        return { error: null }
      }
      const row = { user_id: user.id, ...fields, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('profiles')
        .upsert(row)
        .select()
        .single()
      if (!error) {
        setProfile(data)
        return { error: null }
      }
      if (import.meta.env.DEV && isMissingTableError(error)) {
        setProfile(saveMock(user.id, row))
        return { error: null }
      }
      return { error }
    },
    [user]
  )

  return { profile, loading, loadError, save }
}
