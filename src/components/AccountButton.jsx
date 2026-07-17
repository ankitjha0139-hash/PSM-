import { useState } from 'react'

// variant="floating": fixed top-right, standalone on screens with no
// persistent nav of their own (onboarding, CareerDetail, PractitionerProfile
// takeovers) — signed out it's a plain "Sign in" pill; signed in it
// collapses to an avatar chip with a "who am I / sign out" dropdown.
// variant="embedded": same behavior, flow-positioned to sit inside TopNav's
// own layout instead of self-positioning with `fixed`.
// mobileOnly: also floating, but hidden at desktop widths — used on tab
// screens where the desktop top bar already has its own embedded copy, but
// the mobile bottom tab bar doesn't (see TopNav.jsx).
export default function AccountButton({ user, onSignIn, onSignOut, onOpenProfile, variant = 'floating', mobileOnly = false }) {
  const [open, setOpen] = useState(false)
  const embedded = variant === 'embedded'

  if (!user) {
    return (
      <button
        className={[
          'account-btn',
          embedded && 'account-btn--inline',
          mobileOnly && 'account-btn--mobile-only',
        ].filter(Boolean).join(' ')}
        onClick={onSignIn}
      >
        Sign in
      </button>
    )
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className={[
      'account-chip-wrap',
      embedded && 'account-chip-wrap--inline',
      mobileOnly && 'account-chip-wrap--mobile-only',
    ].filter(Boolean).join(' ')}>
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
            className="account-dropdown__profile"
            onClick={() => {
              setOpen(false)
              onOpenProfile()
            }}
          >
            My profile
          </button>
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
