import { useEffect, useRef, useState } from 'react'
import { UserCircle } from '@phosphor-icons/react'

// Signed out: a "Sign in" pill that opens SignInModal. Signed in: an
// avatar chip with a dropdown (name, "My profile", "My sessions", "Sign
// out"). Lives in TopNav — both the desktop bar and the mobile menu sheet
// render one.
export default function AccountButton({ user, onSignIn, onSignOut, onOpenProfile, onOpenSessions, compact = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  if (!user) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        className={`min-h-9 rounded-full border border-indigo-900/15 bg-white/60 px-4 text-sm font-semibold text-indigo-900 hover:border-indigo-900/30 ${compact ? 'w-full py-2.5 text-left' : 'py-1.5'}`}
      >
        {compact ? (
          <span className="inline-flex items-center gap-2">
            <UserCircle size={18} weight="bold" /> Sign in
          </span>
        ) : (
          'Sign in'
        )}
      </button>
    )
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url

  const Avatar = (
    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-900 text-sm font-semibold text-cream">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        (name || '?')[0].toUpperCase()
      )}
    </span>
  )

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-1 py-2">
          {Avatar}
          <span className="truncate text-sm font-semibold text-indigo-900">{name}</span>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-indigo-900/5"
        >
          My profile
        </button>
        <button
          type="button"
          onClick={onOpenSessions}
          className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-indigo-900/5"
        >
          My sessions
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-indigo-900/5"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Account" aria-expanded={open}>
        {Avatar}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-52 rounded-2xl border border-indigo-900/10 bg-cream p-1.5 shadow-lift"
        >
          <p className="truncate px-3 py-2 text-sm font-semibold text-indigo-900">{name}</p>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onOpenProfile()
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-indigo-900/5"
          >
            My profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onOpenSessions()
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-indigo-900/5"
          >
            My sessions
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-indigo-900/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
