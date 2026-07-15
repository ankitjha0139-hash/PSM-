import { useState } from 'react'
import Mark from './Mark.jsx'
import AccountButton from './AccountButton.jsx'
import { MenuIcon, CloseIcon, ChevronDownIcon } from './icons.jsx'

// Full-width dark bar (sui.io-style) that replaces the old bottom-tab
// dock. Each link carries a small chevron, matching sui.io's dropdown-
// style nav items — purely visual here (these links go straight to a
// screen, not a submenu), a deliberate look-alike choice over strict
// semantic accuracy.
// Below 768px the links move into a simple toggled dropdown since four
// words plus the wordmark and account slot don't fit in one row on a
// phone (the same collapse every full-width text-link nav needs).
const TABS = [
  { id: 'explore', label: 'Explore' },
  { id: 'atlas', label: 'Atlas.ai' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'practitioners', label: 'Practitioners' },
]

export default function TopNav({ active, onNavigate, onAbout, user, onSignIn, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  // About is a takeover screen (its own back button), reached the same
  // way it already is from Landing/Compass — not one of the four tabs,
  // so it has no chevron (mirrors sui.io's own mix of plain links vs
  // dropdown-style items) and no active state to track.
  const goAbout = () => {
    setMenuOpen(false)
    onAbout()
  }

  return (
    <nav className="top-nav">
      <div className="top-nav__bar">
        <div className="top-nav__brand">
          <Mark inverted size={26} />
          <span className="top-nav__wordmark">Lighthouse.guide</span>
        </div>

        <div className="top-nav__links">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`top-nav__link ${active === tab.id ? 'top-nav__link--active' : ''}`}
              onClick={() => go(tab.id)}
            >
              {tab.label}
              <ChevronDownIcon size={11} />
            </button>
          ))}
          <button className="top-nav__link" onClick={goAbout}>
            About
          </button>
        </div>

        <div className="top-nav__right">
          <AccountButton variant="embedded" user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
          <button
            className="top-nav__toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="top-nav__menu">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`top-nav__menu-link ${active === tab.id ? 'top-nav__menu-link--active' : ''}`}
              onClick={() => go(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <button className="top-nav__menu-link" onClick={goAbout}>
            About
          </button>
        </div>
      )}
    </nav>
  )
}
