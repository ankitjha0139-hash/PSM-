import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { capture, identify } from '../lib/analytics.js'
import { MOCK_CREDENTIALS, MOCK_USER } from '../lib/mockAuth.js'

// Session state shared by anything that needs to know "is someone signed
// in" — the account button, and (once wired) shortlist/booking gates.
// Google OAuth redirects the whole tab away and back, so this can't assume
// it's the same render that started the sign-in: onAuthStateChange is what
// actually catches the session once the redirect lands.
//
// A signed-in user can be either a real Supabase session (Google) or the
// hardcoded mock demo account (see ../lib/mockAuth.js) — mockUser wins
// when both would otherwise apply, though in practice only one is ever set.
export function useAuth() {
  const [session, setSession] = useState(null)
  const [mockUser, setMockUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        identify(newSession.user.id, { email: newSession.user.email })
        capture('signed_in')
      }
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

  // The one hardcoded demo login — see ../lib/mockAuth.js for why this
  // exists and why it's deliberately not a general registration system.
  const signInWithUsername = (username, password) => {
    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      // Identifying the demo account too (not skipping it) keeps signed_in
      // consistently tied to a real PostHog person either way, and gives
      // "Filter test accounts" a stable, obvious target (email: 'test')
      // instead of a different anonymous device ID every demo session.
      identify(MOCK_USER.id, { email: MOCK_USER.email })
      capture('signed_in')
      setMockUser(MOCK_USER)
      return { error: null }
    }
    return { error: { message: 'Incorrect username or password.' } }
  }

  const signOut = () => {
    setMockUser(null)
    return supabase.auth.signOut()
  }

  return {
    user: mockUser ?? session?.user ?? null,
    loading,
    signInWithGoogle,
    signInWithUsername,
    signOut,
  }
}
