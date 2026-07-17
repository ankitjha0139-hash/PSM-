import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

// Loads the signed-in user's row from the `profiles` table (see
// supabase/profiles.sql) and exposes a save() that upserts it. Same
// loading/error shape as useCareerPaths, but keyed to a specific user
// instead of one shared dataset.
export function useProfile(user) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
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
        setProfile(data)
        setLoadError(error ? error.message : null)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const save = useCallback(
    async (fields) => {
      const row = { user_id: user.id, ...fields, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('profiles')
        .upsert(row)
        .select()
        .single()
      if (!error) setProfile(data)
      return { error }
    },
    [user]
  )

  return { profile, loading, loadError, save }
}
