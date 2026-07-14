import { useState } from 'react'

// Fixed top-right, alongside the bottom nav — signed out it's a plain
// "Sign in" pill; signed in it collapses to an avatar chip that opens a
// one-line "who am I / sign out" dropdown on tap.
export default function AccountButton({ user, onSignIn, onSignOut }) {
  const [open, setOpen] = useState(false)

  if (!user) {
    return (
      <button className="account-btn" onClick={onSignIn}>
        Sign in
      </button>
    )
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="account-chip-wrap">
      <button className="account-avatar" onClick={() => setOpen((v) => !v)} aria-label="Account">
        {avatarUrl ? (
          <img className="avatar-img" src={avatarUrl} alt={name} />
        ) : (
          (name || '?')[0].toUpperCase()
        )}
      </button>
      {open && (
        <div className="account-dropdown">
          <p className="account-dropdown__name">{name}</p>
          <button
            className="account-dropdown__signout"
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
