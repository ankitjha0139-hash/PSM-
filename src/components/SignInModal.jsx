import { useState } from 'react'
import { X, GoogleLogo } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Button from './ui/Button.jsx'

const inputClass =
  'min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500'

// Google OAuth takes over the whole tab and comes back — this modal's job
// ends the moment that redirect starts. The username/password option
// below is a permanent alternative, not a dev-only escape hatch — see
// ../lib/mockAuth.js for why it's currently just one hardcoded demo
// account rather than open registration.
export default function SignInModal({ open, onSignIn, onClose, onSignInWithUsername }) {
  const reduceMotion = useReducedMotion()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const reset = () => {
    setUsername('')
    setPassword('')
    setError(null)
  }

  const close = () => {
    reset()
    onClose()
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error: signInError } = await onSignInWithUsername(username, password)
    setBusy(false)
    if (signInError) setError(signInError.message)
    else close()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-indigo-950/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sign in"
            className="relative w-full max-w-sm rounded-3xl border border-indigo-900/10 bg-cream p-7 shadow-lift"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-indigo-900/5"
            >
              <X size={18} weight="bold" />
            </button>

            <h2 className="font-display text-xl font-semibold text-indigo-900">Sign in</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Sign in with Google to save your profile and keep it synced across devices.
            </p>

            <Button as="button" onClick={onSignIn} variant="primary" className="mt-6 w-full">
              <GoogleLogo size={18} weight="bold" /> Continue with Google
            </Button>

            <div className="mt-6 border-t border-indigo-900/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Or sign in with username and password
              </p>

              <form onSubmit={handleSignIn} className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={inputClass}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                  as="button"
                  type="submit"
                  variant="outline"
                  disabled={busy || !username || !password}
                  className="w-full"
                >
                  {busy ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
