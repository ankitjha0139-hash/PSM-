import { useState } from 'react'

// variant="floating": fixed top-right, standalone on screens with no
// persistent nav of their own (onboarding, CareerDetail, PractitionerProfile
// takeovers) — signed out it's a plain "Sign in" pill; signed in it
// collapses to an avatar chip with a "who am I / sign out" dropdown.
// variant="embedded": same behavior, flow-positioned to sit inside TopNav's
// own layout instead of self-positioning with `fixed`.
export default function AccountButton({ user, onSignIn, onSignOut, variant = 'floating' }) {
  const [open, setOpen] = useState(false)
  const embedded = variant === 'embedded'

  if (!user) {
    return (
      <button
        className={embedded ? 'account-btn account-btn--inline' : 'account-btn'}
        onClick={onSignIn}
      >
        Sign in
      </button>
    )
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className={embedded ? 'account-chip-wrap account-chip-wrap--inline' : 'account-chip-wrap'}>
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
