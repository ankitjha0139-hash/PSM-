import { useEffect, useState } from 'react'
import posthog from 'posthog-js'
import { supabase } from '../lib/supabaseClient.js'

// Session state shared by anything that needs to know "is someone signed
// in" — the account button, and the shortlist/booking gates. Google OAuth
// redirects the whole tab away and back, so this can't assume it's the
// same render that started the sign-in: onAuthStateChange is what actually
// catches the session once the redirect lands.
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (_event === 'SIGNED_IN') posthog.capture('signed_in')
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const signOut = () => supabase.auth.signOut()

  return { user: session?.user ?? null, loading, signInWithGoogle, signOut }
}
