import { useState } from 'react'
import { adminLogin, getAdminToken, clearAdminToken } from '../lib/adminApi.js'

// No proactive "is this token still valid" check on mount — presence of a
// token is enough to optimistically show the dashboard; adminFetch()
// clears the token and any admin API call will then 401, which the
// dashboard should catch and bounce back to the login screen.
export function useAdminAuth() {
  const [isAuthed, setIsAuthed] = useState(() => !!getAdminToken())

  const login = async (email, password) => {
    const { error } = await adminLogin(email, password)
    if (!error) setIsAuthed(true)
    return { error }
  }

  const logout = () => {
    clearAdminToken()
    setIsAuthed(false)
  }

  // Call this from a catch block when an admin API call throws the
  // "Session expired" error from adminFetch — drops back to the login
  // screen instead of leaving the dashboard stuck in a broken state.
  const handleAuthError = () => setIsAuthed(false)

  return { isAuthed, login, logout, handleAuthError }
}
