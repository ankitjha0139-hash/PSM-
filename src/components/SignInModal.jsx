import { CloseIcon } from './icons.jsx'

// Shown wherever a signed-out visitor tries to do something that needs an
// identity (save a shortlist, book a call) or taps the account button
// directly. Google OAuth takes over the whole tab and comes back — this
// modal's job ends the moment that redirect starts.
const REASON_COPY = {
  // Shortlist itself is still localStorage-only under the hood (no
  // shortlists table yet), so promising "your shortlist is saved" would be
  // a claim we can't back up. Chat history actually works end-to-end today
  // — lead with the real thing until shortlist syncing catches up.
  shortlist: 'Sign in to keep your Atlas.ai conversations saved across visits and devices.',
  booking: 'Sign in to book a call with a practitioner.',
  'chat-history': 'Sign in to keep this conversation with Atlas.ai across visits and devices.',
  account: 'Sign in with your Google account.',
}

export default function SignInModal({ reason = 'account', onSignIn, onClose }) {
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-panel" onClick={(e) => e.stopPropagation()}>
        <button className="support-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <h3 className="screen__title screen__title--md" style={{ marginBottom: 6 }}>
          Sign in
        </h3>
        <p className="screen__sub" style={{ margin: '0 0 18px' }}>
          {REASON_COPY[reason] || REASON_COPY.account}
        </p>
        <button className="btn btn--primary" onClick={onSignIn} style={{ width: '100%' }}>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
