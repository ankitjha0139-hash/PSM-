import { useState } from 'react'
import { Lock } from '@phosphor-icons/react'
import { useAdminAuth } from '../hooks/useAdminAuth.js'
import PractitionerAdminPanel from '../components/admin/PractitionerAdminPanel.jsx'
import TestimonialAdminPanel from '../components/admin/TestimonialAdminPanel.jsx'
import Button from '../components/ui/Button.jsx'

const TABS = ['Practitioners', 'Testimonials']

// Reached only via a direct /admin URL (App.jsx checks the path, not a
// nav item — this is a root/operator tool, not something regular
// visitors should stumble into). Auth is a single hardcoded email/
// password checked server-side (netlify/functions/admin-login.mjs), not
// a Supabase Auth account — see supabase/practitioners.sql for why.
export default function Admin() {
  const { isAuthed, login, logout, handleAuthError } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState('Practitioners')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    const { error } = await login(email, password)
    setLoggingIn(false)
    if (error) setLoginError(error)
  }

  if (!isAuthed) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-5 sm:px-8">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-900 text-cream">
          <Lock size={20} weight="bold" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-indigo-900">Admin</h1>
        <p className="mt-1 text-sm text-ink-soft">Sign in to manage practitioners and testimonials.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <Button as="button" type="submit" variant="primary" disabled={loggingIn} className="w-full">
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo-900">Admin</h1>
        <button type="button" onClick={logout} className="text-sm font-semibold text-indigo-900 hover:opacity-80">
          Sign out
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`min-h-9 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t
                ? 'border-indigo-900 bg-indigo-900 text-cream'
                : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Practitioners' && <PractitionerAdminPanel onAuthError={handleAuthError} />}
        {tab === 'Testimonials' && <TestimonialAdminPanel onAuthError={handleAuthError} />}
      </div>
    </section>
  )
}
